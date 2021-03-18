import React, { PureComponent } from "react"
import { connect } from "react-redux"
import * as R from "ramda"

class StgAlert extends PureComponent {
  render() {
    if (this.props.environment === "stg") {
      return (
        <div className={"container pt-4 " + R.defaultTo("", this.props.className)}>
          <div className="alert alert-warning" role="alert">
            <span className="font-weight-bold">
              This is a testing version of Fedora Packager Dashboard. You might want to use the{" "}
              <a href="https://packager-dashboard.fedoraproject.org">production instance</a>.
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
  const { environment } = state
  return {
    environment,
  }
}

export default connect(mapStateToProps)(StgAlert)
