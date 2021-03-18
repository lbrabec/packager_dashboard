import React, { Component } from "react"
import * as R from "ramda"

import "./error.css"

class Error extends Component {
  render() {
    console.log(this.props.error)

    return (
      <div className="Error">
        <div className="container text-center">
          <h1 className="text-muted">
            <i className="fas fa-exclamation-circle"></i>
          </h1>
          <h3>Oops! something went wrong!</h3>
          <h3 className="mb-4">
            Please, try to reload this page and, if it didn't help, report this issue to{" "}
            <a
              href="https://pagure.io/fedora-qa/packager_dashboard/issues"
              target="_blank"
              rel="noopener noreferrer">
              our tracker
            </a>
            .
          </h3>
          <div className="well well-error p-4 text-left">
            #### URL:
            <br />
            {window.location.href}
            <br />
            <br />
            #### Error message:
            <br />
            {this.props.error.message}
            <br />
            <br />
            #### Stacktrace:
            <br />
            {R.compose(R.intersperse(<br />), R.split("\n"))(this.props.error.stack)}
          </div>
        </div>
      </div>
    )
  }
}

export default Error
