import React, { PureComponent } from "react"
import {
  WidgetRow,
  WidgetHead,
  WidgetTitle,
  WidgetSubTitle,
} from "./WidgetLayout"
import * as moment from "moment"

export class Override extends PureComponent {
  render() {
    const created = moment.utc(this.props.submission_date)
    const expires = moment.utc(this.props.expiration_date)

    return (
      <WidgetRow>
        <WidgetHead type="This is an override" icon="fa-shapes">
          <WidgetTitle>
            <a href={this.props.url}>{this.props.pretty_name}</a>
          </WidgetTitle>
          <WidgetSubTitle>
            created <span title={created.toDate()}> {created.fromNow()}</span>&nbsp;for{" "}
            {this.props.release}
          </WidgetSubTitle>
        </WidgetHead>
        <div className="col-xs-auto  pl-4 pl-sm-4 pl-md-4 pl-lg-0 pr-2 text-muted">
          <small>
            expires <strong>{expires.fromNow()}</strong>
          </small>
        </div>
      </WidgetRow>
    )
  }
}
