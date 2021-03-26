import React, { PureComponent } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import * as U from "../../utils"

import { ReleasesBlock, BugStatusGrid, BugKeywordsGrid, GroupBlock } from "./OptionsItems"
import { CustomCheckbox, OptionsSwitch } from "./OptionsLayout"
import { changeOption, resetOptions } from "../../actions/reduxActions"
import "./options.css"


class Options extends PureComponent {
  constructor(props) {
    super(props)

    this.handle = this.handle.bind(this)
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

  render() {
    const {
      show_schedule,
      show_calendars,
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
    } = this.props.options

    const className = "pd-options " + (this.props.show ? "pd-options-shown" : "pd-options-hidden")

    return (
      <div className={className}>
        <div className="d-flex justify-content-between">
          <span>
            <span style={{ fontSize: "1.5em" }}>Options</span>
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
           <>FAS account linked: {this.props.linked_user.user} <a href={window.env.UNLINK_USER}>unlink</a></>
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
            <OptionsSwitch
              name="show_calendars"
              value={show_calendars}
              handler={this.handle("general")}>
              <div className="font-weight-bold">Show Package Calendars</div>
            </OptionsSwitch>
          ) : null}

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

          <hr />
          <GroupBlock groups={this.props.groups} handler={this.handle("group")} />
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
      state.user_data === undefined || state.user_data.static_info.status !== 200
        ? []
        : R.keys(state.user_data.static_info.data.group_packages),
    has_calendars:
      state.user_data === undefined
        ? false
        : R.compose(
            R.length,
            R.keys,
            R.filter((p) => !R.isNil(p))
          )(state.user_data.static_info.data.calendars),
  }
})(Options)
