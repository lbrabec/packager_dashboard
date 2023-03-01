import React, { Component } from "react"
import { Route, Routes, Navigate } from "react-router"
import { BrowserRouter, useParams } from "react-router-dom"
import Cookies from "universal-cookie"
import { connect } from "react-redux"

import EntryForm from "./EntryForm"
import Dashboard from "./Dashboard"
import CustomDashboard from "./Dashboard/CustomDashboard"
import Error from "./Error"
import Help from "./Help"
import queryString from 'query-string'
import * as R from "ramda"

import { throwError, saveToken } from "../actions/reduxActions"

const cookies = new Cookies()

const CompatRedirect = (props) => {
  let { fasuser } = useParams();
  return <Navigate to={`/dashboard?users=${fasuser}`} />
}

class App extends Component {
  componentDidCatch(error, info) {
    console.log(error, info)

    this.props.dispatch(throwError({ error: error, reason: info.componentStack }))
  }

  getDashboard() {
    const query = queryString.parse(window.location.search)
    console.log(query)
    if (R.isEmpty(query)) {
      console.log("query is empty, redirecting to /")
      return <Navigate to="/" />
    }
    const token = query.oidc_token
    if(token !== undefined) {
      console.log("received token: " + token)
      this.props.dispatch(saveToken(token))
      cookies.set("token", token, { path: "/", sameSite: 'lax' })
      // navigate to drop oidc_token to not to have it in address bar
      const redirect = window.location.pathname + '?' + queryString.stringify(R.omit(['oidc_token'], query))
      console.log("redirecting to: ", redirect)
      return <Navigate to={redirect} />
    }
    return <Dashboard />
  }

  getCallback() {
    const query = new URLSearchParams(window.location.search)
    const token = query.get("oidc_token")
    console.log("received token: " + token)
    this.props.dispatch(saveToken(token))
    cookies.set("token", token, { path: "/", sameSite: 'lax' })
    return <Navigate to="/" />
  }

  render() {
    const query = queryString.parse(window.location.search)
    const token = query.oidc_token
    if(token !== undefined) {
      console.log("received token: " + token)
      this.props.dispatch(saveToken(token))
      cookies.set("token", token, { path: "/", sameSite: 'lax' })
      window.location.search = queryString.stringify(R.omit(['oidc_token'], query))
    }

    return this.props.error === undefined ? (
      <BrowserRouter basename={window.env.SUBDIR}>
        <Routes>
          <Route path="/" exact element={<EntryForm />} />
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route path="/custom" element={<CustomDashboard />}/>
          <Route path="/version.json" onEnter={() => window.location.reload()} />
          <Route path="/helpmepls" exact element={<Help />} />
          <Route path='/callback' element={<this.getCallback />} />
          <Route path='/orphan' element={<Navigate to="/dashboard?users=orphan" />} />
          <Route path='/user/:fasuser' element={<CompatRedirect />} />
          <Route path='/:fasuser' element={<CompatRedirect />} />
        </Routes>
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
