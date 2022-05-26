import React, { Component } from "react"
import { Route, Switch, Redirect } from "react-router"
import { BrowserRouter } from "react-router-dom"
import Cookies from "universal-cookie"
import { connect } from "react-redux"

import EntryForm from "./EntryForm"
import Dashboard from "./Dashboard"
import CustomDashboard from "./Dashboard/CustomDashboard"
import Error from "./Error"
import Help from "./Help"
import * as QS from 'query-string'
import * as R from "ramda"

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
          <Route path="/dashboard" render={(props)=> {
            const query = QS.parse(window.location.search)
            console.log(query)
            const token = query.oidc_token
            if(token !== undefined) {
              console.log("received token: " + token)
              this.props.dispatch(saveToken(token))
              cookies.set("token", token, { path: "/", sameSite: 'lax' })
              // redirect to drop oidc_token to not to have it in address bar
              const redirect = window.location.pathname + '?' + QS.stringify(R.omit(['oidc_token'], query))
              console.log("redirecting to: ", redirect)
              return <Redirect to={redirect} />
            }
            return <Dashboard {...props} />
          }}/>

          <Route path="/custom" render={(props)=> {
            return <CustomDashboard {...props}/>
          }}/>

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
          <Route path='/orphan'><Redirect to="/dashboard?users=orphan" /></Route>
          <Route path='/user/:fasuser' render={(props) => (<Redirect to={`/dashboard?users=${props.match.params.fasuser}`} />)} />
          <Route path='/:fasuser' render={(props) => (<Redirect to={`/dashboard?users=${props.match.params.fasuser}`} />)} />
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
