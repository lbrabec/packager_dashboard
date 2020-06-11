import React, { PureComponent } from "react"
import {
  WidgetRow,
  WidgetHead,
  WidgetTitle,
  WidgetSubTitle,
  WidgetBadge,
  WidgetIconDetail,
} from "./WidgetLayout"
import * as moment from "moment"
import * as R from "ramda"
import $ from "jquery"

const toBodhiReleasesUrl = (release) => {
  const url = "https://bodhi.fedoraproject.org/releases"

  if (release.includes("fedora-obsolete-packages")) {
    return {
      url: url + "/F" + release.substr(25, 2),
      release: "Fedora " + release.substr(25, 2),
    }
  } else if (release.includes("fc")) {
    return {
      url: url + "/F" + release.substr(2, 2),
      release: "Fedora " + release.substr(2, 2),
    }
  } else if (release.includes("el")) {
    return {
      url: url + "/EPEL-" + release.substr(2, 1),
      release: "Fedora EPEL " + release.substr(2, 1),
    }
  } else {
    return {
      url: url,
      release: "Unknown - FIXME",
    }
  }
}

const karma_color = (karma) => {
  if (karma > 0) return "text-success"
  if (karma < 0) return "text-danger"

  return "text-muted"
}

export class Update extends PureComponent {
  render() {
    const created = moment.utc(this.props.submission_date)
    const { url, release } = toBodhiReleasesUrl(this.props.release)

    return (
      <WidgetRow>
        <WidgetHead type="This is an enhancement update" icon="fa-bolt">
          <WidgetTitle fulltitle={this.props.pretty_name}>
            <a href={this.props.url}>{this.props.pretty_name}</a>
          </WidgetTitle>
          <WidgetSubTitle>
            created <span title={created.toDate()}> {created.fromNow()}</span>&nbsp;for{" "}
            <a href={url}>{release}</a>
          </WidgetSubTitle>
        </WidgetHead>
        <WidgetBadge type="warning">{this.props.status}</WidgetBadge>
        <WidgetIconDetail icon="fa-comment-o" alt="Number of comments" color="text-muted">
          {this.props.comments}
        </WidgetIconDetail>
        <WidgetIconDetail icon="fa-thumbs-up" alt="Karma" color={karma_color(this.props.karma)}>
          {this.props.karma}
        </WidgetIconDetail>
      </WidgetRow>
    )
  }
}

export class PR extends PureComponent {
  render() {
    const created = moment.utc(this.props.date_created)
    const status = this.props.ci_status === null ? "unknown" : this.props.ci_status

    return (
      <WidgetRow>
        <WidgetHead type="This is a pull request" icon="fa-git">
          <WidgetTitle fulltitle={this.props.title}>
            <a href={this.props.url}>{this.props.title}</a>
          </WidgetTitle>
          <WidgetSubTitle>
            opened <span title={created.toDate()}> {created.fromNow()}</span>&nbsp;by{" "}
            {this.props.author}
          </WidgetSubTitle>
        </WidgetHead>
        <WidgetBadge type="warning">CI {status}</WidgetBadge>
        <WidgetIconDetail icon="fa-comment-o" alt="Number of comments" color="text-muted">
          {this.props.comments}
        </WidgetIconDetail>
      </WidgetRow>
    )
  }
}

const badge_color = (text) => {
  if (text === "new") return "danger"
  if (text === "on_qa") return "primary"

  return "info"
}

const priority_severity_color = (ps) => {
  if (ps === "urgent") return "text-danger"
  if (ps === "high" || ps === "medium") return "text-warning"
  if (ps === "low") return "text-info"

  return "text-muted"
}

