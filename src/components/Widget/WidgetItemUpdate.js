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

export class Update extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      collapsed: true,
    }
  }

  collapseToggle(e) {
    this.setState({ collapsed: !this.state.collapsed })
    $(`#update_${this.props.updateid.replace(".", "_")}`).collapse("toggle")
    e.stopPropagation()
  }

  render() {
    const created = moment.utc(this.props.submission_date)
    const stable = moment.utc(this.props.stable_by_time)
    const now = moment().utc()
    const stableText = this.props.stable_by_time !== null? `, ${now.isBefore(stable)? "goes" : "should have gone"} stable ${stable.fromNow()}` : null

    const data = (
      <>
        <br />
        Builds:
        <ul>
          {this.props.builds_nvrs.map((nvr) => (
            <li>
              {nvr}
            </li>
          ))}
        </ul>
      </>
    )

    return (
      <WidgetCollapsibleRow
        handler={this.collapseToggle.bind(this)}
        id={`update_${this.props.updateid.replace(".", "_")}`}
        collapsibleData={data}
        noMargin={true}>
        <WidgetHead type="This is an enhancement update" icon="fa-bolt">
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
        <WidgetChevron collapsed={this.state.collapsed} col="col-md-1" />
      </WidgetCollapsibleRow>
    )
  }
}
