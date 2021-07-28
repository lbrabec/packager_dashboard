import React, { Component } from "react"
import Cookies from "universal-cookie"
import DashboardLayout from "./DashboardLayout"
import DashboardLoading from "./DashboardLoading"
import Widget from "../Widget"
import { StgAlert, ServiceAlerts, VersionAlert, NewcomerAlert } from "../Alerts"
import Stats from "../Stats"
import Timeline from "../Timeline"
import PackageCalendars from "../PackageCalendars"
import ItemsInfo from "./ItemsInfo"
import ResponsiveMasonry from "../ResponsiveMasonry"
import ModalNetwork from "../ModalNetwork"
import * as R from "ramda"
import { connect } from "react-redux"
import {
  loadPackages,
  loadEnvironment,
  loadReleases,
  loadSchedule,
  loadCachingInfo,
  getVersion,
  loadServiceAlerts,
  loadLinkedUser,
} from "../../actions/reduxActions"
import * as U from "../../utils"

import Autosuggest from "react-autosuggest"
import "./dashboard.css"
import { min } from "moment"



const getSuggestions = (packages, value) => {
  const input = value.trim().toLowerCase()

  if(input.length < 3) {
    return [input]
  }

  return packages.filter((p) => p.toLocaleLowerCase().startsWith(input))
}

const getSuggestionValue = (suggestion) => suggestion

const renderSuggestion = (suggestion, { query, isHighlighted }) => {
  if (isHighlighted) {
    return (<div>{suggestion}</div>)
  } else {
    return (<div>{suggestion}</div>)
  }
}

class DashboardPackage extends Component {
  constructor(props) {
    super(props)

    this.searchTimeout = undefined
    this.state = {
      value: "",
      suggestions: [],
      selectedPackage: undefined,
    }
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    })
  }

  onSuggestionsFetchRequested = ({ value }) => {
    clearTimeout(this.searchTimeout)
    this.searchTimeout = setTimeout(() => this.setState({
      suggestions: getSuggestions(this.props.packages, value),
    }), 1000)
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    })
  }

  onSuggestionSelected = (event, { suggestion }) => {
    window.open(`${window.location.origin}/package/${suggestion}`)
    this.setState({
      selectedPackage: suggestion
    })
  }

  componentDidMount() {
    this.props.dispatch(loadPackages())
    this.props.dispatch(loadEnvironment())
    this.props.dispatch(loadReleases())
    this.props.dispatch(loadSchedule())
    this.props.dispatch(loadCachingInfo())
    this.props.dispatch(getVersion())
    this.props.dispatch(loadServiceAlerts())
    this.props.dispatch(loadLinkedUser())
  }

  render() {
    const { value, suggestions } = this.state

    const inputProps = {
      placeholder: "Search for a package",
      value,
      onChange: this.onChange,
    }

    const theme = {
      container: 'autosuggest',
      input: 'form-control',
      suggestionsContainer: '',
      suggestionsContainerOpen: 'suggestions',
      suggestionsList: `w-100 ${suggestions.length ? 'show' : ''}`,
      suggestion: 'dropdown-item',
      suggestionHighlighted: 'active'
    }

    return (
      <DashboardLayout>
        <StgAlert />
        <VersionAlert />
        <ServiceAlerts />
        <div className="container py-4">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionSelected={this.onSuggestionSelected}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            theme={theme}
          />
        </div>
      </DashboardLayout>
    )
  }
}

export default connect((state) => {
  return {
    packages: state.all_fedora_packages,
  }
})(DashboardPackage)
