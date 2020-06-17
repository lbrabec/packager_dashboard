import React, { Component } from "react"
import { changeOption, resetOptions } from "../actions/reduxActions"
import { connect } from "react-redux"
import * as R from "ramda"

class ModalOptionsLayout extends Component {
  render() {
    return (
      <div
        className="modal fade"
        data-backdrop="false"
        id="options"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="optionsModalLabel"
        aria-hidden="true"
        data-focus="false">
        <div className="modal-dialog modal-dialog-slideout" role="document">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center">
              <h4 className="modal-title" id="optionsModalLabel">
                Options
              </h4>
              <a className="ml-3"
                onClick={this.props.reset}>
                Reset
              </a>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                data-taget="#options"
                aria-label="Close"
                id="close-button">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">{this.props.children}</div>
          </div>
        </div>
      </div>
    )
  }
}

const valueOf = (t) => {
  switch (t.type) {
    case "checkbox":
      return t.checked

    default:
      return t.value
  }
}

class OptionsSwitch extends Component {
  render() {
    return (
      <div className="custom-control custom-switch">
        <input
          type="checkbox"
          className="custom-control-input"
          name={this.props.name}
          id={this.props.name}
          checked={this.props.value}
          onChange={this.props.handler}
        />
        <label className="custom-control-label" htmlFor={this.props.name}>
          {this.props.children}
        </label>
      </div>
    )
  }
}

class CustomRadio extends Component {
  render() {
    return (
      <div className="custom-control custom-radio">
        <input
          type="radio"
          id={this.props.name + "-" + this.props.type}
          name={this.props.name}
          value={this.props.type}
          checked={this.props.value === this.props.type}
          onChange={this.props.handler}
          className="custom-control-input"
        />
        <label className="custom-control-label" htmlFor={this.props.name + "-" + this.props.type}>
          {this.props.children}
        </label>
      </div>
    )
  }
}

class CustomCheckbox extends Component {
  render() {
    return (
      <div className="custom-control custom-checkbox">
        <input
          type="checkbox"
          className="custom-control-input"
          id={this.props.name}
          name={this.props.name}
          checked={this.props.value}
          onChange={this.props.handler}
        />
        <label className="custom-control-label" htmlFor={this.props.name}>
          {this.props.children}
        </label>
      </div>
    )
  }
}

class _BugStatusGrid extends Component {
  render() {
    const grid = this.props.grid.map((row) => (
      <div className="row" key={`status_row_${row[0]}${row[1]}`}>
        {row.map((status) => (
          <div className="col-4" key={`status_${status}`}>
            <CustomCheckbox
              name={`show_bug_status_${status}`}
              handler={this.props.handler}
              value={this.props.options[`show_bug_status_${status}`]}>
              {status}
            </CustomCheckbox>
          </div>
        ))}
      </div>
    ))

    return grid
  }
}

const BugStatusGrid = connect((state) => {
  return {
    options: state.options,
  }
})(_BugStatusGrid)

class _BugKeywordsGrid extends Component {
  render() {
    const { options, handler } = this.props

    return (
      <div>
        <div className="row">
          <div className="col-4">
            <CustomCheckbox
              name="show_bug_kw_tracking"
              handler={handler}
              value={options.show_bug_kw_tracking}>
              Tracking
            </CustomCheckbox>
          </div>
          <div className="col-8">
            <CustomCheckbox
              name="show_bug_kw_futurefeature"
              handler={handler}
              value={options.show_bug_kw_futurefeature}>
              FutureFeature
            </CustomCheckbox>
          </div>
        </div>
        <div className="row">
          <div className="col-4">
            <CustomCheckbox
              name="show_bug_kw_triaged"
              handler={handler}
              value={options.show_bug_kw_triaged}>
              Triaged
            </CustomCheckbox>
          </div>
          <div className="col-8">
            <CustomCheckbox
              name="show_bug_kw_releasemonitoring"
              handler={handler}
              value={options.show_bug_kw_releasemonitoring}>
              Release monitoring
            </CustomCheckbox>
          </div>
        </div>
      </div>
    )
  }
}

