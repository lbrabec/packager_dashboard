import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import * as R from 'ramda';

class Stats extends PureComponent {
  stats() {
    const { bzs, prs } = this.props.user_data
    const { static_info } = this.props.user_data

    const getAll = R.compose(R.flatten, R.values)

    const bugs = bzs.status === 204? []: getAll(bzs.data)

    const pull_requests = prs.status === 204? []: getAll(prs.data)

    const updates = getAll(static_info.data.updates)
    const overrides = getAll(static_info.data.overrides)
    const koschei = getAll(static_info.data.koschei).filter((k) => k.status=== "failing")
    const orphans = getAll(static_info.data.orphans).filter((o) => o.orphaned=== true)
    const fti = getAll(static_info.data.fails_to_install)

    return {
      bugs: bugs.length,
      prs: pull_requests.length,
      updates: updates.length,
      overrides: overrides.length,
      koschei: koschei.length,
      orphans: orphans.length,
      fti: fti.length
    }
  }

  render() {
    const { static_info } = this.props.user_data
    const stats = this.stats()

    return (
      <div className="container d-flex justify-content-between pt-4 font-weight-bold text-muted">
        <div>
          {this.props.fasuser}:
          <span data-toggle="tooltip" title="" className="ml-3 mr-2"
                data-original-title={`${this.props.fasuser} has ${static_info.data.primary_packages.length} packages`}>
            <i className="fas fa-user mr-1" /> {static_info.data.primary_packages.length}
          </span>
          <span data-toggle="tooltip" title="" className="ml-3 mr-2"
                data-original-title={`${this.props.fasuser} has ${static_info.data.packages.length} packages (including groups)`}>
            <i className="fas fa-users mr-1" /> {static_info.data.packages.length}
          </span>
          <span data-toggle="tooltip" title="" className="ml-3 mr-2"
                data-original-title={`${this.props.shownPackages} packages shown`}>
            <i className="fas fa-eye mr-1" /> {this.props.shownPackages}
          </span>
        </div>
        <div>
          <span data-toggle="tooltip" title="" className="ml-3 mr-2"
                data-original-title={`${stats.bugs} bugs`}>
            <i className="fa fa-bug mr-1" /> {stats.bugs}
          </span>
          <span data-toggle="tooltip" title="" className="ml-3 mr-2"
                data-original-title={`${stats.updates} updates`}>
            <i className="fa fa-bolt mr-1" /> {stats.updates}
          </span>
          <span data-toggle="tooltip" title="" className="ml-3 mr-2"
                data-original-title={`${stats.prs} PRs`}>
            <i className="fa fa-git mr-1" /> {stats.prs}
          </span>
          <span data-toggle="tooltip" title="" className="ml-3 mr-2"
                data-original-title={`${stats.overrides} overrides`}>
            <i className="fa fa-shapes mr-1" /> {stats.overrides}
          </span>
          <span data-toggle="tooltip" title="" className="ml-3 mr-2"
                data-original-title={`${stats.koschei} fails to build`}>
            <i className="fa fa-wrench mr-1" /> {stats.koschei}
          </span>
          <span data-toggle="tooltip" title="" className="ml-3 mr-2"
                data-original-title={`${stats.fti} fails to install`}>
            <i className="fa fa-file-medical-alt mr-1" /> {stats.fti}
          </span>
          <span data-toggle="tooltip" title="" className="ml-3"
                data-original-title={`${stats.orphans} packages orphaned`}>
            <i className="fa fa-user-slash mr-1" /> {stats.orphans}
          </span>
        </div>
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

export default connect(mapStateToProps)(Stats)
