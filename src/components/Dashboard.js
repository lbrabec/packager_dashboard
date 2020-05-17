import React, { Component } from 'react';
import Masthead from './Masthead';
import Footer from './Footer';
import Widget from './Widget';
import * as R from 'ramda';

import { connect } from 'react-redux'

import { setUser, loadUser } from '../actions/reduxActions'


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
  componentDidMount() {
    this.props.dispatch(loadUser(this.props.match.params.fasuser))

    if(this.props.fasuser === "") {
      // dispatch action so the user parserd from url is stored
      this.props.dispatch(setUser(this.props.match.params.fasuser))
    }
  }

  render() {
    if (this.props.user_data === undefined) {
      return (<DashboardLoading />)
    }

    const { bzs, prs, static_info } = this.props.user_data
    const {
      show_bugs,
      show_updates,
      show_prs,
      show_overrides,
      show_orphanned
     } = this.props.options

    const packages = static_info.status !== 200? [] : static_info.data.packages

    const packages_with_data = packages.filter((pkg_name) => {

      const bugs_cnt = bzs.status === 204 || !show_bugs ? 0 : bzs.data[pkg_name].length
      const pull_requests_cnt = prs.status === 204 || !show_prs? 0 : prs.data[pkg_name].length
      const updates_cnt = !show_updates? 0 : static_info.data.updates[pkg_name].length
      const overrides_cnt = !show_overrides? 0 : static_info.data.overrides[pkg_name].length
      const orphan = static_info.data.orphans[pkg_name].orphanned && show_orphanned? 1 : 0

      return bugs_cnt + pull_requests_cnt + updates_cnt + overrides_cnt + orphan > 0
    })
    /*
    const packages_grid = R.splitEvery(2, [...new Set(packages_with_data)]).map((pair) => (
      <div className="row py-md-4" key={pair[0]+pair[1]}>
        {pair.map((pkg_name) => (
          <div className="col-md-6 py-3 py-sm-3 py-md-0" key={pkg_name}>
            <Widget title={pkg_name}
                    bugs={bzs.status === 204? [] : bzs.data[pkg_name]}
                    pull_requests={prs.status === 204? [] : prs.data[pkg_name]}
                    updates={static_info.data.updates[pkg_name]}
                    overrides={static_info.data.overrides[pkg_name]}
                    orphan={static_info.data.orphans[pkg_name]}/>
          </div>
        ))}
      </div>
    ))

    return (
      <div className="App">
        <Masthead bzsLoading={bzs.status !== 200} prsLoading={prs.status !== 200} siLoading={static_info.status !== 200} />
        <div className="bodycontent pb-3">
          <div className="subheader">
            <div className="container">
              {packages_grid}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
    */

  const packages_cards = R.sortBy((pkg) => pkg.toLowerCase(), [...new Set(packages_with_data)]).map((pkg_name)=>(
    <Widget title={pkg_name}
            bugs={bzs.status === 204 || !show_bugs ? [] : bzs.data[pkg_name]}
            pull_requests={prs.status === 204 || !show_prs? [] : prs.data[pkg_name]}
            updates={!show_updates? [] : static_info.data.updates[pkg_name]}
            overrides={!show_overrides? [] : static_info.data.overrides[pkg_name]}
            orphan={!show_orphanned? {orphanned: false, orphanned_since: null} : static_info.data.orphans[pkg_name]}
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
