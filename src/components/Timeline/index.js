import React, { Component } from "react"
import { connect } from "react-redux"

import "./timeline.css"

const shorterSummary = (summary) => {
  summary = summary.toLowerCase()
  if (summary.includes("branch")) return "Branch from Rawhide"
  if (summary.includes("beta") && summary.includes("freeze")) return "Beta freeze"
  if (summary.includes("beta") && summary.includes("release")) return "Beta release"
  if (summary.includes("final") && summary.includes("freeze")) return "Final freeze"
  if (summary.includes("final") && summary.includes("release")) return "Final release"
  return "Rawhide"
}

class Timeline extends Component {
  render() {
    if (!this.props.show_schedule)
      return null

    const line = this.props.schedule.map((milestone) => {
      return (
        <td key={"line" + milestone.summary}>
          <Line color={milestone.current ? "#2371ae" : "#dcdcdc"} />
        </td>
      )
    })

    const dates = this.props.schedule.map((milestone) => {
      return (
        <td key={"dates" + milestone.summary} width="183">
          {milestone.summary === "Rawhide" ? "" : milestone.date}
        </td>
      )
    })

    const schedule = this.props.schedule.map((milestone) => {
      return (
        <td key={"schedule" + milestone.summary} width="183">
          {shorterSummary(milestone.summary)}
        </td>
      )
    })
    return (
      <div className="container">
        <div className="row mt-4 text-muted font-weight-bold no-gutters">
          Fedora {this.props.currentFedora} release schedule:
          <div className="table-responsive mt-2">
            <table className="timeline">
              <tbody>
                <tr>{dates}</tr>
                <tr>{line}</tr>
                <tr>{schedule}</tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

class Line extends Component {
  render() {
    const lineStyle = {
      stroke: this.props.color,
      strokeWidth: "3",
    }
    return (
      <svg width="183" height="20" version="1.1">
        <line x1="0" y1="50%" x2="100%" y2="50%" style={lineStyle} />
        <circle cx="50%" cy="50%" r="4" style={lineStyle} fill="#f3f3f3" />
      </svg>
    )
  }
}

const mapStateToProps = (state) => {
  const { schedule, releases } = state
  const { show_schedule } = state.options

  return {
    schedule,
    show_schedule,
    currentFedora: releases.currentFedora,
  }
}

export default connect(mapStateToProps)(Timeline)
