import React, { PureComponent } from 'react';
import logo from '../logo.svg';
import { Link } from 'react-router-dom'
import Cookies from 'universal-cookie';
import { connect } from 'react-redux'
import { unsetUser } from '../actions/reduxActions'

import ModalOptions from './ModalOptions';

const cookies = new Cookies();


class Masthead extends PureComponent {
  constructor(props){
    super(props)
    this.state = {
      style: ""
    }
  }

  logout() {
    cookies.remove('fasusername')
    this.props.dispatch(unsetUser())
  }

  searchHandler(e){
    // Don't fail when malformed regexp str is provided
    // indicate it by red color in search input
    try {
      const re = RegExp(e.target.value)
      this.setState({style: ""})
      this.props.searchHandler(re)
    }
    // Gotta Catch 'Em All!
    catch (err) {
      this.setState({style: "text-danger"})
    }
  }

  render() {
    const spinner = this.props.siLoading || this.props.bzsLoading || this.props.prsLoading?
      (<i className="fas fa-sync-alt fa-spin"></i>) : null

    return (
      <div className="masthead navbar py-1 px-0 px-md-2">
        <div className="container px-1 px-md-2">
          <img src={logo} alt='Fedora Packager Dashboard'/>
          <div>
            {spinner}
          </div>
          <nav className="navbar-expand-md navbar-light">
            <button className="navbar-toggler" type="button"
                    data-toggle="collapse" data-target="#navbarContent"
                    aria-controls="navbarContent" aria-expanded="false"
                    aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
          </nav>
          <nav className="navbar-expand-md navbar-light">
            <div className="collapse navbar-collapse" id="navbarContent">
              <div className="d-flex flex-row align-items-center">
                <div className="mr-4 mt-1 mt-sm-0">
                  <input className={"form-control "+this.state.style}
                        type="search" placeholder="Search" aria-label="Search"
                        onChange={this.searchHandler.bind(this)} />
                </div>
                <a data-target="#options" data-toggle="modal"><i className="fas fa-cog pr-4"></i></a>
                <Link onClick={this.logout.bind(this)} to="/"><i className="fas fa-sign-out-alt"></i></Link>
              </div>
            </div>
          </nav>

          <ModalOptions />
        </div>
      </div>
    )
  }
}

const mapStateToProps = _ => {
  return {
  }
}

export default connect(mapStateToProps)(Masthead)
