import React, { PureComponent } from "react"
import {
  WidgetCollapsibleRow,
  WidgetHead,
  WidgetTitle,
  WidgetSubTitle,
  WidgetChevron,
} from "./WidgetLayout"
import * as moment from "moment"

export class Orphan extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      collapsed: true,
    }
  }

  collapseToggle() {
    this.setState({ collapsed: !this.state.collapsed })
  }

  render() {
    const { problematic_since, reason_tree, title } = this.props
    const fulltitle = "depends on orphaned packages"
    const since = moment.utc(problematic_since)
    const collapsibleData = (
      <span>
        problematic since {since.format("MMM D YYYY, H:mm:ss z")}
        <br />
        will have trouble on {since.add(6, "w").format("MMM D YYYY, H:mm:ss z")}
        <br />
        directly or indirectly depends on orphaned packages:
        <ul>
          {reason_tree.map((reason) => (
            <li key={`orphan_reason_${title}_${reason}`}>{reason}</li>
          ))}
        </ul>
      </span>
    )
    return (
      <WidgetCollapsibleRow
        handler={this.collapseToggle.bind(this)}
        id={`Orphan_reasons_tree_${title}`}
        collapsibleData={collapsibleData}>
        <WidgetHead type="This package depends on orphan(s)" icon="fa-baby" col="col-10">
          <WidgetTitle fulltitle={fulltitle}>{fulltitle}</WidgetTitle>
          <WidgetSubTitle>
            {this.state.collapsed ? (
              `will have trouble ${since.add(6, "w").fromNow()}`
            ) : (
              <span>&nbsp;</span>
            )}
          </WidgetSubTitle>
        </WidgetHead>
        <WidgetChevron collapsed={this.state.collapsed} />
      </WidgetCollapsibleRow>
    )
  }
}
