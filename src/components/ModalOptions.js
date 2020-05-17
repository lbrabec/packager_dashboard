import React, { Component } from 'react';
import { changeOption } from '../actions/reduxActions'
import { connect } from 'react-redux'


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

class OptionsCheckbox extends Component {
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
    console.log("form change")
    console.log(valueOf(e.target))

    this.props.dispatch(changeOption({
      name: e.target.name,
      value: valueOf(e.target)
    }))
  }

  render() {
    const {
      show_bugs,
      show_updates,
      show_prs,
      show_overrides,
      show_orphanned
    } = this.props.options

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

          <OptionsCheckbox name="show_updates" value={show_updates} handler={this.handleChange.bind(this)}>
            <div className="font-weight-bold">Show updates</div>
            <small>If checked, the dashboard will show all packages with updates.</small>
          </OptionsCheckbox>

          <OptionsCheckbox name="show_prs" value={show_prs} handler={this.handleChange.bind(this)}>
            <div className="font-weight-bold">Show PRs</div>
            <small>If checked, the dashboard will show all packages with pull requests.</small>
          </OptionsCheckbox>

          <OptionsCheckbox name="show_overrides" value={show_overrides} handler={this.handleChange.bind(this)}>
            <div className="font-weight-bold">Show overrides</div>
            <small>If checked, the dashboard will show all packages with override in Bodhi.</small>
          </OptionsCheckbox>

          <OptionsCheckbox name="show_orphanned" value={show_orphanned} handler={this.handleChange.bind(this)}>
            <div className="font-weight-bold">Show orphanned</div>
            <small>If checked, the dashboard will show all orphanned packages.</small>
          </OptionsCheckbox>
        </form>
      </ModalOptionsLayout>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    options: state.options
  }
}

export default connect(mapStateToProps)(ModalOptions)
