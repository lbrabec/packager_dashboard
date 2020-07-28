import React, { Component, createRef } from "react"
import { Redirect } from "react-router"
import Cookies from "universal-cookie"
import logo from "../logo.svg"
import Footer from "./Footer"
import { setUser } from "../actions/reduxActions"
import { connect } from "react-redux"

const cookies = new Cookies()

class EntryForm extends Component {
  constructor(props) {
    super(props)
    this.input = createRef()
  }

  handleSubmit(e) {
    this.props.dispatch(setUser(this.input.current.value))
    cookies.set("fasusername", this.input.current.value, { path: "/", sameSite: 'lax' })
    e.preventDefault()
  }

  componentDidMount() {
    if (cookies.get("fasusername") !== undefined) {
      console.log("found fasuser in cookies...")
      this.props.dispatch(setUser(cookies.get("fasusername")))
    }
  }

  render() {
    if (this.props.fasuser !== "") {
      return <Redirect to={"/" + this.props.fasuser} />
    }

    return (
      <div className="App">
        <div className="appEntryContainer">
          <img src={logo} alt="Fedora Packager Dashboard" className="pb-4" />

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
          <div className="text-muted mt-3">
            <a href="/helpmepls">
              Need help?
            </a>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fasuser: state.fasuser,
  }
}

export default connect(mapStateToProps)(EntryForm)
