import React, { Component } from "react"
import Footer from "./Footer"

class DashboardLoading extends Component {
    render() {
      return (
        <div className="App">
          <div className="appEntryContainer">
            <h1>
              <i className="fas fa-spinner fa-spin"></i>
              {this.props.children}
            </h1>
          </div>
          <Footer />
        </div>
      )
    }
  }

export default DashboardLoading
