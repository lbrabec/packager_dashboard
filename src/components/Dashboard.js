import React, { Component } from "react"
import DashboardLayout from "./DashboardLayout"
import DashboardNonPackager from "./DashboardNonPackager"
import Widget from "./Widget"
import Stats from "./Stats"
import Timeline from "./Timeline"
import ItemsInfo from "./ItemsInfo"
import ResponsiveMasonry from "./ResponsiveMasonry"
import DashboardLoading from "./DashboardLoading"
import ModalNetwork from "./ModalNetwork"
import * as R from "ramda"
import { connect } from "react-redux"
import { setUser, loadUser, loadOptions, loadReleases, loadSchedule, loadCachingInfo } from "../actions/reduxActions"
import * as U from "../utils"
import { showAllOptions } from "../reducers"


class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchAST: {},
    }

    this.searchTimeout = undefined
    this.refreshInterval = undefined
  }

  componentDidMount() {
    this.props.dispatch(loadReleases())
    this.props.dispatch(loadSchedule())
    this.props.dispatch(loadCachingInfo())

    this.props.dispatch(loadUser(this.props.match.params.fasuser))

    if (this.props.fasuser === "") {
      // dispatch action so the user parserd from url is stored
      this.props.dispatch(setUser(this.props.match.params.fasuser))
    }

    this.props.dispatch(loadOptions(this.props.match.params.fasuser))
  }

  searchHandler(AST) {
    // debounce the setState
    clearTimeout(this.searchTimeout)
    //const value = e.target.value
    console.log(AST)
    this.searchTimeout = setTimeout(() => this.setState({ searchAST: AST }), 500)
  }

  render() {
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

    const { bzs, prs, static_info, package_versions } = this.props.user_data
    const { options, releases, } = this.props
    const { show_groups, show_schedule } = options

    const isLoading = this.props.server_error ||
                      bzs.status !== 200 || prs.status !== 200 || static_info.status !== 200
    if (!isLoading){
      if (this.refreshInterval === undefined){
        console.log(`Spawning periodic refersh, interval is ${window.env.REFRESH_INTERVAL/1000} seconds.`)
        this.refreshInterval = setInterval(() => {
          this.props.dispatch(loadUser(this.props.match.params.fasuser))
        }, window.env.REFRESH_INTERVAL)
      }
    }

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

    const package_cards = R.compose(
      R.map(
        R.map((pkg) => (
          <Widget
            title={pkg.name}
            {...pkg.data}
            ownershipIcon={ownershipIcon(pkg.name)}
            versions={package_versions.data[pkg.name]}
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
    )(filteredPackages)

    return (
      <DashboardLayout searchHandler={this.searchHandler.bind(this)}>
        <Stats
          shownPackages={package_cards[0].length + package_cards[1].length}
          isLoading={isLoading}
          stats={filteredCntPerCat}
        />
        {isLoading && !this.props.server_error ?
          <div className="container mt-4">
            <div className="alert alert-primary alert-dismissible fade show" role="alert">
              It appears you are newcomer or haven't visited the Fedora Packager Dashboard in the last {this.props.caching_info.visits_required_every_n_days} days.
              Loading could take up to a few minutes, depending on number of packages you are maintaining.
              <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div>
          : null}
        {show_schedule ? <Timeline /> : null}
        <ResponsiveMasonry items={package_cards} />
        <ItemsInfo
          hiddenDueFiltering={hiddenDueFiltering}
          shownPackages={package_cards[0].length + package_cards[1].length}
        />
        <ModalNetwork />
      </DashboardLayout>
    )
  }
}

const mapStateToProps = (state) => {
  const { user_data, fasuser, options, releases, caching_info, server_error } = state

  return {
    user_data,
    fasuser,
    options,
    releases,
    caching_info,
    server_error,
  }
}

export default connect(mapStateToProps)(Dashboard)


