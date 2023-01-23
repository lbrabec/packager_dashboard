import React, { PureComponent } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import * as U from "../../utils"

import { ReleasesBlock, BugStatusGrid, BugKeywordsGrid, GroupBlock } from "./OptionsItems"
import { CustomCheckbox, OptionsSwitch } from "./OptionsLayout"
import { changeOption, resetOptions, loadDashboard, setDashboardQuery } from "../../actions/reduxActions"
import "./options.css"


class Options extends PureComponent {
  constructor(props) {
    super(props)

    this.handle = this.handle.bind(this)
    this.handleACL = this.handleACL.bind(this)
  }

  handle(changeType) {
    return (e) => {
      e.stopPropagation()
      this.props.dispatch(
        changeOption({
          type: changeType,
          name: e.target.name,
          value: U.valueOfInput(e.target),
        })
      )
    }
  }

  handleACL(e) {
    if (window.location.search.includes("&required_acl=admin")) {
      const query = window.location.search.replace("&required_acl=admin", "")
      const url = "/dashboard" + query
      this.props.dispatch(setDashboardQuery(query))
      this.props.dispatch(loadDashboard(query))
      window.history.pushState({}, "", url)
    } else {
      const url = "/dashboard" + window.location.search + "&required_acl=admin"
      this.props.dispatch(setDashboardQuery(window.location.search+"&required_acl=admin"))
      this.props.dispatch(loadDashboard(window.location.search+"&required_acl=admin"))
      window.history.pushState({}, "", url)
    }
  }

