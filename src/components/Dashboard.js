import React, { Component } from "react"
import Masthead from "./Masthead"
import Footer from "./Footer"
import Widget from "./Widget"
import Stats from "./Stats"
import * as R from "ramda"

import { connect } from "react-redux"

import { setUser, loadUser, loadOptions } from "../actions/reduxActions"

class DashboardLoading extends Component {
  render() {
    return (
      <div className="appEntryContainer">
        <h1>
          <i className="fas fa-spinner fa-spin"></i>
          {this.props.children}
        </h1>
      </div>
    )
  }
}

const EMPTY_ARRAY = []

const dataLen = (pkg) =>
  pkg.data.bugs.length +
  pkg.data.pull_requests.length +
  pkg.data.updates.length +
  pkg.data.overrides.length +
  pkg.data.koschei.length +
  pkg.data.fti.length +
  (pkg.data.orphan.orphaned ? 1 : 0)

class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      search: RegExp(""),
    }

    this.searchTimeout = undefined
    this.packageSort = this.packageSort.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(loadUser(this.props.match.params.fasuser))

    if (this.props.fasuser === "") {
      // dispatch action so the user parserd from url is stored
      this.props.dispatch(setUser(this.props.match.params.fasuser))
    }

    this.props.dispatch(loadOptions(this.props.match.params.fasuser))
  }

  searchHandler(re) {
    // debounce the setState
    clearTimeout(this.searchTimeout)
    //const value = e.target.value
    this.searchTimeout = setTimeout(() => this.setState({ search: re }), 500)
  }

  filterBugs(pkg) {
    const { bzs } = this.props.user_data
    const { options } = this.props
    const priorities_severities = ["unspecified", "low", "medium", "high", "urgent"]

    if (bzs.status === 204 || !options.show_bugs) return EMPTY_ARRAY

    return bzs.data[pkg].filter((bug) => {
      if (!options[`show_bug_status_${bug.status}`]) return false
      if (!options.show_bug_kw_tracking && bug.keywords.includes("Tracking")) return false
      if (!options.show_bug_kw_futurefeature && bug.keywords.includes("FutureFeature"))
        return false
      if (!options.show_bug_kw_triaged && bug.keywords.includes("Triaged")) return false
      if (!options.show_bug_kw_releasemonitoring && bug.keywords.includes("ReleaseMonitoring"))
        return false

      if (bug.priority_severity === "unspecified") return options.bug_include_unspecified
      return (
        priorities_severities.indexOf(bug.priority_severity) >=
        priorities_severities.indexOf(options.bug_min_priority_severity)
      )
    })
  }

  filterPRs(pkg) {
    const { prs } = this.props.user_data
    const { options } = this.props
    if (prs.status === 204 || !options.show_prs) return EMPTY_ARRAY

    return prs.data[pkg]
  }

  filterUpdates(pkg) {
    const { static_info } = this.props.user_data
    const { options } = this.props
    if (!options.show_updates) return EMPTY_ARRAY

    return static_info.data.updates[pkg]
  }

  filterOverrides(pkg) {
    const { static_info } = this.props.user_data
    const { options } = this.props
    if (!options.show_overrides) return EMPTY_ARRAY

    return static_info.data.overrides[pkg]
  }

  filterKoschei(pkg) {
    const { static_info } = this.props.user_data
    const { options } = this.props
    if (!options.show_koschei) return EMPTY_ARRAY

    return static_info.data.koschei[pkg].filter((k) => k.status === "failing")
  }

  filterOrphan(pkg) {
    const { static_info } = this.props.user_data
    const { options } = this.props
    if (!options.show_orphaned) return { orphaned: false, orphaned_since: null }

    return static_info.data.orphans[pkg]
  }

  filterFTI(pkg) {
    const { static_info } = this.props.user_data
    const { options } = this.props
    if (!options.show_fti) return EMPTY_ARRAY

    return static_info.data.fails_to_install[pkg]
  }

  packageSort(pkgs) {
    // pkgs in format [{name, data: {bugs,...}}]

    const { options } = this.props

    switch (options.sort) {
      case "name":
        return R.sortBy((pkg) => pkg.name.toLowerCase(), pkgs)

      case "cnt":
        return R.sortBy((pkg) => -dataLen(pkg), pkgs)

      case "priority":
        return R.sortWith(
          [
            R.descend(
              (pkg) =>
                pkg.data.koschei.length + pkg.data.fti.length + (pkg.data.orphan.orphaned ? 1 : 0)
            ),
            R.ascend((pkg) => pkg.name.toLowerCase()),
          ],
          pkgs
        )

      // fallback, sort by name
      default:
        return R.sortBy((pkg) => pkg.name.toLowerCase(), pkgs)
    }
  }

  render() {
    if (
      this.props.fasuser === "" ||
      this.props.user_data === undefined || // mind the order (lazy eval)
      this.props.user_data.static_info.status !== 200
    ) {
      return <DashboardLoading />
    }
    const { bzs, prs, static_info } = this.props.user_data
    const { options } = this.props
    const { show_groups } = options

    const excluded_packages =
      static_info.status !== 200
        ? []
        : R.compose(
            R.uniq,
            R.flatten,
            R.values,
            R.pickBy((_, group) => show_groups[group] === "never")
          )(static_info.data.group_packages)

    const packages =
      static_info.status !== 200
        ? []
        : R.compose(
            R.filter(R.test(this.state.search)),
            R.filter((pkg) => !excluded_packages.includes(pkg)),
            R.uniq,
            R.concat(static_info.data.primary_packages),
            R.flatten,
            R.values,
            R.pickBy(
              (_, group) => show_groups[group] === undefined || show_groups[group] === "always"
            )
          )(static_info.data.group_packages)

    const all_group_packages = R.compose(
      R.uniq,
      R.flatten,
      R.values
    )(static_info.data.group_packages)

    const ownershipIcon = (pkg) => {
      if (all_group_packages.includes(pkg)) {
        if (static_info.data.primary_packages.includes(pkg)) {
          // primary and group ownership
          return <i className="fas fa-user mr-1"></i>
        } else {
          // group ownership only
          return <i className="fas fa-users mr-1"></i>
        }
      } else {
        // primary ownership only
        return null
      }
    }

    const package_cards = R.compose(
      R.map((pkg) => (
        <Widget
          title={pkg.name}
          {...pkg.data}
          ownershipIcon={ownershipIcon(pkg.name)}
          key={pkg.name}
        />
      )),
      this.packageSort,
      R.filter((pkg) => dataLen(pkg) > 0),
      R.map((pkg) => ({
        name: pkg,
        data: {
          bugs: this.filterBugs(pkg),
          pull_requests: this.filterPRs(pkg),
          updates: this.filterUpdates(pkg),
          overrides: this.filterOverrides(pkg),
          koschei: this.filterKoschei(pkg),
          orphan: this.filterOrphan(pkg),
          fti: this.filterFTI(pkg),
        },
      }))
    )(packages)

    return (
      <div className="App">
        <Masthead
          bzsLoading={bzs.status !== 200}
          prsLoading={prs.status !== 200}
          siLoading={static_info.status !== 200}
          searchHandler={this.searchHandler.bind(this)}
        />
        <div className="bodycontent">
          <div className="subheader">
            <Stats shownPackages={package_cards.length} />
            <div className="container">
              <div className="card-columns py-md-4">{package_cards}</div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { user_data, fasuser, options } = state

  return {
    user_data,
    fasuser,
    options,
  }
}

export default connect(mapStateToProps)(Dashboard)
