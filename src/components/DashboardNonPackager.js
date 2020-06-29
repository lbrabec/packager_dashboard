import React, { PureComponent } from "react"
import DashboardLayout from "./DashboardLayout"
import { connect } from "react-redux"

class DashboardNonPackager extends PureComponent {
  render() {
    return (
      <DashboardLayout searchHandler={(_) => {}}>
        <div className="container text-center text-muted font-weight-bold py-4">
          <div className="non-packager">
              <h1 className="display-1">
                <i className="fas fa-question"></i>
              </h1>
              <h1 className="display-1">
                <i className="fas fa-box-open"></i>
              </h1>
              <h1 className="mt-4">User {this.props.fasuser} is not a packager</h1>
          </div>
        </div>
      </DashboardLayout>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fasuser: state.fasuser,
  }
}

export default connect(mapStateToProps)(DashboardNonPackager)
