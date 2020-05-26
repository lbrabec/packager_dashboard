import React, { Component } from 'react';
import Masthead from './Masthead';
import Footer from './Footer';
import Widget from './Widget';
import * as R from 'ramda';

import { connect } from 'react-redux'

import { setUser, loadUser, loadOptions } from '../actions/reduxActions'


class DashboardLoading extends Component {
  render(){
      return (
          <div className="appEntryContainer">
              <h1><i className="fas fa-spinner fa-spin"></i>{this.props.children}</h1>
          </div>
      )
  }
}

class Dashboard extends Component {
  constructor(props){
    super(props)

    this.state = {
      search: RegExp("")
    }

    this.searchTimeout = undefined
  }

  componentDidMount() {
    this.props.dispatch(loadUser(this.props.match.params.fasuser))

    if(this.props.fasuser === "") {
      // dispatch action so the user parserd from url is stored
      this.props.dispatch(setUser(this.props.match.params.fasuser))
    }

    this.props.dispatch(loadOptions(this.props.match.params.fasuser))
  }

  searchHandler(re){
    // debounce the setState
    clearTimeout(this.searchTimeout)
    //const value = e.target.value
    this.searchTimeout = setTimeout(() => this.setState({search: re}), 500)
  }

  filterBugs(pkg) {
    const { bzs } = this.props.user_data
    const { options } = this.props
    const severities = ["unspecified", "low", "medium", "high", "urgent"]

    if(bzs.status === 204 || !options.show_bugs)
      return []

    return bzs.data[pkg].filter((bug) => {
      if(bug.severity === "unspecified")
        return options.bug_include_unspecified

      return severities.indexOf(bug.severity) >= severities.indexOf(options.bug_min_severity)
    })
  }

  filterPRs(pkg) {
    const { prs } = this.props.user_data
    const { options } = this.props
    if(prs.status === 204 || !options.show_prs)
      return []

    return prs.data[pkg]
  }

  filterUpdates(pkg) {
    const { static_info } = this.props.user_data
    const { options } = this.props
    if(!options.show_updates)
      return []

    return static_info.data.updates[pkg]
  }

  filterOverrides(pkg) {
    const { static_info } = this.props.user_data
    const { options } = this.props
    if(!options.show_overrides)
      return []

    return static_info.data.overrides[pkg]
  }

  filterKoschei(pkg) {
    const { static_info } = this.props.user_data
    const { options } = this.props
    if(!options.show_koschei)
      return []

    return static_info.data.koschei[pkg].filter((k) => k.status=== "failing")
  }

  filterOrphan(pkg) {
    const { static_info } = this.props.user_data
    const { options } = this.props
    if(!options.show_orphaned)
      return {orphaned: false, orphaned_since: null}

    return static_info.data.orphans[pkg]
  }

  render() {
    if (this.props.fasuser === "" || this.props.user_data === undefined) {
      return (<DashboardLoading />)
    }
    const { bzs, prs, static_info } = this.props.user_data
    const { options } = this.props
    const { show_groups } = options

    const excluded_packages = static_info.status !== 200? [] : R.compose(
      R.uniq,
      R.flatten,
      R.values,
      R.pickBy((_, group) => show_groups[group] === "never")
    )(static_info.data.group_packages)

    const packages = static_info.status !== 200? [] : R.compose(
      R.filter(R.test(this.state.search)),
      R.filter((pkg) => !excluded_packages.includes(pkg)),
      R.uniq,
      R.concat(static_info.data.primary_packages),
      R.flatten,
      R.values,
      R.pickBy((_, group) => show_groups[group] === undefined || show_groups[group] === "always")
    )(static_info.data.group_packages)

  const package_cards_ng = R.compose(
    R.map(pkg => (
      <Widget title={pkg.name} {...pkg.data} isPrimary={static_info.data.primary_packages.includes(pkg.name)} key={pkg.name}/>
    )),
    R.filter(pkg => {
      return pkg.data.bugs.length +
             pkg.data.pull_requests.length +
             pkg.data.updates.length +
             pkg.data.overrides.length +
             pkg.data.koschei.length +
            (pkg.data.orphan.orphaned? 1 : 0) > 0
    }),
    R.map(pkg => ({name: pkg, data: {
      bugs: this.filterBugs(pkg),
      pull_requests: this.filterPRs(pkg),
      updates: this.filterUpdates(pkg),
      overrides: this.filterOverrides(pkg),
      koschei: this.filterKoschei(pkg),
      orphan: this.filterOrphan(pkg)
    }})),
    R.sortBy(pkg => pkg.toLowerCase())
  )(packages)

  return (
    <div className="App">
      <Masthead bzsLoading={bzs.status !== 200} prsLoading={prs.status !== 200} siLoading={static_info.status !== 200}
                searchHandler={this.searchHandler.bind(this)} />
      <div className="bodycontent">
        <div className="subheader">
          <div className="container">
            <div className="card-columns py-md-4">
              {package_cards_ng}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
  }
}

const mapStateToProps = state => {
  const { user_data, fasuser, options } = state

  return {
    user_data,
    fasuser,
    options
  }
}

export default connect(mapStateToProps)(Dashboard)
