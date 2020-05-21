import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom'

import { connect } from 'react-redux'

import '../App.css';

import EntryForm from './EntryForm';
import Dashboard from './Dashboard';


class App extends Component {
  render() {
    return (
      <BrowserRouter basename={window.env.SUBDIR}>
        <Switch>
          <Route path="/" exact>
            <EntryForm />
          </Route>
          <Route path="/:fasuser"
                 render={(props) => (
                  <Dashboard {...props}/>
          )}>
          </Route>
        </Switch>
      </BrowserRouter>
    )
  }
}


const mapStateToProps = _ => {
  return {
  }
}

export default connect(mapStateToProps)(App)
