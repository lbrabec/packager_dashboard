import React, { Component } from "react"
import { Route, Switch, Redirect } from "react-router"
import { BrowserRouter } from "react-router-dom"

import { connect } from "react-redux"

import "../App.css"

import EntryForm from "./EntryForm"
import Dashboard from "./Dashboard"
import Error from "./Error"
import Help from "./Help"

import { throwError } from "../actions/reduxActions"

class App extends Component {
  componentDidCatch(error, info) {
    console.log(error, info)

    this.props.dispatch(throwError({ error: error, reason: info.componentStack }))
  }

  render() {
    fetch("/version.json")
    .then(blob => blob.json())
    .then(data => {
      console.log(data)
    })

    return this.props.error === undefined ? (
      <BrowserRouter basename={window.env.SUBDIR}>
        <Switch>
          <Route path="/" exact>
            <EntryForm />
          </Route>
          <Route path="/version.json" onEnter={() => window.location.reload()} />
          <Route path="/helpmepls" exact>
            <Help />
          </Route>
          <Route path="/:fasuser" render={(props) => <Dashboard {...props} />}></Route>
        </Switch>
      </BrowserRouter>
    ) : (
      <Error error={this.props.error} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.error,
  }
}

export default connect(mapStateToProps)(App)
