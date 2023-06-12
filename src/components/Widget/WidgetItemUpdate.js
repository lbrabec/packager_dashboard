import React, { PureComponent } from "react"
import {
  WidgetCollapsibleRow,
  WidgetChevron,
  WidgetHead,
  WidgetTitle,
  WidgetSubTitle,
  WidgetBadge,
  WidgetIconDetail,
} from "./WidgetLayout"
import * as moment from "moment"
import $ from "jquery"

const karma_color = (karma) => {
  if (karma > 0) return "text-success"
  if (karma < 0) return "text-danger"

  return "text-muted"
}

const getStableText = (props) => {
  if (props.stable_by_time === null) {
    return null
  }

  const now = moment().utc()
  const stableTime = moment.utc(props.stable_by_time)

  if (now.isBefore(stableTime)) {
    return ` goes stable ${stableTime.fromNow()}`
  } else {
    if (props.isFreeze && props.release.includes(props.branched)) {
      return " goes stable after freeze"
    } else {
      return ` should have gone stable ${stableTime.fromNow()}`
    }
  }
}

export class Update extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      collapsed: true,
    }
  }

  collapseToggle(e) {
    this.setState({ collapsed: !this.state.collapsed })
    $(`#update_${this.props.title.replace(".", "_")}_${this.props.updateid}`).collapse("toggle")
    e.stopPropagation()
  }

  render() {
    const created = moment.utc(this.props.submission_date)
    const stableText = getStableText(this.props)

    const data = (
      <>
        <br />
        Builds:
        <ul>
          {this.props.builds_nvrs.map((nvr) => (
            <li key={`${this.props.title.replace(".", "_")}_${nvr}`}>
              <a href={`https://koji.fedoraproject.org/koji/search?terms=${nvr}&type=build&match=glob`}
                 target="_blank" rel="noopener noreferrer"
                 onClick={(e) => e.stopPropagation()}>
                {nvr}
              </a>
            </li>
          ))}
        </ul>
      </>
    )
    const article = "eyuioa".includes(this.props.type[0])? "an" : "a"
    return (
      <WidgetCollapsibleRow
        id={`update_${this.props.title.replace(".", "_")}_${this.props.updateid}`}
        collapsibleData={data}
        noMargin={true}>
        <WidgetHead type={`This is ${article} ${this.props.type} update`} icon="fa-bolt">
          <WidgetTitle fulltitle={this.props.pretty_name}>
            <a target="_blank" rel="noopener noreferrer" href={this.props.url}>{this.props.pretty_name}</a>
          </WidgetTitle>
          <WidgetSubTitle>
            created <span title={created.toDate()}> {created.fromNow()}</span>&nbsp;for{" "}
            {this.props.release}{stableText}
          </WidgetSubTitle>
        </WidgetHead>
        <WidgetBadge type="warning">{this.props.status}</WidgetBadge>
        <WidgetIconDetail icon="fa-comment-o" alt="Number of comments" color="text-muted">
          {this.props.comments}
        </WidgetIconDetail>
        <WidgetIconDetail icon="fa-thumbs-up" alt="Karma" color={karma_color(this.props.karma)}>
          {this.props.karma}
        </WidgetIconDetail>
        <WidgetChevron collapsed={this.state.collapsed} handler={this.collapseToggle.bind(this)} col="col-md-1" />
      </WidgetCollapsibleRow>
    )
  }
}
