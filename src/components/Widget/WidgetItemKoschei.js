import React, { PureComponent } from "react"
import { WidgetRow, WidgetHead, WidgetTitle, WidgetSubTitle } from "./WidgetLayout"
import * as moment from "moment"

export class Koschei extends PureComponent {
  render() {
    const title = `failing to build for ${this.props.release}`
    const lastOk = moment.utc(this.props.last_success.time)

    return (
      <WidgetRow>
        <WidgetHead type="This package fails to build" icon="fa-wrench">
          <WidgetTitle fulltitle={title}>
            <a target="_blank" rel="noopener noreferrer" href={this.props.url}>{title}</a>
          </WidgetTitle>
          <WidgetSubTitle>
            The last <a target="_blank" rel="noopener noreferrer" href={this.props.last_success.url}>successful build</a> was {lastOk.fromNow()}
          </WidgetSubTitle>
        </WidgetHead>
      </WidgetRow>
    )
  }
}
