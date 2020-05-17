import React, { Component } from 'react';
import logo from '../logo.svg';
import { Link } from 'react-router-dom'
import Cookies from 'universal-cookie';
import { connect } from 'react-redux'
import { unsetUser } from '../actions/reduxActions'

import ModalOptions from './ModalOptions';

const cookies = new Cookies();


class Masthead extends Component {
  logout() {
    cookies.remove('fasusername')
    this.props.dispatch(unsetUser())
  }

  render() {
    const si_spinner = this.props.siLoading? (<span><i className="fas fa-sync-alt fa-spin"></i> Loading Packages</span>) : null
    const bzs_spinner = this.props.bzsLoading? (<span><i className="fas fa-sync-alt fa-spin"></i> Loading Bugs</span>) : null
    const prs_spinner = this.props.prsLoading? (<span><i className="fas fa-sync-alt fa-spin"></i> Loading PRs</span>) : null

    return (
      <div className="masthead navbar py-2">
        <div className="container">
          <img src={logo} alt='Fedora Packager Dashboard'/>
          <div>
            {si_spinner}&nbsp;&nbsp;&nbsp;{bzs_spinner}&nbsp;&nbsp;&nbsp;{prs_spinner}
          </div>
          <div>
            <a href="#options" data-toggle="modal"><i className="fas fa-cog pr-4"></i></a>
            <Link onClick={this.logout.bind(this)} to="/"><i className="fas fa-sign-out-alt"></i></Link>
          </div>
        </div>
        <ModalOptions />
      </div>
    )
  }
}

const mapStateToProps = _ => {
  return {
  }
}

export default connect(mapStateToProps)(Masthead)
