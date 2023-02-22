import React, { Component } from "react"
import { Navigate } from "react-router"
import Cookies from "universal-cookie"
import DashboardLayout from "./DashboardLayout"
import DashboardNonPackager from "./DashboardNonPackager"
import DashboardLoading from "./DashboardLoading"
import Widget from "../Widget"
import { StgAlert, ServiceAlerts, VersionAlert, NewcomerAlert } from "../Alerts"
import Stats from "../Stats"
import Timeline from "../Timeline"
import PackageCalendars from "../PackageCalendars"
import ItemsInfo from "./ItemsInfo"
import ResponsiveMasonry from "../ResponsiveMasonry"
import ModalNetwork from "../ModalNetwork"
import * as R from "ramda"
import { connect } from "react-redux"
import { loadOptions, loadPinned, loadReleases, loadSchedule, loadCachingInfo, loadEnvironment,
         getVersion, loadServiceAlerts, loadLinkedUser, saveToken, loadDashboard,
         setDashboardQuery } from "../../actions/reduxActions"
import * as U from "../../utils"
import { showAllOptions } from "../../reducers"
import "./dashboard.css"
import queryString from 'query-string'

import * as UNG from "../../utilsNG"

const cookies = new Cookies()

class DashboardNG extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchAST: {},
    }

    this.searchTimeout = undefined
    this.refreshInterval = {
      loadDashboard: undefined,
      loadSchedule: undefined,
      loadReleases: undefined,
      loadCachingInfo: undefined,
      getVersion: undefined
    }
  }

  componentDidMount() {
    if (cookies.get("token") !== undefined) {
      console.log("found token in cookies...")
      this.props.dispatch(saveToken(cookies.get("token")))
    }

    this.props.dispatch(loadEnvironment())
    this.props.dispatch(loadReleases())
    this.props.dispatch(loadSchedule())
    this.props.dispatch(loadCachingInfo())
    this.props.dispatch(getVersion())
    this.props.dispatch(loadServiceAlerts())
    this.props.dispatch(loadLinkedUser())

    if (this.props.dashboard_query === "") {
      this.props.dispatch(setDashboardQuery(window.location.search))
    }
    this.props.dispatch(loadDashboard(window.location.search))

    this.props.dispatch(loadOptions(window.location.search))
    this.props.dispatch(loadPinned(window.location.search))

    this.scheduleRefresh()
  }

  searchHandler(AST) {
    // debounce the setState
    clearTimeout(this.searchTimeout)
    //const value = e.target.value
    this.searchTimeout = setTimeout(() => this.setState({ searchAST: AST }), 500)
  }

  setRefresh(what, func, param=undefined, interval=window.env.REFRESH_INTERVAL) {
    if (this.refreshInterval[what] === undefined) {
      console.log(`Spawning periodic refersh for ${what}, interval is ${interval/1000} seconds.`)
      this.refreshInterval[what] = setInterval(() => {
        this.props.dispatch(func(param))
      }, interval)
    }
  }

  scheduleRefresh() {
    this.setRefresh('loadDashboard', loadDashboard, window.location.search, 1000*30)
    var watchDogInterval = setInterval(() => {
      console.log("watchdog is checking")
      const isLoading = this.props.server_error || this.props.dashboard_data === undefined || this.props.dashboard_data.status !== 200
      if (!isLoading) {
        console.log("200, setting up standard periodic refresh")
        clearInterval(this.refreshInterval['loadDashboard'])
        this.refreshInterval['loadDashboard'] = undefined
        this.setRefresh('loadDashboard', loadDashboard, window.location.search)
        clearInterval(watchDogInterval)
        console.log("watchdog exiting")
      }
    }, 1000)
    this.setRefresh('loadSchedule', loadSchedule)
    this.setRefresh('loadReleases', loadReleases)
    this.setRefresh('loadCachingInfo', loadCachingInfo)
    this.setRefresh('getVersion', getVersion)
    this.setRefresh('loadServiceAlerts', loadServiceAlerts)
  }

  render() {
    const query = queryString.parse(window.location.search)
    if (R.isEmpty(query)) {
      console.log("query is empty, redirecting to /")
      return <Navigate to="/" />
    }

    if (this.props.dashboard_query === "" ||
        this.props.dashboard_data === undefined ||
        this.props.dashboard_data.status > 202) {
          return <DashboardLoading serverError={this.props.server_error} />
    }

    if (R.isEmpty(this.props.dashboard_data.packages)) {
      return <DashboardNonPackager />
    }

    const { options, dashboard_data, pinned, releases } = this.props

    const isLoading = this.props.server_error || this.props.dashboard_data.status !== 200

    const packages = R.pipe(
      UNG.convertToPDStyle,
    )(dashboard_data.packages)

    const excludedPackages = options.show_groups_only?
    R.pipe(
      R.filter((pkg) => pkg.maintainers.users.length !== 0),
      R.map(R.prop("name")),
    )(packages)
    :
    R.pipe(
      R.filter((pkg) => pkg.maintainers.groups.map(group => options.show_groups[group] === "never").some(R.identity)),
      R.map(R.prop("name")),
    )(packages)

    const filteredPackages = R.pipe(
      R.filter((pkg) => pkg.maintainers.groups.length === 0 ||
                        pkg.maintainers.groups
                        .map(group => options.show_groups[group] === "always" ||
                                      options.show_groups[group] === undefined)
                        .some(R.identity) ||
                        (pkg.maintainers.users.length > 0 &&
                        pkg.maintainers.groups
                        .map(group => options.show_groups[group] === "mine")
                        .some(R.identity))
      ),
      R.filter((pkg) => !excludedPackages.includes(pkg.name)),
      R.map(UNG.filterPackage(options, releases)),
    )(packages)

    const filteredCntPerCategory = UNG.itemsCntPerCategory(filteredPackages)
    const unfilteredCntPerCategory = UNG.itemsCntPerCategory(R.map(UNG.filterPackage(showAllOptions, releases))(packages))

    const filteredPackagesAndCat = filteredPackages.map(UNG.filterCategories(options))
    const { packagesPinned,  packagesNormal, packagesStashed } = UNG.splitByPinning(filteredPackagesAndCat, pinned)

    const createPackageCards = R.pipe(
      R.filter((pkg) => UNG.dataLen(pkg) > 0),
      R.filter((pkg) => UNG.searchMatch(this.state.searchAST, pkg.name)),
      UNG.balancedSplit,
      R.map(R.map(pkg => {
        return <Widget
                  title={pkg.name}
                  {...pkg.data}
                  ownershipIcon={UNG.ownershipIcon(pkg)}
                  key={pkg.name}
                  cvesOnly={options.show_cves_only}
                  isFreeze={releases.branched_frozen}
                  branched={releases.branched}
                />
      })),
    )

    const packageCardsPinned = createPackageCards(packagesPinned)
    const packageCardsNormal = createPackageCards(packagesNormal)
    const packageCardsStashed = createPackageCards(packagesStashed)

    const hiddenDueFiltering = U.hiddenDueFiltering(
      options,
      filteredCntPerCategory,
      unfilteredCntPerCategory
    ) || (packageCardsStashed[0].length + packageCardsStashed[1].length > 0 && !options.show_stashed)

    const shownPackages = packageCardsPinned[0].length + packageCardsPinned[1].length +
                          packageCardsNormal[0].length + packageCardsNormal[1].length +
                          packageCardsStashed[0].length + packageCardsStashed[1].length

    return (
      <DashboardLayout searchHandler={this.searchHandler.bind(this)}>
        <StgAlert />
        <VersionAlert />
        <ServiceAlerts />
        <Stats
          shownPackages={shownPackages}
          isLoading={isLoading}
          stats={filteredCntPerCategory}
        />
        <NewcomerAlert show={isLoading && !this.props.server_error} />
        <Timeline />
        <PackageCalendars />
        <ResponsiveMasonry items={packageCardsPinned} />
        <ResponsiveMasonry items={packageCardsNormal} />
        {options.show_stashed && <ResponsiveMasonry items={packageCardsStashed} />}

        <ItemsInfo
          hiddenDueFiltering={hiddenDueFiltering}
          shownPackages={shownPackages}
        />
        <ModalNetwork />
      </DashboardLayout>
    )
  }
}

const mapStateToProps = (state) => {
  const { user_data, fasuser, options, pinned, releases, caching_info, server_error, environment,
          dashboard_query, dashboard_data } = state

  return {
    user_data,
    fasuser,
    options,
    pinned,
    releases,
    caching_info,
    server_error,
    environment,
    dashboard_query,
    dashboard_data,
  }
}

export default connect(mapStateToProps)(DashboardNG)


