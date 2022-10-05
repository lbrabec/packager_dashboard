import React, { Component } from "react"
import DashboardLayout from "./DashboardLayout"
import { StgAlert, ServiceAlerts, VersionAlert } from "../Alerts"
import { connect } from "react-redux"
import {
  loadPackages,
  loadPackagers,
  loadGroups,
  loadEnvironment,
  loadReleases,
  loadSchedule,
  loadCachingInfo,
  getVersion,
  loadServiceAlerts,
  loadLinkedUser,
} from "../../actions/reduxActions"
import * as QS from 'query-string'
import Autosuggest from "react-autosuggest"
import "./dashboard.css"


const getSuggestions = (items, value, limit) => {
  const input = value.trim().toLowerCase()

  if(input.length < limit) {
    return [input]
  }

  return items.filter((i) => i.toLocaleLowerCase().startsWith(input))
}

const getSuggestionValue = (suggestion) => suggestion

const renderSuggestion = (suggestion, { query, isHighlighted }) => {
  if (isHighlighted) {
    return (<div>{suggestion}</div>)
  } else {
    return (<div>{suggestion}</div>)
  }
}

class CustomDashboard extends Component {
  constructor(props) {
    super(props)

    const query = QS.parse(window.location.search)
    this.searchTimeout = undefined
    this.state = {
      value_packages: "",
      value_packagers: "",
      value_groups: "",

      suggestions_packages: [],
      suggestions_packagers: [],
      suggestions_groups: [],

      selected_packages: query['packages']? query['packages'].split(",") : [],
      selected_packagers: query['users']? query['users'].split(",") : [],
      selected_groups: query['groups']? query['groups'].split(",") : [],
      required_acl: query['required_acl']? query['required_acl'] : "commit",
    }

    console.log(this.state)
  }

  getQuery = () => {
    const query = {
      users: this.state.selected_packagers,
      groups: this.state.selected_groups,
      packages: this.state.selected_packages,
    }
    if (this.state.required_acl !== "commit") {
      query.required_acl = this.state.required_acl
    }

    return QS.stringify(query, {arrayFormat: 'comma'})
  }

  onChange = (what) => (event, { newValue }) => {
    this.setState({
      ['value_' + what]: newValue,
    })
  }

  onSuggestionsFetchRequested = (what) => ({ value }) => {
    clearTimeout(this.searchTimeout)
    const limit = what === "packages"? 3 : 0
    const timeout = what === "packages"? 1000 : 100
    this.searchTimeout = setTimeout(() => this.setState({
      ['suggestions_' + what]: getSuggestions(this.props[what], value, limit),
    }), timeout)
  }

  onSuggestionsClearRequested = (what) => () => {
    this.setState({
      ['suggestions_' + what]: [],
      ['value_' + what]: "",
    })
    console.log(this.state['value_' + what])
    console.log("clearing")
  }

  onSuggestionSelected = (what) => (event, { suggestion }) => {
    if (!this.state['selected_' + what].includes(suggestion)) {
      this.setState({
        ['selected_' + what]: [...this.state["selected_" + what], suggestion]
      }, () => {
        const url = "/custom?" + this.getQuery()
        window.history.pushState({}, "", url)
      })
    }
    this.onSuggestionsClearRequested(what)()
  }

  handleACL = (e) => {
    console.log(e.target.value)
    this.setState({
      required_acl: e.target.value
    }, () => {
      const url = "/custom?" + this.getQuery()
      window.history.pushState({}, "", url)
    })
  }

  removeItem = (what, val) => () => {
    this.setState({
      ['selected_' + what]: this.state["selected_" + what].filter(item => item !== val),
    }, ()=> {
      const url = "/custom?" + this.getQuery()
      window.history.pushState({}, "", url)
    })
  }

  nonEmptySelection = () => {
    return this.state.selected_packages.length !== 0 ||
           this.state.selected_packagers.length !== 0 ||
           this.state.selected_groups.length !== 0
  }

  generateURL = () => {
    return window.location.origin + "/dashboard?" + this.getQuery()
  }

  orphanSanityCheck = () => {
    return !this.state.selected_packagers.includes("orphan") ||
           (this.state.selected_packagers.length === 1 &&
            this.state.selected_groups.length === 0 &&
            this.state.selected_packages.length === 0)
  }

  buttonsEnabled = () => this.nonEmptySelection() && this.orphanSanityCheck()

  componentDidMount() {
    this.props.dispatch(loadPackages())
    this.props.dispatch(loadPackagers())
    this.props.dispatch(loadGroups())
    this.props.dispatch(loadEnvironment())
    this.props.dispatch(loadReleases())
    this.props.dispatch(loadSchedule())
    this.props.dispatch(loadCachingInfo())
    this.props.dispatch(getVersion())
    this.props.dispatch(loadServiceAlerts())
    this.props.dispatch(loadLinkedUser())
  }

