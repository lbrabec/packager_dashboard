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

const getBadge = (text, status) => {
  if (!["success", "failure"].includes(status))
    return null
  else
    return (
      <WidgetBadge type={status === "success" ? "success" : "danger"}>
        {text} {status === "success" ? <i className="fas fa-check-circle"></i> : <i className="fas fa-times-circle"></i>}
      </WidgetBadge>
    )
}

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
        {getBadge("KojiCI", this.props.ci_status["simple-koji-ci"])}
        {getBadge("Zuul", this.props.ci_status.Zuul)}
        <WidgetIconDetail icon="fa-comment-o" alt="Number of comments" color="text-muted">
          {this.props.comments}
        </WidgetIconDetail>
      </WidgetRow>
    )
  }
}
