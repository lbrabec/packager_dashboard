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


const filterBugsByOptions = (bugs, options) => {
  const severities = ["unspecified", "low", "medium", "high", "urgent"]

  if(!options.show_bugs)
    return []

  return bugs.filter((bug) => {
    if(bug.severity === "unspecified")
      return options.bug_include_unspecified

    return severities.indexOf(bug.severity) >= severities.indexOf(options.bug_min_severity)
  })
}


class Dashboard extends Component {
  componentDidMount() {
    this.props.dispatch(loadUser(this.props.match.params.fasuser))

    if(this.props.fasuser === "") {
      // dispatch action so the user parserd from url is stored
      this.props.dispatch(setUser(this.props.match.params.fasuser))
    }

    this.props.dispatch(loadOptions(this.props.match.params.fasuser))
  }

  render() {
    if (this.props.fasuser === "" || this.props.user_data === undefined) {
      return (<DashboardLoading />)
    }
    const { bzs, prs, static_info } = this.props.user_data
    const {
      show_bugs,
      show_updates,
      show_prs,
      show_overrides,
      show_orphaned,
      show_koschei,
      show_groups
     } = this.props.options

    const excluded_packages = static_info.status !== 200? [] : R.compose(
      R.uniq,
      R.flatten,
      R.values,
      R.pickBy((_, group) => show_groups[group] === "never")
    )(static_info.data.group_packages)

    const packages = static_info.status !== 200? [] : R.compose(
      R.filter((pkg) => !excluded_packages.includes(pkg)),
      R.uniq,
      R.concat(static_info.data.primary_packages),
      R.flatten,
      R.values,
      R.pickBy((_, group) => show_groups[group] === undefined || show_groups[group] === "always")
    )(static_info.data.group_packages)

    const packages_with_data = packages.filter((pkg_name) => {
      //const bugs_cnt = bzs.status === 204 || !show_bugs ? 0 : bzs.data[pkg_name].length
      const bugs_cnt = bzs.status === 204? 0 : filterBugsByOptions(bzs.data[pkg_name], this.props.options).length
      const pull_requests_cnt = prs.status === 204 || !show_prs? 0 : prs.data[pkg_name].length
      const updates_cnt = !show_updates? 0 : static_info.data.updates[pkg_name].length
      const overrides_cnt = !show_overrides? 0 : static_info.data.overrides[pkg_name].length
      const koschei = !show_koschei? 0 : static_info.data.koschei[pkg_name].filter((k) => k.status=== "failing").length
      const orphan = static_info.data.orphans[pkg_name].orphaned && show_orphaned? 1 : 0

      return bugs_cnt + pull_requests_cnt + updates_cnt + overrides_cnt + koschei + orphan > 0
    })

  const packages_cards = R.sortBy((pkg) => pkg.toLowerCase(), [...new Set(packages_with_data)]).map((pkg_name)=>(
    <Widget title={pkg_name}
            //bugs={bzs.status === 204 || !show_bugs ? [] : bzs.data[pkg_name]}
            bugs={bzs.status === 204 ? [] : filterBugsByOptions(bzs.data[pkg_name], this.props.options)}
            pull_requests={prs.status === 204 || !show_prs? [] : prs.data[pkg_name]}
            updates={!show_updates? [] : static_info.data.updates[pkg_name]}
            overrides={!show_overrides? [] : static_info.data.overrides[pkg_name]}
            orphan={!show_orphaned? {orphaned: false, orphaned_since: null} : static_info.data.orphans[pkg_name]}
            koschei={!show_koschei? [] : static_info.data.koschei[pkg_name].filter((k) => k.status=== "failing")}
            isPrimary={static_info.data.primary_packages.includes(pkg_name)}
            key={pkg_name}
    />
  ))

  return (
    <div className="App">
      <Masthead bzsLoading={bzs.status !== 200} prsLoading={prs.status !== 200} siLoading={static_info.status !== 200} />
      <div className="bodycontent">
        <div className="subheader">
          <div className="container">
            <div className="card-columns py-md-4">
              {packages_cards}
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
