import React, { Component } from 'react';
import logo from './logo.svg';

class Masthead extends Component {
  render() {
    const si_spinner = this.props.siLoading? (<span><i class="fas fa-sync-alt fa-spin"></i> Loading Packages</span>) : null
    const bzs_spinner = this.props.bzsLoading? (<span><i class="fas fa-sync-alt fa-spin"></i> Loading Bugs</span>) : null
    const prs_spinner = this.props.prsLoading? (<span><i class="fas fa-sync-alt fa-spin"></i> Loading PRs</span>) : null

    return (
      <div className="masthead py-2">
        <div className="container px-0">
          <div className="row no-gutters">
            <div className="col-sm-6">
              <img src={logo} alt='Fedora Packager Dashboard'/>
            </div>
            <div className="col-auto">
            </div>
            <div className="col-sm-4">
              {si_spinner}&nbsp;&nbsp;&nbsp;{bzs_spinner}&nbsp;&nbsp;&nbsp;{prs_spinner}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Masthead;
