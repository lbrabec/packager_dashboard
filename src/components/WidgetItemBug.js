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
    const reported = moment.utc(this.props.reported)
    const isProposedB = this.props.keywords.includes("ProposedBlocker")

    return (
      <WidgetRow className={isProposedB? "proposed-blocker": ""}>
        <WidgetHead type="This is a bug" icon="fa-bug">
          <WidgetTitle fulltitle={this.props.title}>
            <a href={this.props.url}>{this.props.title}</a>
          </WidgetTitle>
          <WidgetSubTitle>
            #{this.props.bug_id} opened
            <span title={reported.toDate()}> {reported.fromNow()}</span> for {this.props.release}
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
            alt="Bug severity or priority"
            color={priority_severity_color(this.props.priority_severity)}>
            {this.props.priority_severity[0].toUpperCase()}
          </WidgetIconDetail>
        )}
      </WidgetRow>
    )
  }
}
