import React, { Component } from 'react';
import * as moment from 'moment';
import { connect } from 'react-redux'

import $ from 'jquery';

const toBodhiReleasesUrl = (release) => {
  const url = "https://bodhi.fedoraproject.org/releases"

  if (release.includes('fedora-obsolete-packages')) {
    return {
      url: url + '/F' + release.substr(25,2),
      release: 'Fedora ' + release.substr(25,2)
    }
  } else
  if (release.includes('fc')) {
    return {
      url: url + '/F' + release.substr(2,2),
      release: 'Fedora ' + release.substr(2,2)
    }
  } else
  if (release.includes('el')) {
    return {
      url: url + '/EPEL-' + release.substr(2,1),
      release: 'Fedora EPEL ' + release.substr(2,1)
    }
  } else {
    return {
      url: url,
      release: 'Unknown - FIXME'
    }
  }
}

class WidgetRow extends Component {
  render() {
    return (
      <div className="list-group-item p-1">
        <div className="row align-items-center no-gutters">
          {this.props.children}
        </div>
      </div>
    )
  }
}

class WidgetHead extends Component {
  render() {
    return (
      <div className="col-md">
        <div className="media">
          <span data-toggle="tooltip" title="" data-original-title={this.props.type}><i className={"fa fa-fw "+this.props.icon}></i></span>
          <div className="media-body ml-2">
              {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

class WidgetTitle extends Component {
  render() {
    return (
      <div className="font-weight-bold text-truncate widget-title" data-toggle="tooltip" title="" data-original-title={this.props.fulltitle}>
        {this.props.children}
      </div>
    )
  }
}

class WidgetSubTitle extends Component {
  render() {
    return (
      <div className="line-height-1">
        <small>
          {this.props.children}
        </small>
      </div>
    )
  }
}


class WidgetBadge extends Component {
  render() {
    return (
      <div className="col-auto pl-4 pl-sm-4 pl-md-4 pl-lg-0 p-md-0">
        <span className={"mr-3 font-size-09 p-1 font-weight-normal badge badge-"+this.props.type}>
          <span className="font-weight-bold">
            {this.props.children}
          </span>
        </span>
      </div>
    )
  }
}

class WidgetIconDetail extends Component {
  render() {
    return (
      <div className={"col-auto min-width-3 pl-4 pl-sm-4 pl-md-4 pl-lg-0 font-weight-bold mr-3 " + this.props.color}>
        <div>
          <i className={"pr-1 fa "+this.props.icon} title={this.props.alt}></i>
          {this.props.children}
        </div>
      </div>
    )
  }
}

class OrphanBadge extends Component {
  render() {
    const since = moment.utc(this.props.since)

    return (
        <span className="ml-3 font-size-09 p-1 font-weight-normal badge badge-danger">
          <span className="font-weight-bold">
          <i class="fas fa-user-slash"></i>&nbsp;Orphaned&nbsp;{since.fromNow()}
          </span>
        </span>
    )
  }
}

class FTBadge extends Component {
  render() {
    return (
        <span className="ml-3 font-size-09 p-1 font-weight-normal badge badge-danger">
          <span className="font-weight-bold">
            <i className="fas fa-exclamation-circle"></i>&nbsp;{this.props.children}
          </span>
        </span>
    )
  }
}

class Update extends Component {
  render() {
    const created = moment.utc(this.props.data.submission_date)
    const { url, release } = toBodhiReleasesUrl(this.props.data.release)
    const color = (karma) => {
      if(karma>0)
        return "text-success"
      if(karma<0)
        return "text-danger"

      return "text-muted"
    }
    return (
      <WidgetRow>
        <WidgetHead type="This is an enhancement update" icon="fa-bolt">
          <WidgetTitle fulltitle={this.props.data.pretty_name}>
            <a href={this.props.data.url}>
              {this.props.data.pretty_name}
            </a>
          </WidgetTitle>
          <WidgetSubTitle>
            created <span title={created.toDate()}> {created.fromNow()}</span>&nbsp;for <a href={url}>{release}</a>
          </WidgetSubTitle>
        </WidgetHead>
        <WidgetBadge type="warning">
          {this.props.data.status}
        </WidgetBadge>
        <WidgetIconDetail icon="fa-comment-o" alt="Number of comments" color="text-muted">
          {this.props.data.comments}
        </WidgetIconDetail>
        <WidgetIconDetail icon="fa-thumbs-up" alt="Karma" color={color(this.props.data.karma)}>
          {this.props.data.karma}
        </WidgetIconDetail>
      </WidgetRow>
    )
  }
}

class PR extends Component {
  render() {
    const created = moment.utc(this.props.data.date_created)
    const status = this.props.data.ci_status===null? "unknown" : this.props.data.ci_status

    return (
      <WidgetRow>
        <WidgetHead type="This is a pull request" icon="fa-git">
          <WidgetTitle>
            <a href={this.props.data.url}>
              {this.props.data.title}
            </a>
          </WidgetTitle>
          <WidgetSubTitle>
            opened <span title={created.toDate()}> {created.fromNow()}</span>&nbsp;by {this.props.data.author}
          </WidgetSubTitle>
        </WidgetHead>
        <WidgetBadge type="warning">
          CI {status}
        </WidgetBadge>
        <WidgetIconDetail icon="fa-comment-o" alt="Number of comments" color="text-muted">
          {this.props.data.comments}
        </WidgetIconDetail>
      </WidgetRow>
    )
  }
}

class Bug extends Component {
  render() {
    const reported = moment.utc(this.props.data.reported.replace(/:/g, ""))

    const badge_color = (text) => {
      if(text === "new")
        return "danger"
      if(text === "on_qa")
        return "primary"

      return "info"
    }

    const severity_color = (severity) => {
      if(severity === "urgent")
        return "text-danger"
      if(severity === "high" || severity === "medium")
        return "text-warning"
      if(severity === "low")
        return "text-info"

      return "text-muted"
    }

    return (
      <WidgetRow>
        <WidgetHead type="This is a bug" icon="fa-bug">
          <WidgetTitle fulltitle={this.props.data.title}>
            <a href={this.props.data.url}>
              {this.props.data.title}
            </a>
          </WidgetTitle>
          <WidgetSubTitle>
            #{this.props.data.bug_id} opened
            <span title={reported.toDate()}> {reported.fromNow()}</span> for Fedora {this.props.data.release}
          </WidgetSubTitle>
        </WidgetHead>
        <WidgetBadge type={badge_color(this.props.data.status.toLowerCase())}>
          {this.props.data.status}
        </WidgetBadge>
        <WidgetIconDetail icon="fa-comment-o" alt="Number of comments" color="text-muted">
          {this.props.data.comments}
        </WidgetIconDetail>
        {this.props.data.severity === "unspecified"? null : (
        <WidgetIconDetail icon="fa-shield" alt="Security bug severity" color={severity_color(this.props.data.severity)}>
          {this.props.data.severity[0].toUpperCase()}
        </WidgetIconDetail>
        )}
      </WidgetRow>
    )
  }
}

class Override extends Component {
  render() {
    const created = moment.utc(this.props.data.submission_date)
    const expires = moment.utc(this.props.data.expiration_date)
    const { url, release } = toBodhiReleasesUrl(this.props.data.release)

    return (
      <WidgetRow>
        <WidgetHead type="This is an override" icon="fa-shapes">
          <WidgetTitle>
            <a href={this.props.data.url}>
              {this.props.data.pretty_name}
            </a>
          </WidgetTitle>
          <WidgetSubTitle>
            created <span title={created.toDate()}> {created.fromNow()}</span>&nbsp;for <a href={url}>{release}</a>
          </WidgetSubTitle>
        </WidgetHead>
        <div className="col-xs-auto  pl-4 pl-sm-4 pl-md-4 pl-lg-0 pr-2 text-muted">
          <small>expires <strong>{expires.fromNow()}</strong></small>
        </div>
      </WidgetRow>
    )
  }
}

class Koschei extends Component {
  render() {
    return (
      <WidgetRow>
        <WidgetHead type="This is package fails to build" icon="fa-wrench">
          <WidgetTitle>
            <a href={this.props.data.url}>
              {this.props.title} is failing to build for {this.props.data.release}
            </a>
          </WidgetTitle>
          <WidgetSubTitle>
            &nbsp;
          </WidgetSubTitle>
        </WidgetHead>
      </WidgetRow>
    )
  }
}

class Widget extends Component {
  componentDidMount() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }

  render() {
    const { title, bugs, pull_requests, updates, overrides, koschei, isPrimary, orphan} = this.props

    const bugs_items = bugs.map((bug) => (<Bug data={bug} key={bug.url}/>))
    const updates_items = updates.map((update) => (<Update data={update} key={title+update.pretty_name}/>))
    const pull_requests_items = pull_requests.map((pr) => (<PR data={pr} key={"pr"+pr.title}/>))
    const overrides_items = overrides.map((override) => (<Override data={override} key={"override"+override.pretty_name}/>))
    const koschei_items = koschei.map((k) => (<Koschei title={title} data={k} key={"koschei"+title+k.release}/>))

    const orphan_badge = orphan.orphaned? (<OrphanBadge since={orphan.orphaned_since} />) : null

    const ftbfs_badge = bugs.map((b) => b.keywords.includes("FTBFS")).some(id => id) ? (<FTBadge>FTBFS</FTBadge>) : null
    const fti_badge = bugs.map((b) => b.keywords.includes("FTI")).some(id => id) ? (<FTBadge>FTI</FTBadge>) : null
    const groupIcon = !isPrimary? (<i className="fas fa-users mr-1"></i>) : null

    return (
      <div className="widget card py-3">
        <div className="row no-gutters d-flex justify-content-between">
        <div>
          <h5 className="font-weight-bold d-flex align-items-center">
            {title}{orphan_badge}{ftbfs_badge}{fti_badge}
          </h5>
        </div>
        <div>
          {groupIcon}
        </div>
        </div>
        <div className="list-group">
          {bugs_items}
          {updates_items}
          {pull_requests_items}
          {overrides_items}
          {koschei_items}
        </div>
      </div>
    );
  }

}

const mapStateToProps = state => {
  const { options } = state

  return {
    options
  }
}

export default connect(mapStateToProps)(Widget)
