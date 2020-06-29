import React, { Component } from "react"
import DashboardLayout from "./DashboardLayout"
import DashboardNonPackager from "./DashboardNonPackager"
import Widget from "./Widget"
import Stats from "./Stats"
import ItemsInfo from "./ItemsInfo"
import ResponsiveMasonry from "./ResponsiveMasonry"
import DashboardLoading from "./DashboardLoading"
import * as R from "ramda"
import { connect } from "react-redux"
import { setUser, loadUser, loadOptions, loadReleases } from "../actions/reduxActions"
import * as U from "../utils"
import { showAllOptions } from "../reducers"

class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      search: RegExp(""),
    }

    this.searchTimeout = undefined
  }

  componentDidMount() {
    this.props.dispatch(loadReleases())
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

  render() {
    if (
      this.props.fasuser === "" ||
      this.props.user_data === undefined || // mind the order (lazy eval)
      this.props.user_data.static_info.status !== 200
    ) {
      return <DashboardLoading />
    }

    if (this.props.user_data.static_info.data.packages.length === 0) {
      return <DashboardNonPackager />
    }

    const { bzs, prs, static_info } = this.props.user_data
    const { options, releases } = this.props
    const { show_groups } = options

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
            key={pkg.name}
          />
        ))
      ),
      U.balancedSplit,
      U.packageSort(options),
      R.filter((pkg) => R.test(this.state.search, pkg.name)),
      R.filter((pkg) => U.dataLen(pkg) > 0),
      U.filterHiddenCategories(options)
    )(filteredPackages)

    return (
      <DashboardLayout searchHandler={this.searchHandler.bind(this)}>
        <Stats
          shownPackages={package_cards[0].length + package_cards[1].length}
          isLoading={bzs.status !== 200 || prs.status !== 200 || static_info.status !== 200}
          stats={filteredCntPerCat}
        />
        <ResponsiveMasonry items={package_cards} />
        <ItemsInfo
          hiddenDueFiltering={hiddenDueFiltering}
          shownPackages={package_cards[0].length + package_cards[1].length}
        />
      </DashboardLayout>
    )
  }
}

const mapStateToProps = (state) => {
  const { user_data, fasuser, options, releases } = state

  return {
    user_data,
    fasuser,
    options,
    releases,
  }
}

export default connect(mapStateToProps)(Dashboard)


