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

const karma_color = (karma) => {
  if (karma > 0) return "text-success"
  if (karma < 0) return "text-danger"

  return "text-muted"
}

export class Update extends PureComponent {
  render() {
    const created = moment.utc(this.props.submission_date)

    return (
      <WidgetRow>
        <WidgetHead type="This is an enhancement update" icon="fa-bolt">
          <WidgetTitle fulltitle={this.props.pretty_name}>
            <a href={this.props.url}>{this.props.pretty_name}</a>
          </WidgetTitle>
          <WidgetSubTitle>
            created <span title={created.toDate()}> {created.fromNow()}</span>&nbsp;for{" "}
            {this.props.release}
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
