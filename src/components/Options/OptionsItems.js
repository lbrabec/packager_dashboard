import React, { Component } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import { CustomCheckbox, GroupTriSwitch, GroupSwitch } from "./OptionsLayout"

class _ReleasesBlock extends Component {
  render() {
    return (
      <div className="form-group">
        <div className="row">
          <div className="col-6">
            {this.props.releases.fedora.map((release) => (
              <CustomCheckbox
                key={`show_${release.replace(/\s/g, "")}`}
                name={release.replace(/\s/g, "")}
                handler={this.props.handler}
                value={R.defaultTo(true, this.props.show_releases[release.replace(/\s/g, "")])}>
                {release}
              </CustomCheckbox>
            ))}
          </div>
          <div className="col-4">
            {this.props.releases.epel.map((release) => (
              <CustomCheckbox
                key={`show_${release.replace(/\s/g, "")}`}
                name={release.replace(/\s/g, "")}
                handler={this.props.handler}
                value={R.defaultTo(true, this.props.show_releases[release.replace(/\s/g, "")])}>
                {release}
              </CustomCheckbox>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export const ReleasesBlock = connect((state) => {
  return {
    show_releases: state.options.show_releases,
  }
})(_ReleasesBlock)

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

export const BugStatusGrid = connect((state) => {
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
              name="Tracking"
              handler={handler}
              value={R.defaultTo(true, options.show_bug_kw["Tracking"])}>
              Tracking
            </CustomCheckbox>
          </div>
          <div className="col-8">
            <CustomCheckbox
              name="FutureFeature"
              handler={handler}
              value={R.defaultTo(true, options.show_bug_kw["FutureFeature"])}>
              FutureFeature
            </CustomCheckbox>
          </div>
        </div>
        <div className="row">
          <div className="col-4">
            <CustomCheckbox
              name="Triaged"
              handler={handler}
              value={R.defaultTo(true, options.show_bug_kw["Triaged"])}>
              Triaged
            </CustomCheckbox>
          </div>
          <div className="col-8">
            <CustomCheckbox
              name="ReleaseMonitoring"
              handler={handler}
              value={R.defaultTo(true, options.show_bug_kw["ReleaseMonitoring"])}>
              Release monitoring
            </CustomCheckbox>
          </div>
        </div>
        <div className="row">
          <div className="col-4">
            <CustomCheckbox
              name="ABRT"
              handler={handler}
              value={R.defaultTo(true, options.show_bug_kw["ABRT"])}>
              ABRT
            </CustomCheckbox>
          </div>
          <div className="col-8">
          </div>
        </div>
      </div>
    )
  }
}

export const BugKeywordsGrid = connect((state) => {
  return {
    options: state.options,
  }
})(_BugKeywordsGrid)

class _GroupBlock extends Component {
  render() {
    if (this.props.groups.length === 0){
      return (null)
    }

    if (this.props.groupsOnly) {
      const groupSwitches = this.props.groups.map((group) => (
        <GroupSwitch
          name={group}
          value={R.defaultTo("always", this.props.show_groups[group])}
          handler={this.props.handler}
          key={group}>
          <div className="font-weight-bold">{group}</div>
        </GroupSwitch>
      ))

      return (
        <>
          <div className="row no-gutters mb-1">
            <div className="col-1">
              <span
                style={{ paddingLeft: "2px" }}
                className=""
                data-toggle="tooltip"
                title=""
                data-original-title="Show packages from this group">
                <i className="fas fa-eye mr-1"></i>
              </span>
            </div>
            <div className="col-1">
              <span
                style={{ paddingLeft: "0px" }}
                data-toggle="tooltip"
                title=""
                data-original-title="Hide packages from this group">
                <i className="fas fa-eye-slash"></i>
              </span>
            </div>
          </div>
          {groupSwitches}
        </>
      )
    } else {
      const groupSwitches = this.props.groups.map((group) => (
        <GroupTriSwitch
          name={group}
          value={R.defaultTo("always", this.props.show_groups[group])}
          handler={this.props.handler}
          key={group}>
          <div className="font-weight-bold">{group}</div>
        </GroupTriSwitch>
      ))

      return (
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
    }
  }
}

export const GroupBlock = connect((state) => {
  return {
    show_groups: state.options.show_groups,
  }
})(_GroupBlock)
