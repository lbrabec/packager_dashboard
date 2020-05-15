import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Masthead from './Masthead';
import Footer from './Footer';
import Widget from './Widget';
import * as R from 'ramda';



class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user_data: undefined
    }
  }

  getData() {
    //fetch('http://localhost:5000/api/v1/packager_dashboard/churchyard')
    //fetch('http://192.168.0.87:5000/api/v1/packager_dashboard/churchyard')
    //fetch('http://localhost:5000/api/v1/packager_dashboard/dajt')
    fetch('http://localhost:5000/api/v1/packager_dashboard/frantisekz')
    .then((response) => response.json())
    .then((data) => {
        console.log('Success:', data);
        this.setState({user_data: data})
        if(data.bzs.status === 200 && data.prs.status === 200 && data.static_info.status === 200){
          clearInterval(this.interval);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
  }

  componentDidMount() {
    this.getData()
    this.interval = setInterval(() => this.getData(), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    if (this.state.user_data === undefined) {
      return ('Loading')
    }

    //const { bugs, orphans, packages, pull_requests, updates, overrides } = this.state.user_data
    const { bzs, prs, static_info } = this.state.user_data

    const packages = static_info.status !== 200? [] : static_info.data.packages


    const packages_with_data = packages.filter((pkg_name) => {
      /*
      const bugs_cnt = bugs[pkg_name].length
      const pull_requests_cnt = pull_requests[pkg_name].length
      const updates_cnt = updates[pkg_name].length
      const overrides_cnt = overrides[pkg_name].length
      const orphan = orphans[pkg_name].orphanned? 1 : 0
      */
      const bugs_cnt = bzs.status !== 200? 0 : bzs.data[pkg_name].length
      const pull_requests_cnt = prs.status !== 200? 0: prs.data[pkg_name].length
      const updates_cnt = static_info.data.updates[pkg_name].length
      const overrides_cnt = static_info.data.overrides[pkg_name].length
      const orphans = static_info.data.orphans[pkg_name].orphanned? 1 : 0

      return bugs_cnt + pull_requests_cnt + updates_cnt + overrides_cnt + orphans > 0
    })

    const packages_grid = R.splitEvery(2, [...new Set(packages_with_data)]).map((pair) => (
      <div className="row py-md-4" key={pair[0]+pair[1]}>
        {pair.map((pkg_name) => (
          <div className="col-md-6 py-3 py-sm-3 py-md-0" key={pkg_name}>
            <Widget title={pkg_name}
                    bugs={bzs.status !== 200? [] : bzs.data[pkg_name]}
                    pull_requests={prs.status !== 200? [] : prs.data[pkg_name]}
                    updates={static_info.data.updates[pkg_name]}
                    overrides={static_info.data.overrides[pkg_name]}
                    orphan={static_info.data.orphans[pkg_name]}/>
          </div>
        ))}
      </div>
    ))

    return (
      <div className="App">
        <Masthead bzsLoading={bzs.status !== 200} prsLoading={prs.status !== 200} siLoading={static_info.status !== 200} />
        <div className="bodycontent pb-3">
          <div className="subheader">
            <div className="container">
              {packages_grid}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
