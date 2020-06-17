import React, { Component } from "react"
import { changeOption, resetOptions } from "../actions/reduxActions"
import { connect } from "react-redux"
import * as R from "ramda"
import * as U from "../utils"

import { ReleasesBlock, BugStatusGrid, BugKeywordsGrid, GroupBlock } from "./ModalOptionsItems"
import { ModalOptionsLayout } from "./ModalOptionsLayout"
import { CustomCheckbox, GroupTriSwitch, OptionsSwitch } from "./ModalOptionsLayout"

class ModalOptions extends Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleGroupChange = this.handleGroupChange.bind(this)
    this.handleRelease = this.handleRelease.bind(this)
    this.handleKwChange = this.handleKwChange.bind(this)
  }

  handleChange(e) {
    e.stopPropagation()
    this.props.dispatch(
      changeOption({
        type: "general",
        name: e.target.name,
        value: U.valueOfInput(e.target),
      })
    )
  }

  handleGroupChange(e) {
    e.stopPropagation()
    this.props.dispatch(
      changeOption({
        type: "group",
        name: e.target.name,
        value: U.valueOfInput(e.target),
      })
    )
  }

  handleRelease(e) {
    e.stopPropagation()
    this.props.dispatch(
      changeOption({
        type: "release",
        name: e.target.name,
        value: U.valueOfInput(e.target),
      })
    )
  }

  handleKwChange(e) {
    e.stopPropagation()
    this.props.dispatch(
      changeOption({
        type: "bug_kw",
        name: e.target.name,
        value: U.valueOfInput(e.target),
      })
    )
  }

  render() {
    const {
      show_bugs,
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

    return (
      <ModalOptionsLayout reset={() => this.props.dispatch(resetOptions(this.props.fasuser))}>
        <form>
          <ReleasesBlock releases={this.props.releases} handler={this.handleRelease} />

          <div className="form-group">
            <label htmlFor="sort">Sort by</label>
            <select
              className="form-control"
              id="sort"
              name="sort"
              defaultValue={sort}
              onChange={this.handleChange}>
              <option value="name">Package name</option>
              <option value="cnt">Issue count</option>
              <option value="priority">FTIs, FTBFSs and orphans first</option>
            </select>
          </div>

          <hr />

          <OptionsSwitch name="show_bugs" value={show_bugs} handler={this.handleChange}>
            <div className="font-weight-bold">Show bugs</div>
          </OptionsSwitch>

          <div className="form-group pl-as-switch mt-2">
            <label htmlFor="bug_min_priority_severity">Min shown bug priority/severity</label>
            <select
              className="form-control"
              id="bug_min_priority_severity"
              name="bug_min_priority_severity"
              defaultValue={bug_min_priority_severity}
              onChange={this.handleChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <div className="custom-control custom-checkbox mt-1">
              <input
                type="checkbox"
                className="custom-control-input"
                id="bug_include_unspecified"
                name="bug_include_unspecified"
                checked={bug_include_unspecified}
                onChange={this.handleChange}
              />
              <label className="custom-control-label" htmlFor="bug_include_unspecified">
                Include unspecified
              </label>
            </div>
          </div>

          <div className="form-group pl-as-switch mt-3">
            <BugStatusGrid
              handler={this.handleChange}
              grid={[
                ["NEW", "MODIFIED"],
                ["ASSIGNED", "ON_QA"],
                ["ON_DEV", "VERIFIED"],
                ["POST", "RELEASE_PENDING"],
              ]}
            />
          </div>

          <div className="form-group pl-as-switch mt-3">
            <BugKeywordsGrid handler={this.handleKwChange} />
          </div>

          <OptionsSwitch name="show_updates" value={show_updates} handler={this.handleChange}>
            <div className="font-weight-bold">Show updates</div>
          </OptionsSwitch>

          <OptionsSwitch name="show_prs" value={show_prs} handler={this.handleChange}>
            <div className="font-weight-bold">Show PRs</div>
          </OptionsSwitch>

          <OptionsSwitch name="show_overrides" value={show_overrides} handler={this.handleChange}>
            <div className="font-weight-bold">Show overrides</div>
          </OptionsSwitch>

          <OptionsSwitch name="show_orphaned" value={show_orphaned} handler={this.handleChange}>
            <div className="font-weight-bold">Show orphanned</div>
          </OptionsSwitch>

          <OptionsSwitch name="show_koschei" value={show_koschei} handler={this.handleChange}>
            <div className="font-weight-bold">Show Koschei fails</div>
          </OptionsSwitch>

          <OptionsSwitch name="show_fti" value={show_fti} handler={this.handleChange}>
            <div className="font-weight-bold">Show fedora-health-check fails</div>
          </OptionsSwitch>

          <hr />
          <h5>Groups</h5>

          <GroupBlock groups={this.props.groups} handler={this.handleGroupChange} />
        </form>

        <hr />
      </ModalOptionsLayout>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fasuser: state.fasuser,
    options: state.options,
    releases: state.releases,
    groups:
      state.user_data === undefined || state.user_data.static_info.status !== 200
        ? []
        : R.keys(state.user_data.static_info.data.group_packages),
  }
}

export default connect(mapStateToProps)(ModalOptions)