  render() {
    const {
      show_schedule,
      show_calendars,
      show_stashed,
      show_bugs,
      show_cves_only,
      bug_min_priority_severity,
      bug_include_unspecified,

      sort,
      show_updates,
      show_prs,
      show_overrides,
      show_orphaned,
      show_koschei,
      show_fti,
      show_abrt_reports,

      show_groups_only,
    } = this.props.options

    const className = "pd-options " + (this.props.show ? "pd-options-shown" : "pd-options-hidden")

    return (
      <div className={className}>
        <div className="d-flex justify-content-between">
          <span>
            <span style={{ fontSize: "1.5em" }}>Filters and Options</span>
            <button
              className="btn btn-link mt-n1 ml-3 pd-options-reset"
              onClick={() => this.props.dispatch(resetOptions(this.props.fasuser))}>
              Reset
            </button>
          </span>
          <button className="close" onClick={this.props.showHandler}>
            &times;
          </button>
        </div>

        <hr />
        <div className="d-flex justify-content-between">
          {
           this.props.linked_user.is_authenticated
           ?
           <>Linked FAS: {this.props.linked_user.user}
           {!this.props.linked_user.fas_groups.includes("packager")? " (not a packager)" : null}
           <a href={window.env.UNLINK_USER}>unlink</a></>
           :
           <a href={window.env.LINK_USER}>Link FAS account</a>
          }
        </div>
        <hr />
        <form>
          <OptionsSwitch
            name="show_schedule"
            value={show_schedule}
            handler={this.handle("general")}>
            <div className="font-weight-bold">Show Fedora release schedule</div>
          </OptionsSwitch>

          {this.props.has_calendars ? (
            <>
            <OptionsSwitch
              name="show_calendars"
              value={show_calendars}
              handler={this.handle("general")}>
              <div className="font-weight-bold">Show Package Calendars</div>
            </OptionsSwitch>
            <a href="https://pagure.io/package-calendars/" className="pl-as-switch" target="_blank" rel="noreferrer">
              add calendars
            </a>
            </>
          ) : null}

          <OptionsSwitch
            name="show_stashed"
            value={show_stashed}
            handler={this.handle("general")}>
            <div className="font-weight-bold">Show stashed packages</div>
          </OptionsSwitch>

          <hr />

          <ReleasesBlock releases={this.props.releases} handler={this.handle("release")} />

          <div className="form-group">
            <label htmlFor="sort">Sort by</label>
            <select
              className="form-control"
              id="sort"
              name="sort"
              defaultValue={sort}
              onChange={this.handle("general")}>
              <option value="name">Package name</option>
              <option value="cnt">Issue count</option>
              <option value="priority">FTIs, FTBFSs and orphans first</option>
              <option value="date">Packages with the most recent items first</option>
            </select>
          </div>

          <hr />

          <OptionsSwitch name="show_bugs" value={show_bugs} handler={this.handle("general")}>
            <div className="font-weight-bold">Show bugs</div>
          </OptionsSwitch>

          <div className="pl-as-switch mt-2">
            <OptionsSwitch
              name={"show_cves_only"}
              value={show_cves_only}
              handler={this.handle("general")}>
              Show CVEs only
            </OptionsSwitch>
          </div>

          <div className="form-group pl-as-switch mt-2">
            <label htmlFor="bug_min_priority_severity">Min shown bug priority/severity</label>
            <select
              className="form-control"
              id="bug_min_priority_severity"
              name="bug_min_priority_severity"
              defaultValue={bug_min_priority_severity}
              onChange={this.handle("general")}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <CustomCheckbox
              name={"bug_include_unspecified"}
              value={bug_include_unspecified}
              handler={this.handle("general")}>
              Include unspecified
            </CustomCheckbox>
          </div>

          <div className="form-group pl-as-switch mt-3">
            <BugStatusGrid
              handler={this.handle("general")}
              grid={[
                ["NEW", "MODIFIED"],
                ["ASSIGNED", "ON_QA"],
                ["ON_DEV", "VERIFIED"],
                ["POST", "RELEASE_PENDING"],
              ]}
            />
          </div>

          <div className="form-group pl-as-switch mt-3">
            <BugKeywordsGrid handler={this.handle("bug_kw")} />
          </div>

          <OptionsSwitch name="show_updates" value={show_updates} handler={this.handle("general")}>
            <div className="font-weight-bold">Show updates</div>
          </OptionsSwitch>

          <OptionsSwitch
            name="show_overrides"
            value={show_overrides}
            handler={this.handle("general")}>
            <div className="font-weight-bold">Show overrides</div>
          </OptionsSwitch>

          <OptionsSwitch name="show_prs" value={show_prs} handler={this.handle("general")}>
            <div className="font-weight-bold">Show PRs</div>
          </OptionsSwitch>

          <OptionsSwitch
            name="show_orphaned"
            value={show_orphaned}
            handler={this.handle("general")}>
            <div className="font-weight-bold">Show orphaned</div>
          </OptionsSwitch>

          <OptionsSwitch name="show_koschei" value={show_koschei} handler={this.handle("general")}>
            <div className="font-weight-bold">Show Koschei fails</div>
          </OptionsSwitch>

          <OptionsSwitch name="show_fti" value={show_fti} handler={this.handle("general")}>
            <div className="font-weight-bold">Show fedora-health-check fails</div>
          </OptionsSwitch>

          <OptionsSwitch name="show_abrt_reports" value={show_abrt_reports} handler={this.handle("general")}>
            <div className="font-weight-bold">Show outstanding ABRT reports</div>
          </OptionsSwitch>

          <hr />
          <h5>Groups</h5>
          <label htmlFor="group_acl">Required ACL</label>
          <div className="pb-2">
            <select id="group_acl" className="custom-select" value={window.location.search.includes("&required_acl=admin")? "admin" : "commit"}
              onChange={this.handleACL}>
              <option value="commit">commit</option>
              <option value="admin">admin</option>
            </select>
          </div>
          {
            (window.location.search.includes("packages") || window.location.search.includes("users")) && (
              <OptionsSwitch name="show_groups_only" value={show_groups_only} handler={this.handle("general")}>
                <div className="font-weight-bold mb-2">Show groups only</div>
              </OptionsSwitch>
            )
          }
          <GroupBlock groups={this.props.groups} handler={this.handle("group")} groupsOnly={this.props.options.show_groups_only}/>
        </form>
      </div>
    )
  }
}

export default connect((state) => {
  return {
    fasuser: state.fasuser,
    linked_user: state.linked_user,
    options: state.options,
    releases: state.releases,
    groups:
      state.dashboard_data === undefined || state.dashboard_data.status !== 200
        ? []
        : R.pipe(
            R.map(pkg => pkg.maintainers.groups),
            R.values,
            R.flatten,
            R.uniq
        )(state.dashboard_data.packages),
    has_calendars:
      state.dashboard_data === undefined || state.dashboard_data.status !== 200
        ? false
        : R.map(pkg => pkg.data.calendars, state.dashboard_data.packages),
  }
})(Options)
