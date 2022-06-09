import React, { Component, createRef } from "react"
import { Redirect } from "react-router"
import Cookies from "universal-cookie"
import Logo from "../Logo"
import { StgAlert } from "../Alerts"
import Footer from "../Footer"
import { setDashboardQuery, loadEnvironment } from "../../actions/reduxActions"
import { connect } from "react-redux"

import "./entryform.css"

const cookies = new Cookies()

class EntryForm extends Component {
  constructor(props) {
    super(props)
    this.input = createRef()
  }

  handleSubmit(e) {
    const query = "?users=" + this.input.current.value
    this.props.dispatch(setDashboardQuery(query))
    cookies.set("dashboard_query", query, { path: "/", sameSite: 'lax' })
    e.preventDefault()
  }

  componentDidMount() {
    this.props.dispatch(loadEnvironment())

    if (cookies.get("dashboard_query") !== undefined) {
      console.log("found dashboard_query in cookies...")
      this.props.dispatch(setDashboardQuery(cookies.get("dashboard_query")))
    }
  }

  render() {
    if (this.props.dashboard_query !== "") {
      return <Redirect to={"/dashboard" + this.props.dashboard_query} />
    }

    return (
      <div className="App">
        <div className="appEntryContainer">
          <Logo className="pb-4"/>

          <form className="form-inline" onSubmit={this.handleSubmit.bind(this)}>
            <div className="form-group mb-2 pr-2">
              <input
                type="text"
                className="form-control form-control-lg"
                id="fasusernameInput"
                placeholder="FAS Username or Group"
                ref={this.input}
                defaultValue=""
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg mb-2">
              Go!
            </button>
          </form>

          <div className="w-50 my-4 d-flex flex-row">
            <span className="" style={{width: "50%", height: "2.4em"}}>
              <hr />
            </span>
            <span className="px-4 text-muted" style={{height: "2.4em", paddingTop: "5px"}}>
              <span>or</span>
            </span>
            <span className="" style={{width: "50%", height: "2.4em"}}>
              <hr />
            </span>
          </div>

          <div className="mb-4">
            <a href="/custom" role="button" className="btn btn-outline-secondary">
              Create your own dashboard
            </a>
          </div>

          <div className="text-muted mt-4">
            <a href="/helpmepls">
              Need help?
            </a>
          </div>
          <StgAlert className="w-400px"/>
        </div>
        <Footer />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fasuser: state.fasuser,
    dashboard_query: state.dashboard_query,
  }
}

export default connect(mapStateToProps)(EntryForm)
