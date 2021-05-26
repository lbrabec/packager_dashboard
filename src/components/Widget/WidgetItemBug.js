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

const getClassName = (keywords) => {
  if (keywords.includes("AcceptedBlocker"))
    return "accepted-blocker"

  if (keywords.includes("ProposedBlocker") ||
      keywords.includes("ProposedFE") ||
      keywords.includes("AcceptedFE"))
      return "proposed-blocker"

  return ""
}

const getBBType = (keywords) => {
  if (keywords.includes("AcceptedBlocker") || keywords.includes("ProposedBlocker"))
    return "B"

  if (keywords.includes("AcceptedFE") || keywords.includes("ProposedFE"))
    return "FE"

  return ""
}

const getType = (priv, keywords) => {
  const BBs = ["Proposed FE", "Accepted FE", "Proposed Blocker", "Accepted Blocker"]
      .filter(kw => keywords.includes(kw.replace(" ", "")))

  const BBs_string = BBs.length !== 0? ` (${BBs.join(', ')})` : ""

  if (priv) {
    return `This is a private bug${BBs_string}`
  } else {
    return `This is a bug${BBs_string}`
  }
}

export class Bug extends PureComponent {
  render() {
    const modified = moment.utc(this.props.modified)

    return (
      <WidgetRow className={getClassName(this.props.keywords)}>
        <WidgetHead type={getType(this.props.private, this.props.keywords)} icon="fa-bug" private={this.props.private} bb={getBBType(this.props.keywords)}>
          <WidgetTitle fulltitle={this.props.title}>
            <a target="_blank" rel="noopener noreferrer" href={this.props.url}>{this.props.title}</a>
          </WidgetTitle>
          <WidgetSubTitle>
            #{this.props.bug_id} modified
            <span title={modified.toDate()}> {modified.fromNow()}</span> for {this.props.release}
          </WidgetSubTitle>
        </WidgetHead>
        <WidgetBadge type={badge_color(this.props.status.toLowerCase())}>
          {this.props.status}
        </WidgetBadge>
        <WidgetIconDetail icon="fa-comment-o" alt="Number of comments" color="text-muted" className="comments">
          {this.props.comments}
        </WidgetIconDetail>
        {this.props.priority_severity === "unspecified" ? null : (
          <WidgetIconDetail
            icon="fa-shield"
            alt={`${this.props.priority_severity} severity/priority`}
            color={priority_severity_color(this.props.priority_severity)}>
            {this.props.priority_severity[0].toUpperCase()}
          </WidgetIconDetail>
        )}
      </WidgetRow>
    )
  }
}
