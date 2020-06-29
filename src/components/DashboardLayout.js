import React, { PureComponent } from "react"
import Masthead from "./Masthead"
import Footer from "./Footer"
import { connect } from "react-redux"

class DashboardLayout extends PureComponent {
    render() {
      return (
        <div className="App">
          <Masthead searchHandler={this.props.searchHandler} />
          <div className="bodycontent">
            <div className="subheader">
              {this.props.children}
            </div>
          </div>
          <Footer />
        </div>
      )
    }
  }

const mapStateToProps = (_) => {
return {}
}

export default connect(mapStateToProps)(DashboardLayout)
