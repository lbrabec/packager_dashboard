import React, { PureComponent } from "react"
import { connect } from "react-redux"
import { changeOptionBatch } from "../../actions/reduxActions"
import * as R from "ramda"
import * as U from "../../utils"
import * as QS from 'query-string'
import $ from "jquery"

import "./stats.css"

const createLabelAndTooltip = (queryString) => {
  const queryObj = QS.parse(queryString)
  const users = R.defaultTo("", queryObj.users).split(",").filter(s => s!=="")
  const groups = R.defaultTo("", queryObj.groups).split(",").filter(s => s!=="")

  if (users.length === 1 && groups.length === 0) {
    return { label: users[0], tooltip: users[0] }
  }
  if (users.length === 0 && groups.length === 1) {
    return { label: groups[0], tooltip: groups[0] }
  }
  if (groups.length === 0) {
    return { label: "multiple users", tooltip: `users: ${users.join(", ")}` }
  }
  if (users.length === 0) {
    return { label: "multiple groups", tooltip: `groups: ${groups.join(", ")}` }
  }
  return {label: "multiple users and groups", tooltip: `users: ${users.join(", ")}<br />groups: ${groups.join(", ")}`}
}

class Stats extends PureComponent {
  render() {
    const { stats, packages } = this.props
    const { label, tooltip} = createLabelAndTooltip(window.location.search)

    const packagesCnt = R.pipe(
      R.values,
      R.filter(pkg => pkg.maintainers.users.length > 0),
      R.length
    )(packages)

    const packagesCntWithGroups = R.values(packages).length

    const spinner = this.props.isLoading ? (
      <span className="ml-3 mr-2">
        <i className="fas fa-sync-alt fa-spin"></i>
      </span>
    ) : null

    return (
      <div className="container pt-4 font-weight-bold">
        <div className="row">
          <div className="col-md-6 text-muted">
          <span
              data-toggle="tooltip"
              data-html="true"
              title=""
              className=""
              data-original-title={tooltip}>
              {label}:
            </span>
            <span
              data-toggle="tooltip"
              title=""
              className="ml-3 mr-2"
              data-original-title={`${label} has ${packagesCnt} packages`}>
              <i className="fas fa-user mr-1" /> {packagesCnt}
            </span>
            <span
              data-toggle="tooltip"
              title=""
              className="ml-3 mr-2"
              data-original-title={`${label} has ${packagesCntWithGroups} packages (including groups)`}>
              <i className="fas fa-users mr-1" /> {packagesCntWithGroups}
            </span>
            <span
              data-toggle="tooltip"
              title=""
              className="ml-3 mr-2"
              data-original-title={`${this.props.shownPackages} packages shown`}>
              <i className="fas fa-eye mr-1" /> {this.props.shownPackages}
            </span>
            {this.props.server_error?
            <span className="text-danger ml-3 mr-2">
              <i class="fas fa-exclamation-circle mr-1"></i>
              Unable to reach server
            </span>
            : null}
            {spinner}
          </div>
          <div className="col-md-6 text-left text-md-right mt-3 mt-md-0">
            <StatIcon
              category="bugs"
              icon="fa-bug"
              count={stats.bzs}
              fulltitle={`${stats.bzs} bugs`}
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
              count={stats.fails_to_install}
              fulltitle={`${stats.fails_to_install} fails in fedora-health-check (FTI/FTBFS)`}
              className="mr-4"
            />
            <StatIcon
              category="orphaned"
              icon="fa-user-slash"
              count={stats.orphans}
              fulltitle={`${stats.orphans} packages orphaned or orphan impacted`}
              className="mr-4"
            />
            <StatIcon
              category="abrt_reports"
              icon="fa-chart-area"
              count={stats.abrt_reports}
              fulltitle={`${stats.abrt_reports} outstanding ABRT reports`}
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
          show_abrt_reports: show,
          [`show_${onWhat}`]: true,
        })
      )
    }
  }

  render() {
    const isMuted = !this.props.options[`show_${this.props.category}`]
      ? "text-muted-more"
      : "text-muted"
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
  options: state.options,
}))(_StatIcon)

const mapStateToProps = (state) => {
  const { dashboard_data, fasuser, options, releases, server_error } = state
  const { packages } = dashboard_data
  return {
    packages,
    fasuser,
    options,
    releases,
    server_error,
  }
}

export default connect(mapStateToProps)(Stats)
