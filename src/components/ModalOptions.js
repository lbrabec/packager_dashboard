import React, { Component } from 'react';
import { changeOption } from '../actions/reduxActions'
import { connect } from 'react-redux'
import * as R from 'ramda';


class ModalOptionsLayout extends Component {
  render() {
    return (
      <div className="modal fade" id="options" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="exampleModalLabel">Dashboard Options</h4>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {this.props.children}
            </div>
            <div className="modal-footer">

            </div>
          </div>
        </div>
      </div>
    )
  }
}


const valueOf = (t) => {
  switch(t.type) {
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
          <input type="checkbox"
                 className="custom-control-input"
                 name={this.props.name}
                 id={this.props.name}
                 checked={this.props.value}
                 onChange={this.props.handler}/>
          <label className="custom-control-label" htmlFor={this.props.name}>
              {this.props.children}
          </label>
      </div>
    )
  }
}


class ModalOptions extends Component {
  handleChange(e) {
    this.props.dispatch(changeOption({
      group: false,
      name: e.target.name,
      value: valueOf(e.target)
    }))
  }

  handleGroupChange(e) {
    this.props.dispatch(changeOption({
      group: true,
      name: e.target.name,
      value: valueOf(e.target)
    }))
  }

  render() {
    const {
      show_bugs,
      bug_min_severity,
      bug_include_unspecified,

      show_updates,
      show_prs,
      show_overrides,
      show_orphaned,
      show_koschei,
      show_groups
    } = this.props.options

    const groupSwitches = this.props.groups.map((group) => (
      <OptionsSwitch name={group} value={show_groups[group] === undefined || show_groups[group]}
                       handler={this.handleGroupChange.bind(this)}
                       key={group}>
        <div className="font-weight-bold">{group}</div>
      </OptionsSwitch>
    ))

    return (
      <ModalOptionsLayout>
        <form>
          <div className="custom-control custom-switch">
              <input type="checkbox" className="custom-control-input" name="show_bugs" id="show_bugs" checked={show_bugs} onChange={this.handleChange.bind(this)}/>
              <label className="custom-control-label" htmlFor="show_bugs">
                  <div className="font-weight-bold">Show bugs</div>
                  <small>If checked, the dashboard will show all packages with open bugs.</small>
              </label>
          </div>
          <div className="form-group pl-as-switch mt-2">
            <label htmlFor="bug_min_severity">Min shown bug priority/severity</label>
            <select className="form-control" id="bug_min_severity" name="bug_min_severity"
                    defaultValue={bug_min_severity}
                    onChange={this.handleChange.bind(this)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <div className="custom-control custom-checkbox mt-1">
              <input type="checkbox" className="custom-control-input" id="bug_include_unspecified" name="bug_include_unspecified"
                     checked={bug_include_unspecified} onChange={this.handleChange.bind(this)}/>
              <label className="custom-control-label" htmlFor="bug_include_unspecified">
                Include unspecified
              </label>
            </div>
          </div>

          <OptionsSwitch name="show_updates" value={show_updates} handler={this.handleChange.bind(this)}>
            <div className="font-weight-bold">Show updates</div>
            <small>If checked, the dashboard will show all packages with updates.</small>
          </OptionsSwitch>

          <OptionsSwitch name="show_prs" value={show_prs} handler={this.handleChange.bind(this)}>
            <div className="font-weight-bold">Show PRs</div>
            <small>If checked, the dashboard will show all packages with pull requests.</small>
          </OptionsSwitch>

          <OptionsSwitch name="show_overrides" value={show_overrides} handler={this.handleChange.bind(this)}>
            <div className="font-weight-bold">Show overrides</div>
            <small>If checked, the dashboard will show all packages with override in Bodhi.</small>
          </OptionsSwitch>

          <OptionsSwitch name="show_orphaned" value={show_orphaned} handler={this.handleChange.bind(this)}>
            <div className="font-weight-bold">Show orphanned</div>
            <small>If checked, the dashboard will show all orphaned packages.</small>
          </OptionsSwitch>

          <OptionsSwitch name="show_koschei" value={show_koschei} handler={this.handleChange.bind(this)}>
            <div className="font-weight-bold">Show Koschei fails</div>
            <small>If checked, the dashboard will show all packages that failed to build in Koschei.</small>
          </OptionsSwitch>

          <hr />
          <h5>Groups</h5>

          {groupSwitches}
        </form>
      </ModalOptionsLayout>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    options: state.options,
    groups: state.user_data === undefined || state.user_data.static_info.status !== 200?
      []
      :
      R.keys(state.user_data.static_info.data.group_packages)
  }
}

export default connect(mapStateToProps)(ModalOptions)