const BugKeywordsGrid = connect((state) => {
  return {
    options: state.options,
  }
})(_BugKeywordsGrid)

class GroupTriSwitch extends Component {
  render() {
    return (
      <div className="row no-gutters">
        <div className="col-1">
          <CustomRadio
            name={this.props.name}
            handler={this.props.handler}
            type="always"
            value={this.props.value}></CustomRadio>
        </div>
        <div className="col-1">
          <CustomRadio
            name={this.props.name}
            handler={this.props.handler}
            type="mine"
            value={this.props.value}></CustomRadio>
        </div>
        <div className="col-1">
          <CustomRadio
            name={this.props.name}
            handler={this.props.handler}
            type="never"
            value={this.props.value}></CustomRadio>
        </div>
        <div className="col-auto">
          <div className="">
            <label>{this.props.children}</label>
          </div>
        </div>
      </div>
    )
  }
}

class ModalOptions extends Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleGroupChange = this.handleGroupChange.bind(this)
    this.handleRelease = this.handleRelease.bind(this)
  }

  handleChange(e) {
    e.stopPropagation()
    this.props.dispatch(
      changeOption({
        type: 'general',
        name: e.target.name,
        value: valueOf(e.target),
      })
    )
  }

  handleGroupChange(e) {
    e.stopPropagation()
    this.props.dispatch(
      changeOption({
        type: 'group',
        name: e.target.name,
        value: valueOf(e.target),
      })
    )
  }

  handleRelease(e){
    e.stopPropagation()
    this.props.dispatch(
      changeOption({
        type: 'release',
        name: e.target.name,
        value: valueOf(e.target),
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
      show_groups,
      show_releases,
    } = this.props.options

    const groupSwitches = this.props.groups.map((group) => (
      <GroupTriSwitch
        name={group}
        value={show_groups[group] === undefined ? "always" : show_groups[group]}
        handler={this.handleGroupChange}
        key={group}>
        <div className="font-weight-bold">{group}</div>
      </GroupTriSwitch>
    ))

    const groupBlock = (
      <div>
        <div className="row no-gutters mb-1">
          <div className="col-1">
            <span
              className=""
              data-toggle="tooltip"
              title=""
              data-original-title="Include all packages maintained by this group regardless of my direct package relationship">
              <i className="fas fa-users mr-1"></i>
            </span>
          </div>
          <div className="col-1">
            <span
              style={{ paddingLeft: "2px" }}
              className=""
              data-toggle="tooltip"
              title=""
              data-original-title="Include packages that I directly maintain regardless of their relationship to this group">
              <i className="fas fa-user mr-1"></i>
            </span>
          </div>
          <div className="col-1">
            <span
              style={{ paddingLeft: "0px" }}
              data-toggle="tooltip"
              title=""
              data-original-title="Exclude all packages maintained by this group regardless of my direct package relationship">
              <i className="fas fa-eye-slash"></i>
            </span>
          </div>
        </div>
        {groupSwitches}
      </div>
    )

    return (
      <ModalOptionsLayout reset={() => this.props.dispatch(resetOptions(this.props.fasuser))}>
        <form>
          <div className="form-group">
            <div className="row">
              <div className="col-6">
                {
                  this.props.releases.fedora.map(release => (
                    <CustomCheckbox
                      name={release.replace(/\s/g, '')}
                      handler={this.handleRelease}
                      value={R.defaultTo(true, show_releases[release.replace(/\s/g, '')])}>
                      {release}
                    </CustomCheckbox>
                  ))
                }
              </div>
              <div className="col-4">
                {
                  this.props.releases.epel.map(release => (
                    <CustomCheckbox
                      name={release.replace(/\s/g, '')}
                      handler={this.handleRelease}
                      value={R.defaultTo(true, show_releases[release.replace(/\s/g, '')])}>
                      {release}
                    </CustomCheckbox>
                  ))
                }
              </div>
            </div>
          </div>

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
            <BugKeywordsGrid handler={this.handleChange} />
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

          {groupBlock}
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