export class Bug extends PureComponent {
  render() {
    const reported = moment.utc(this.props.reported.replace(/:/g, ""))

    return (
      <WidgetRow>
        <WidgetHead type="This is a bug" icon="fa-bug">
          <WidgetTitle fulltitle={this.props.title}>
            <a href={this.props.url}>{this.props.title}</a>
          </WidgetTitle>
          <WidgetSubTitle>
            #{this.props.bug_id} opened
            <span title={reported.toDate()}> {reported.fromNow()}</span> for Fedora{" "}
            {this.props.release}
          </WidgetSubTitle>
        </WidgetHead>
        <WidgetBadge type={badge_color(this.props.status.toLowerCase())}>
          {this.props.status}
        </WidgetBadge>
        <WidgetIconDetail icon="fa-comment-o" alt="Number of comments" color="text-muted">
          {this.props.comments}
        </WidgetIconDetail>
        {this.props.priority_severity === "unspecified" ? null : (
          <WidgetIconDetail
            icon="fa-shield"
            alt="Bug severity or priority"
            color={priority_severity_color(this.props.priority_severity)}>
            {this.props.priority_severity[0].toUpperCase()}
          </WidgetIconDetail>
        )}
      </WidgetRow>
    )
  }
}

export class Override extends PureComponent {
  render() {
    const created = moment.utc(this.props.submission_date)
    const expires = moment.utc(this.props.expiration_date)
    const { url, release } = toBodhiReleasesUrl(this.props.release)

    return (
      <WidgetRow>
        <WidgetHead type="This is an override" icon="fa-shapes">
          <WidgetTitle>
            <a href={this.props.url}>{this.props.pretty_name}</a>
          </WidgetTitle>
          <WidgetSubTitle>
            created <span title={created.toDate()}> {created.fromNow()}</span>&nbsp;for{" "}
            <a href={url}>{release}</a>
          </WidgetSubTitle>
        </WidgetHead>
        <div className="col-xs-auto  pl-4 pl-sm-4 pl-md-4 pl-lg-0 pr-2 text-muted">
          <small>
            expires <strong>{expires.fromNow()}</strong>
          </small>
        </div>
      </WidgetRow>
    )
  }
}

const koscheiNiceRelease = (release) => {
  if (release.startsWith("f")) return release.replace("f", "Fedora ")

  if (release.startsWith("epel")) return release.replace("epel", "Fedora EPEL ")

  //fallback
  return release
}

export class Koschei extends PureComponent {
  render() {
    const title = "failing to build for " + koscheiNiceRelease(this.props.release)

    return (
      <WidgetRow>
        <WidgetHead type="This is package fails to build" icon="fa-wrench">
          <WidgetTitle fulltitle={title}>
            <a href={this.props.url}>{title}</a>
          </WidgetTitle>
          <WidgetSubTitle>&nbsp;</WidgetSubTitle>
        </WidgetHead>
      </WidgetRow>
    )
  }
}

export class FTI extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      collapsed: true,
    }
  }

  collapseToggle() {
    this.setState({ collapsed: !this.state.collapsed })
  }

  render() {
    const title = `failing to install for Fedora ${this.props.release}`
    const reasons = Object.entries(this.props.reason).map((r) => (
      <span>
        <span className="font-weight-bold">{`${r[0]}: `}</span>
        <ul>
          {r[1].map((ra) => (
            <li>{ra}</li>
          ))}
        </ul>
      </span>
    ))

    return (
      <div
        onClick={this.collapseToggle.bind(this)}
        data-toggle="collapse"
        data-target={`#FTI_reasons_${this.props.title}_${this.props.release}`}>
        <div className="list-group-item p-1">
          <div className="row align-items-center no-gutters">
            <WidgetHead type="This is package fails to install" icon="fa-file-medical-alt">
              <WidgetTitle fulltitle={title}>
                <a
                  href={`https://pagure.io/fedora-health-check/blob/master/f/reports/report-${this.props.release}.md`}>
                  {title}
                </a>
              </WidgetTitle>
              <WidgetSubTitle>
                {this.state.collapsed? Object.keys(this.props.reason).join(", ") : <span>&nbsp;</span>}
              </WidgetSubTitle>
            </WidgetHead>
            <div className="col-auto min-width-3 pl-4 pl-sm-4 pl-md-4 pl-lg-0 font-weight-bold mr-3 text-muted mh-100">
              {this.state.collapsed ? (
                <i className="fas fa-expand-arrows-alt mr-2"></i>
              ) : (
                <i className="fas fa-compress-arrows-alt mr-2"></i>
              )}
            </div>
          </div>
          <div className="row no-gutters pl-4">
            <div className="collapse small mt-n3 bg-white" id={`FTI_reasons_${this.props.title}_${this.props.release}`}>
              {reasons}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
