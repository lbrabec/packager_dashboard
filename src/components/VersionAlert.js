import React, { PureComponent } from "react"
import { connect } from "react-redux"
import * as R from "ramda"

class VersionAlert extends PureComponent {
  render() {
    const { active, latest } = this.props.version

    if (active < latest) {
      return (
        <div className={"container pt-4 " + R.defaultTo("", this.props.className)}>
          <div className="alert alert-info alert-dismissible fade show pr-3" role="alert">
            <span className="font-weight-bold d-flex justify-content-between align-items-center">
              New version of Packager Dashboard is available.
              <span>
                <button type="button" className="btn btn-success mr-2" aria-label="Update"
                        onClick={() => window.location.reload()}>
                  Update
                </button>
                <button type="button" className="btn btn-danger" data-dismiss="alert" aria-label="Close">
                  Later
                </button>
              </span>
            </span>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = (state) => {
  const { version } = state
  return {
    version,
  }
}

export default connect(mapStateToProps)(VersionAlert)
