import React, { createRef, PureComponent } from "react"
import $ from "jquery"
import * as moment from "moment"

export class WidgetRow extends PureComponent {
  render() {
    return (
      <div className={`list-group-item p-1 ${this.props.className || ""}`}>
        <div className="row align-items-center no-gutters">{this.props.children}</div>
      </div>
    )
  }
}

export class WidgetCollapsibleRow extends PureComponent {
  render() {
    return (
      <div
        className="list-group-item p-1"
        //onClick={this.props.handler}
        //data-toggle="collapse"
        //data-target={`#${this.props.id}`}
      >
        <div className="row align-items-center no-gutters">{this.props.children}</div>
        <WidgetCollapsibleBlock id={this.props.id} noMargin={this.props.noMargin}>
          {this.props.collapsibleData}
        </WidgetCollapsibleBlock>
      </div>
    )
  }
}

export class WidgetHead extends PureComponent {
  render() {
    const column = this.props.col || "col-md"
    return (
      <div className={column}>
        <div className="media">
          <div className="d-flex flex-row">
            <div className="d-flex flex-column align-items-center">
              <span data-toggle="tooltip" title="" data-original-title={this.props.type} className={this.props.private?"private":""}>
                <i className={"fa fa-fw " + this.props.icon}></i>
              </span>
              <span className="bb">
                {this.props.bb}
              </span>
            </div>
            <div className="media-body ml-2">{this.props.children}</div>
          </div>
        </div>
      </div>
    )
  }
}

export class WidgetTitle extends PureComponent {
  constructor(props) {
    super(props)
    this.titleRef = createRef()
    this.state = {
      showTooltip: true,
    }
  }

  componentDidMount() {
    const div = $(this.titleRef.current)
    this.setState({ showTooltip: div.innerWidth() < div[0].scrollWidth })
  }

  render() {
    return (
      <div
        className="font-weight-bold text-truncate widget-title"
        data-toggle="tooltip"
        title=""
        data-original-title={this.state.showTooltip ? this.props.fulltitle : undefined}
        ref={this.titleRef}>
        {this.props.children}
      </div>
    )
  }
}

export class WidgetSubTitle extends PureComponent {
  render() {
    return (
      <div className="line-height-1">
        <small>{this.props.children}</small>
      </div>
    )
  }
}

export class WidgetBadge extends PureComponent {
  render() {
    return (
      <div className={`${this.props.col || "col-auto"} pl-4 pl-sm-4 pl-md-4 pl-lg-0 p-md-0`}>
        <span
          className={"mr-3 font-size-09 p-1 font-weight-normal badge badge-" + this.props.type}>
          <span className="font-weight-bold">{this.props.children}</span>
        </span>
      </div>
    )
  }
}

export class WidgetIconDetail extends PureComponent {
  render() {
    return (
      <div
        className={
          `col-auto min-width-3 pl-4 pl-sm-4 pl-md-4 pl-lg-0 font-weight-bold mr-3 ${
            this.props.className || ""
          } ` + this.props.color
        }>
        <div>
          <i className={"pr-1 fa " + this.props.icon} title={this.props.alt}></i>
          {this.props.children}
        </div>
      </div>
    )
  }
}

class BadgeBase extends PureComponent {
  render() {
    return (
      <span className={`ml-3 font-size-09 p-1 font-weight-normal badge ${this.props.className}`}>
        <span className="font-weight-bold">{this.props.children}</span>
      </span>
    )
  }
}

export class OrphanBadge extends PureComponent {
  render() {
    const since = moment.utc(this.props.since)

    return (
      <BadgeBase className="badge-danger">
        <i className="fas fa-user-slash"></i>&nbsp;Orphaned&nbsp;{since.fromNow()}
      </BadgeBase>
    )
  }
}

export class OrphanImpactedBadge extends PureComponent {
  render() {
    return (
      <BadgeBase className="badge-danger">
        <i className="fas fa-user-slash"></i>&nbsp;Orphan impacted
      </BadgeBase>
    )
  }
}

export class FTBadge extends PureComponent {
  render() {
    return (
      <BadgeBase className="badge-danger">
        <i className="fas fa-exclamation-circle"></i>&nbsp;{this.props.children}
      </BadgeBase>
    )
  }
}

export class BBBadge extends PureComponent {
  render() {
    return (
      <BadgeBase className={`badge-${this.props.color}`}>
        <i className="fas fa-bug"></i>&nbsp;{this.props.children}
      </BadgeBase>
    )
  }
}

export class WidgetChevron extends PureComponent {
  render() {
    return (
      <div
        onClick={this.props.handler}
        className={`${
          this.props.col || "col-2"
        } text-right pr-2 pl-0 pl-sm-0 pl-md-0 pl-lg-0 font-weight-bold text-muted mh-100`}>
        {this.props.collapsed ? (
          <i className="fas fa-chevron-down mr-2"></i>
        ) : (
          <i className="fas fa-chevron-up mr-2"></i>
        )}
      </div>
    )
  }
}

export class WidgetCollapsibleBlock extends PureComponent {
  render() {
    return (
      <div className="row no-gutters pl-4">
        <div className={"collapse small bg-white " + (this.props.noMargin? "" : "mt-n3")} id={this.props.id}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
