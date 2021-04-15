import React, { Component } from "react"
import { Route, Switch, Redirect } from "react-router"
import { BrowserRouter } from "react-router-dom"
import Cookies from "universal-cookie"
import { connect } from "react-redux"

import EntryForm from "./EntryForm"
import Dashboard from "./Dashboard"
import Error from "./Error"
import Help from "./Help"

import { throwError, saveToken } from "../actions/reduxActions"

const cookies = new Cookies()

class App extends Component {
  componentDidCatch(error, info) {
    console.log(error, info)

    this.props.dispatch(throwError({ error: error, reason: info.componentStack }))
  }

  render() {
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
          <Route path='/callback' render={(props) => {
            const query = new URLSearchParams(props.location.search)
            const token = query.get("oidc_token")
            console.log("received token: " + token)
            this.props.dispatch(saveToken(token))
            cookies.set("token", token, { path: "/", sameSite: 'lax' })
            return <Redirect to="/" />
          }} />
          <Route path="/:fasuser" render={(props) => {
            const query = new URLSearchParams(props.location.search)
            const token = query.get("oidc_token")
            if(token !== null) {
              console.log("received token: " + token)
              this.props.dispatch(saveToken(token))
              cookies.set("token", token, { path: "/", sameSite: 'lax' })
              // redirect to drop url params (i.e. to not to have oidc_token i address bar)
              return <Redirect to={window.location.pathname} />
            }
            return <Dashboard {...props} />

          }}></Route>
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
