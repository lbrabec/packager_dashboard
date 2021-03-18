import React, { Component } from "react"
import { useMediaQuery } from "react-responsive"

import "./responsivemasonry.css"

const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 })
  return isMobile ? children : null
}
const NotMobile = ({ children }) => {
  const isNotMobile = useMediaQuery({ minWidth: 768 })
  return isNotMobile ? children : null
}

class ResponsiveMasonry extends Component {
  render() {
    return (
      <div className="container py-4">
        <div className="masonry">
          <Mobile>
            <div className="row">
              <div className="col-12">
                {this.props.items[0]}
                {this.props.items[1]}
              </div>
            </div>
          </Mobile>
          <NotMobile>
            <div className="row">
              <div className="col-6">{this.props.items[0]}</div>
              <div className="col-6">{this.props.items[1]}</div>
            </div>
          </NotMobile>
        </div>
      </div>
    )
  }
}

export default ResponsiveMasonry