  render() {
    const { value_packages, value_packagers, value_groups,
            suggestions_packages, suggestions_packagers, suggestions_groups } = this.state

    const inputPropsPackages = {
      placeholder: "Search for a package",
      value: value_packages,
      onChange: this.onChange("packages"),
    }

    const inputPropsPackagers = {
      placeholder: "Search for a packager",
      value: value_packagers,
      onChange: this.onChange("packagers"),
    }

    const inputPropsGroups = {
      placeholder: "Search for a group",
      value: value_groups,
      onChange: this.onChange("groups"),
    }

    const theme = {
      container: 'autosuggest',
      input: 'form-control',
      suggestionsContainer: '',
      suggestionsContainerOpen: 'suggestions',
      suggestionList: 'w-100 show',
      suggestion: 'dropdown-item',
      suggestionHighlighted: 'active'
    }

    return (
      <DashboardLayout>
        <StgAlert />
        <VersionAlert />
        <ServiceAlerts />
        <div className="container pt-4 pb-3 text-muted">
          <h2>Customize the dashboard</h2>
        </div>
        <div className="container py-4">
        <div className="row">
            <div className="col-12 pb-4">
              <div className="input-group input-group-lg mb-3">
                <input type="text" className="form-control" placeholder="Pick packagers, groups or packages below to generate URL"
                       readOnly="readonly" value={this.nonEmptySelection()? this.generateURL() : ""} />
                <div className="input-group-append">
                  <button className={"btn btn-primary " + (this.buttonsEnabled()? "" : "disabled") } onClick={() => {navigator.clipboard.writeText(this.generateURL())}}>
                    <i className="fas fa-copy"></i>
                  </button>
                  <a href={this.generateURL()} target="_blank" rel="noreferrer" className={"btn btn-primary " + (this.buttonsEnabled()? "" : "disabled") } role="button">
                    <i className="fas fa-external-link-alt"></i>
                  </a>
                  <a href={this.generateURL()}className={"btn btn-primary " + (this.buttonsEnabled()? "" : "disabled") } role="button">
                    <i className="fas fa-check"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-2 pb-4">
              <div className="form-group">
                <label htmlFor="ACLSelect" className="font-weight-bold text-muted">
                  Required ACL
                </label>
                <select className="form-control" id="ACLSelect" onChange={this.handleACL} value={this.state.required_acl}>
                  <option value="commit">commit</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-4 font-weight-bold text-muted">Packagers</div>
            <div className="col-4 font-weight-bold text-muted">Groups</div>
            <div className="col-4 font-weight-bold text-muted">Packages</div>
          </div>
          <div className="row pt-3">
            <div className="col-4">
              <Autosuggest
                suggestions={suggestions_packagers}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested("packagers")}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested("packagers")}
                onSuggestionSelected={this.onSuggestionSelected("packagers")}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputPropsPackagers}
                theme={theme}
              />
            </div>
            <div className="col-4">
              <Autosuggest
                suggestions={suggestions_groups}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested("groups")}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested("groups")}
                onSuggestionSelected={this.onSuggestionSelected("groups")}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputPropsGroups}
                theme={theme}
              />
            </div>
            <div className="col-4">
              <Autosuggest
                suggestions={suggestions_packages}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested("packages")}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested("packages")}
                onSuggestionSelected={this.onSuggestionSelected("packages")}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputPropsPackages}
                theme={theme}
              />
            </div>
          </div>
          <div className="row pillbox">
            <div className="col-4">
              <h3>
                {
                  this.state.selected_packagers.map(packager =>
                    <span className="badge badge-pill badge-primary mr-2 mb-2" key={packager}>
                      {packager} <span onClick={this.removeItem('packagers', packager)} className="remove-item">&times;</span>
                    </span>
                )}
              </h3>
            </div>
            <div className="col-4">
              <h3>
                {
                  this.state.selected_groups.map(group =>
                    <span className="badge badge-pill badge-primary mr-2 mb-2" key={group}>
                      {group} <span onClick={this.removeItem('groups', group)} className="remove-item">&times;</span>
                    </span>
                )}
              </h3>
            </div>
            <div className="col-4">
              <h3>
                {
                  this.state.selected_packages.map(pkg =>
                    <span className="badge badge-pill badge-primary mr-2 mb-2" key={pkg}>
                      {pkg} <span onClick={this.removeItem('packages', pkg)} className="remove-item">&times;</span>
                    </span>
                )}
              </h3>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              {
                !this.orphanSanityCheck() &&
                  <div className="alert alert-danger">
                    The orphan user can't be combined with anything else!
                  </div>
              }
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }
}

export default connect((state) => {
  return {
    packages: state.all_fedora_packages,
    packagers: state.all_fedora_packagers,
    groups: state.all_fedora_groups,
  }
})(CustomDashboard)
