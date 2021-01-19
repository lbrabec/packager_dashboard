import React, { PureComponent } from "react"
import logo from "../logo.svg"
import { Link } from "react-router-dom"
import Cookies from "universal-cookie"
import { connect } from "react-redux"
import { unsetUser } from "../actions/reduxActions"
import { Parser } from "../utils/searchparser"

import ModalOptions from "./ModalOptions"

import $ from "jquery"

const cookies = new Cookies()

class Masthead extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      style: "",
    }
  }

  hideToolips() {
    $('[data-toggle="tooltip"]').tooltip('hide')
  }

  logout() {
    this.hideToolips()
    cookies.remove("fasusername", { path: "/", sameSite: 'lax' })
    this.props.dispatch(unsetUser())
  }

  searchHandler(e) {
    // Don't fail when malformed regexp str is provided
    // indicate it by red color in search input
    try {
      //const re = RegExp(e.target.value)
      this.setState({ style: "" })
      //this.props.searchHandler(re)
      const AST = Parser.parse(e.target.value)
      this.props.searchHandler(AST)
    } catch (err) {
      // Gotta Catch 'Em All!
      this.setState({ style: "text-danger" })
    }
  }

  render() {
    return (
      <div className="masthead navbar py-1 px-0 px-md-2">
        <div className="container px-1 px-md-2">
          <img src={logo} alt="Fedora Packager Dashboard" />
          <nav className="navbar-expand-md navbar-light">
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarContent"
              aria-controls="navbarContent"
              aria-expanded="false"
              aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
          </nav>
          <nav className="navbar-expand-md navbar-light">
            <div className="collapse navbar-collapse" id="navbarContent">
              <div className="d-flex flex-row flex-wrap align-items-center">
                <div className="mr-4 mt-2 mt-md-0">
                  <input
                    className={"search form-control " + this.state.style}
                    type="search"
                    placeholder="Search (r/regex/ && boolean, see help)"
                    aria-label="Search"
                    onChange={this.searchHandler.bind(this)}
                  />
                </div>
                <div className="ml-1 ml-md-0 mt-1 ml-md-0">
                  <span data-toggle="tooltip" title="" data-original-title="Help" className="mr-4">
                    <Link onClick={this.hideToolips.bind(this)} to="/helpmepls">
                      <i className="fas fa-question-circle"></i>
                    </Link>
                  </span>

                  <span data-toggle="tooltip" title="" data-original-title="Options" className="mr-4">
                    <a data-target="#options" data-toggle="modal">
                      <i className="fas fa-cog"></i>
                    </a>
                  </span>
                  <span data-toggle="tooltip" title="" data-original-title="Change user/group">
                    <Link onClick={this.logout.bind(this)} to="/">
                      <i className="fas fa-sign-out-alt"></i>
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </nav>

          <ModalOptions />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (_) => {
  return {}
}

export default connect(mapStateToProps)(Masthead)
