import React, { PureComponent } from "react"
import { connect } from "react-redux"
import { changeOptionBatch } from "../actions/reduxActions"
import * as R from "ramda"
import * as U from "../utils"
import $ from "jquery"

class Stats extends PureComponent {
  stats() {
    const { bzs, prs } = this.props.user_data
    const { static_info } = this.props.user_data

    const getAll = R.compose(R.flatten, R.values)

    const bugs = bzs.status === 204 ? [] : getAll(bzs.data)

    const pull_requests = prs.status === 204 ? [] : getAll(prs.data)

    const updates = getAll(static_info.data.updates)
    const overrides = getAll(static_info.data.overrides)
    const koschei = getAll(static_info.data.koschei).filter((k) => k.status === "failing")
    const orphans = getAll(static_info.data.orphans).filter(
      (o) => o.orphaned || o.depends_on_orphaned
    )
    const fti = getAll(static_info.data.fails_to_install)

    return {
      bugs: bugs.length,
      prs: pull_requests.length,
      updates: updates.length,
      overrides: overrides.length,
      koschei: koschei.length,
      orphans: orphans.length,
      fti: fti.length,
    }
  }

  render() {
    const { static_info } = this.props.user_data
    const stats = this.stats()

    const spinner = this.props.isLoading ? (
      <span className="ml-3 mr-2">
        <i className="fas fa-sync-alt fa-spin"></i>
      </span>
    ) : null

    return (
      <div className="container pt-4 font-weight-bold">
        <div className="row">
          <div className="col-md-6 text-muted">
            {this.props.fasuser}:
            <span
              data-toggle="tooltip"
              title=""
              className="ml-3 mr-2"
              data-original-title={`${this.props.fasuser} has ${static_info.data.primary_packages.length} packages`}>
              <i className="fas fa-user mr-1" /> {static_info.data.primary_packages.length}
            </span>
            <span
              data-toggle="tooltip"
              title=""
              className="ml-3 mr-2"
              data-original-title={`${this.props.fasuser} has ${static_info.data.packages.length} packages (including groups)`}>
              <i className="fas fa-users mr-1" /> {static_info.data.packages.length}
            </span>
            <span
              data-toggle="tooltip"
              title=""
              className="ml-3 mr-2"
              data-original-title={`${this.props.shownPackages} packages shown`}>
              <i className="fas fa-eye mr-1" /> {this.props.shownPackages}
            </span>
            {spinner}
          </div>
          <div className="col-md-6 text-left text-md-right mt-3 mt-md-0">
            <StatIcon
              category="bugs"
              icon="fa-bug"
              count={stats.bugs}
              fulltitle={`${stats.bugs} bugs`}
              className="ml-0 ml-md-3 mr-4"
            />
            <StatIcon
              category="updates"
              icon="fa-bolt"
              count={stats.updates}
              fulltitle={`${stats.updates} updates`}
              className="mr-4"
            />
            <StatIcon
              category="overrides"
              icon="fa-shapes"
              count={stats.overrides}
              fulltitle={`${stats.overrides} overrides`}
              className="mr-4"
            />
            <StatIcon
              category="prs"
              icon="fa-git"
              count={stats.prs}
              fulltitle={`${stats.prs} PRs`}
              className="mr-4"
            />
            <StatIcon
              category="koschei"
              icon="fa-wrench"
              count={stats.koschei}
              fulltitle={`${stats.koschei} fails in koschei (FTBFS)`}
              className="mr-4"
            />
            <StatIcon
              category="fti"
              icon="fa-file-medical-alt"
              count={stats.fti}
              fulltitle={`${stats.fti} fails in fedora-health-check (FTI/FTBFS)`}
              className="mr-4"
            />
            <StatIcon
              category="orphaned"
              icon="fa-user-slash"
              count={stats.orphans}
              fulltitle={`${stats.orphans} packages orphaned`}
            />
          </div>
        </div>
      </div>
    )
  }
}

class _StatIcon extends PureComponent {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }

  handleClick(onWhat) {
    const show = U.onlyCategoryShown(this.props.options, onWhat)
    return (e) => {
      this.props.dispatch(
        changeOptionBatch({
          show_bugs: show,
          show_updates: show,
          show_prs: show,
          show_overrides: show,
          show_orphaned: show,
          show_koschei: show,
          show_fti: show,
          [`show_${onWhat}`]: true,
        })
      )
    }
  }

  render() {
    const isMuted = !this.props.options[`show_${this.props.category}`] ? "text-muted-more" : "text-muted"
    const extraClasses = this.props.className || ""
    return (
      <span
        data-toggle="tooltip"
        title=""
        className={`${extraClasses} text-nowrap pointer ${isMuted}`}
        data-original-title={this.props.fulltitle}
        onClick={this.handleClick(this.props.category)}>
        <i className={`fa ${this.props.icon} mr-1`} /> {this.props.count}
      </span>
    )
  }
}
const StatIcon = connect((state) => ({
  options: state.options
}))(_StatIcon)

const mapStateToProps = (state) => {
  const { user_data, fasuser, options } = state

  return {
    user_data,
    fasuser,
    options,
  }
}

export default connect(mapStateToProps)(Stats)
