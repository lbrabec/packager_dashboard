import React, { Component } from "react"

class DashboardLoading extends Component {
    render() {
      return (
        <div className="appEntryContainer">
          <h1>
            <i className="fas fa-spinner fa-spin"></i>
            {this.props.children}
          </h1>
        </div>
      )
    }
  }

export default DashboardLoading
