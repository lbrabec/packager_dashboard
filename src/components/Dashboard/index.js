import React, { Component } from "react"
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
import { setUser, loadUser, loadOptions, loadPinned, loadReleases, loadSchedule,
         loadCachingInfo, loadEnvironment, getVersion, loadServiceAlerts, loadLinkedUser, saveToken } from "../../actions/reduxActions"
import * as U from "../../utils"
import { showAllOptions } from "../../reducers"
import "./dashboard.css"

const cookies = new Cookies()

class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchAST: {},
    }

    this.searchTimeout = undefined
    this.refreshInterval = {
      loadUser: undefined,
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
    this.props.dispatch(loadUser(({what: this.props.match.params.fasuser, isPackage: this.props.isPackage})))

    if (this.props.fasuser === "") {
      // dispatch action so the user parserd from url is stored
      this.props.dispatch(setUser(this.props.match.params.fasuser))
    }

    this.props.dispatch(loadOptions(this.props.match.params.fasuser))
    this.props.dispatch(loadPinned(this.props.match.params.fasuser))
  }

  searchHandler(AST) {
    // debounce the setState
    clearTimeout(this.searchTimeout)
    //const value = e.target.value
    this.searchTimeout = setTimeout(() => this.setState({ searchAST: AST }), 500)
  }

  setRefresh(what, func, param=undefined) {
    if (this.refreshInterval[what] === undefined) {
      console.log(`Spawning periodic refersh for ${what}, interval is ${window.env.REFRESH_INTERVAL/1000} seconds.`)
      this.refreshInterval[what] = setInterval(() => {
        this.props.dispatch(func(param))
      }, window.env.REFRESH_INTERVAL)
    }
  }

  render() {
    if (this.props.user_data !== undefined && this.props.user_data.static_info.status === 404) {
      return <DashboardNonPackager package={window.location.pathname.split("/")[1] === "package"}/>
    }

    if (
      this.props.fasuser === "" ||
      this.props.user_data === undefined || // mind the order (lazy eval)
      this.props.user_data.static_info.status !== 200
    ) {
      return <DashboardLoading>
        {this.props.server_error?
        <h4 className="pt-4 text-muted">Unable to reach server, retrying in 60 seconds</h4>
        :
        null}
      </DashboardLoading>
    }

    if (this.props.user_data.static_info.data.packages.length === 0) {
      return <DashboardNonPackager />
    }

    const { bzs, prs, static_info, abrt_reports } = this.props.user_data
    const { package_versions } = static_info.data
    const { options, releases, } = this.props
    const { show_groups } = options

    const isLoading = this.props.server_error ||
                      bzs.status !== 200 || prs.status !== 200 ||
                      abrt_reports.status !== 200 || static_info.status !== 200


    if (!isLoading){
      // loading user can take some time, start refresh only
      // when the first load is finished
      this.setRefresh('loadUser', loadUser, ({what: this.props.match.params.fasuser, isPackage: this.props.isPackage}))
    }
    this.setRefresh('loadSchedule', loadSchedule)
    this.setRefresh('loadReleases', loadReleases)
    this.setRefresh('loadCachingInfo', loadCachingInfo)
    this.setRefresh('getVersion', getVersion)
    this.setRefresh('loadServiceAlerts', loadServiceAlerts)

    const all_group_packages = R.compose(
      R.uniq,
      R.flatten,
      R.values
    )(static_info.data.group_packages)

    const ownershipIcon = (pkg) => {
      if (all_group_packages.includes(pkg)) {
        if (static_info.data.primary_packages.includes(pkg)) {
          // primary and group ownership
          return <i className="fas fa-user mr-1" title="package owned both directly and through group"></i>
        } else {
          // group ownership only
          return <i className="fas fa-users mr-1" title="package owned through group only"></i>
        }
      } else {
        // primary ownership only
        return null
      }
    }

    const filterCategory = U.filterCategory(options, releases, this.props.user_data)
    const dontFilterCategory = U.filterCategory(showAllOptions, releases, this.props.user_data)

    const excludedPackages = R.compose(
      R.uniq,
      R.flatten,
      R.values,
      R.pickBy((_, group) => show_groups[group] === "never")
    )(static_info.data.group_packages)

    const packages = R.compose(
      R.filter((pkg) => !excludedPackages.includes(pkg)),
      R.uniq,
      R.concat(static_info.data.primary_packages),
      R.flatten,
      R.values,
      R.pickBy((_, group) => show_groups[group] === undefined || show_groups[group] === "always")
    )(static_info.data.group_packages)

    const filteredPackages = packages.map(U.packageObject(filterCategory))
    const unfilteredPackages = static_info.data.packages.map(U.packageObject(dontFilterCategory))

    const filteredCntPerCat = U.itemsCntPerCategory(filteredPackages)
    const unfilteredCntPerCat = U.itemsCntPerCategory(unfilteredPackages)

    const hiddenDueFiltering = U.hiddenDueFiltering(
      options,
      filteredCntPerCat,
      unfilteredCntPerCat
    )

    const createPackageCards = R.compose(
      R.map(
        R.map((pkg) => (
          <Widget
            title={pkg.name}
            {...pkg.data}
            ownershipIcon={ownershipIcon(pkg.name)}
            versions={package_versions[pkg.name]}
            key={pkg.name}
            cvesOnly={options.show_cves_only}
          />
        ))
      ),
      U.balancedSplit,
      U.packageSort(options),
      //R.filter((pkg) => R.test(this.state.search, pkg.name)),
      R.filter((pkg) => U.searchMatch(this.state.searchAST, pkg.name)),
      R.filter((pkg) => U.dataLen(pkg) > 0),
      U.filterHiddenCategories(options)
    )

    const filteredPackagesPinned = filteredPackages.filter((pkg) => R.defaultTo(0, this.props.pinned[pkg.name]) ===  1)
    const filteredPackagesNormal = filteredPackages.filter((pkg) => R.defaultTo(0, this.props.pinned[pkg.name]) ===  0)
    const filteredPackagesHidden = filteredPackages.filter((pkg) => R.defaultTo(0, this.props.pinned[pkg.name]) === -1)

    const package_cards_pinned = createPackageCards(filteredPackagesPinned)
    const package_cards_normal = createPackageCards(filteredPackagesNormal)
    const package_cards_hidden = createPackageCards(filteredPackagesHidden)

    const shownPackages = package_cards_pinned[0].length + package_cards_pinned[1].length +
                          package_cards_normal[0].length + package_cards_normal[1].length +
                          package_cards_hidden[0].length + package_cards_hidden[1].length

    return (
      <DashboardLayout searchHandler={this.searchHandler.bind(this)}>
        <StgAlert />
        <VersionAlert />
        <ServiceAlerts />
        <Stats
          shownPackages={shownPackages}
          isLoading={isLoading}
          stats={filteredCntPerCat}
        />
        <NewcomerAlert show={isLoading && !this.props.server_error} />
        <Timeline />
        <PackageCalendars />
        <ResponsiveMasonry items={package_cards_pinned} />
        <ResponsiveMasonry items={package_cards_normal} />
        <ResponsiveMasonry items={package_cards_hidden} />
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
  const { user_data, fasuser, options, pinned, releases, caching_info, server_error, environment } = state

  return {
    user_data,
    fasuser,
    options,
    pinned,
    releases,
    caching_info,
    server_error,
    environment,
  }
}

export default connect(mapStateToProps)(Dashboard)


