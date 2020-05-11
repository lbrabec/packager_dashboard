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

  componentDidMount() {
    //fetch('http://localhost:5000/api/v1/packager_dashboard/churchyard')
    fetch('http://192.168.0.87:5000/api/v1/packager_dashboard/churchyard')
    //fetch('http://localhost:5000/api/v1/packager_dashboard/dajt')
    .then((response) => response.json())
    .then((data) => {
        console.log('Success:', data);
        this.setState({user_data: data})
    })
    .catch((error) => {
        console.error('Error:', error);
    });
  }

  render() {
    if (this.state.user_data === undefined) {
      return ('Loading')
    }

    const { bugs, orphans, packages, pull_requests, updates, overrides } = this.state.user_data

    const packages_with_data = packages.filter((pkg_name) => {
      const bugs_cnt = bugs[pkg_name].length
      const pull_requests_cnt = pull_requests[pkg_name].length
      const updates_cnt = updates[pkg_name].length
      const overrides_cnt = overrides[pkg_name].length
      const orphan = orphans[pkg_name].orphanned? 1 : 0

      return bugs_cnt + pull_requests_cnt + updates_cnt + overrides_cnt + orphan > 0
    })
    const packages_grid = R.splitEvery(2, [...new Set(packages_with_data)]).map((pair) => (
      <div className="row py-md-4" key={pair[0]+pair[1]}>
        {pair.map((package_name) => (
          <div className="col-md-6 py-3 py-sm-3 py-md-0" key={package_name}>
            <Widget title={package_name}
                    bugs={bugs[package_name]}
                    pull_requests={pull_requests[package_name]}
                    updates={updates[package_name]}
                    overrides={overrides[package_name]}
                    orphan={orphans[package_name]}/>
          </div>
        ))}
      </div>
    ))

    return (
      <div className="App">
        <Masthead />
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
