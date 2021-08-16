import React, { Component } from "react"
import { connect } from "react-redux"
import * as R from "ramda"
import * as moment from "moment"
import $ from "jquery"

import "./package-calendars.css"

const transformCalendars = R.compose(
  R.sortBy((date) => moment.utc(date[0])),
  R.toPairs,
  R.mapObjIndexed((val, key, obj) =>
    R.compose(
      R.mapObjIndexed((v, k, o) => ({
        //tidy up - just get the list of packages and url of event
        //url is only one, group by it and drop the values - keeping the url itself only
        url: R.compose(
          R.keys,
          R.groupBy((i) => i.url)
        )(v)[0],
        packages: v.map((i) => i.package),
      })),
      R.groupBy((item) => item.summary) //group by summary
    )(val)
  ),
  R.groupBy((item) => item.date), //group by date
  R.flatten, //make the list 1D
  R.values, //drop keys as they are now part of calendar items
  R.mapObjIndexed((val, key, obj) => val.map((item) => ({ ...item, package: key }))), //add package name to each calendar item
  R.filter((c) => !R.isNil(c)) // remove null calendars
)

const dateInfo = (eventDate) => {
  const date = moment.utc(eventDate)
  const today = moment.utc()

  if (today.diff(date, "days") === 0) {
    return "today"
  }

  return today.to(date)
}

class PackageCalendars extends Component {
  constructor() {
    super()
    this.state = {
      expanded: false,
    }
  }
  /*
  componentDidMount() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }
  */

  toggleHandler() {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    if (!this.props.show_calendars) {
      return null
    }

    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })

    const transformedCalendars = transformCalendars(this.props.calendars)
    if (transformedCalendars.length === 0) {
      return null
    }

    console.log(transformedCalendars)

    const calendars = R.take(this.state.expanded ? Infinity : 4, transformedCalendars)

    const calendar_cards = calendars.map((c) => (
      <div
        className="card p-2"
        style={{ backgroundColor: "white" }}
        key={`package_calendar_${c[0]}`}>
        <table>
          <tbody>
            <tr>
              <td className="package-calendar-date">
                {c[0]} <br />
                <span className="package-calendar-dateinfo">{dateInfo(c[0])}</span>
              </td>
              <td className="package-calendar-events">
                {R.keys(c[1]).map((event) => (
                  <div
                    data-toggle="tooltip"
                    data-original-title={c[1][event].packages.join(', ')}
                    className={this.state.expanded ? "pb-1" : "pb-1 text-ellipsis"}
                    key={`event_${event}`}>
                    {c[1][event].url !== "null" ? ( // due to conversion above, null got converted to "null"
                      <a href={c[1][event].url} target="_blank" rel="noopener noreferrer">
                        {event}
                      </a>
                    ) : (
                      event
                    )}
                  </div>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    ))

    return (
      <div className="container package-calendars">
        <div className="row mt-4 text-muted font-weight-bold no-gutters d-flex justify-content-between">
          Package calendars:
          <button className="btn btn-link mt-n2" onClick={this.toggleHandler.bind(this)}>
            {this.state.expanded ? "show less" : "show more"}
          </button>
          <div className="card-columns pt-2">{calendar_cards}</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { user_data } = state
  const { show_calendars } = state.options

  if (user_data === undefined) {
    return {
      calendars: [],
    }
  }

  const { calendars } = user_data.static_info.data

  return {
    calendars,
    show_calendars,
  }
}

export default connect(mapStateToProps)(PackageCalendars)
