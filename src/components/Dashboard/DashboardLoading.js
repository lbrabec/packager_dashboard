import React, { Component } from "react"
import Footer from "../Footer"

class DashboardLoading extends Component {
    render() {
      return (
        <div className="App">
          <div className="appEntryContainer">
            <h1>
              <i className="fas fa-spinner fa-spin"></i>
            </h1>
            {this.props.server_error?
              <h4 className="pt-4 text-muted">Unable to reach server, retrying in 60 seconds</h4>
              :
              null
            }
          </div>
          <Footer />
        </div>
      )
    }
  }

export default DashboardLoading
