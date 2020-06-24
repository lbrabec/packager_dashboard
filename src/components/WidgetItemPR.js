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

export class PR extends PureComponent {
  render() {
    const created = moment.utc(this.props.date_created)

    return (
      <WidgetRow>
        <WidgetHead type="This is a pull request" icon="fa-git">
          <WidgetTitle fulltitle={this.props.title}>
            <a href={this.props.url}>{this.props.title}</a>
          </WidgetTitle>
          <WidgetSubTitle>
            opened <span title={created.toDate()}> {created.fromNow()}</span>&nbsp;by{" "}
            {this.props.author} for {this.props.release}
          </WidgetSubTitle>
        </WidgetHead>
        {this.props.ci_status === null ? null : (
          <WidgetBadge type={this.props.ci_status === "success" ? "success" : "danger"}>
            CI {this.props.ci_status}
          </WidgetBadge>
        )}
        <WidgetIconDetail icon="fa-comment-o" alt="Number of comments" color="text-muted">
          {this.props.comments}
        </WidgetIconDetail>
      </WidgetRow>
    )
  }
}
