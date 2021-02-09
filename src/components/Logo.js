import React, { PureComponent } from "react"
import { connect } from "react-redux"
import * as R from "ramda"

import logo from "../logo.svg"
import logo_stg from "../logo_stg.svg"


class Logo extends PureComponent {
  render() {
    const cls = R.defaultTo("", this.props.className)

    if(this.props.environment === "prod") {
      return <img src={logo} alt="Fedora Packager Dashboard" className={cls} />
    } else {
      return <img src={logo_stg} alt="Fedora Packager Dashboard" className={cls} />
    }
  }
}

const mapStateToProps = (state) => {
  const { environment } = state
  return {
    environment,
  }
}

export default connect(mapStateToProps)(Logo)
