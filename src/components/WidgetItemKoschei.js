import React, { PureComponent } from "react"
import {
  WidgetRow,
  WidgetHead,
  WidgetTitle,
  WidgetSubTitle,
} from "./WidgetLayout"

export class Koschei extends PureComponent {
  render() {
    const title = `failing to build for ${this.props.release}`

    return (
      <WidgetRow>
        <WidgetHead type="This is package fails to build" icon="fa-wrench">
          <WidgetTitle fulltitle={title}>
            <a href={this.props.url}>{title}</a>
          </WidgetTitle>
          <WidgetSubTitle>&nbsp;</WidgetSubTitle>
        </WidgetHead>
      </WidgetRow>
    )
  }
}
