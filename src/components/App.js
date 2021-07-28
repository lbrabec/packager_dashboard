import React, { Component } from "react"
import { Route, Switch, Redirect } from "react-router"
import { BrowserRouter } from "react-router-dom"
import Cookies from "universal-cookie"
import { connect } from "react-redux"

import EntryForm from "./EntryForm"
import Dashboard from "./Dashboard"
import DashboardPackage from "./Dashboard/DashboardPackage"
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
          <Route path="/package/:fasuser" render={(props)=> {
            return <Dashboard {...props} isPackage={true}/>
          }}/>
          <Route path="/packages" render={(props)=> {
            return <DashboardPackage {...props}/>
          }}/>
          <Route path="/version.json" onEnter={() => window.location.reload()} />
          <Route path="/helpmepls" exact>
            <Help />
          </Route>
          <Route path='/orphan'>
            <Redirect to="/user/orphan" />
          </Route>
          <Route path='/callback' render={(props) => {
            const query = new URLSearchParams(props.location.search)
            const token = query.get("oidc_token")
            console.log("received token: " + token)
            this.props.dispatch(saveToken(token))
            cookies.set("token", token, { path: "/", sameSite: 'lax' })
            return <Redirect to="/" />
          }} />
          <Route path="/user/:fasuser" render={(props) => {
            const query = new URLSearchParams(props.location.search)
            const token = query.get("oidc_token")
            if(token !== null) {
              console.log("received token: " + token)
              this.props.dispatch(saveToken(token))
              cookies.set("token", token, { path: "/", sameSite: 'lax' })
              // redirect to drop url params (i.e. to not to have oidc_token in address bar)
              return <Redirect to={window.location.pathname} />
            }
            return <Dashboard {...props}  isPackage={false}/>

          }} />
          <Route path='/:fasuser' render={(props) => {
            // compatibility
            return <Redirect to={`/user/${props.match.params.fasuser}`} />
          }
          } />
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
