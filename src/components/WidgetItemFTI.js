import React, { PureComponent } from "react"
import {
  WidgetCollapsibleRow,
  WidgetHead,
  WidgetTitle,
  WidgetSubTitle,
  WidgetChevron,
} from "./WidgetLayout"
import $ from "jquery"
import * as U from "../utils"

export class FTI extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      collapsed: true,
    }
  }

  collapseToggle(e) {
    this.setState({ collapsed: !this.state.collapsed })
    $(`#FTI_reasons_${this.props.title}_${this.props.release.replace(/\s/g, "")}_${this.props.repo}`).collapse('toggle')
    e.stopPropagation()
  }

  render() {
    const { isFTI, release, repo, title, problems } = this.props
    const mergedProblems = U.mergeIdenticalFTIProblems(problems)
    const fulltitle = `failing to ${isFTI ? "install" : "build"} for ${release} ${
      ["rawhide", "stable"].includes(repo) ? "" : repo
    }`
    const icon = isFTI ? "fa-file-medical-alt" : "fa-wrench"
    const tooltip = isFTI
      ? "This is package fails to install"
      : `Missing build dependencies on ${release}`
    const reasons_list = Object.entries(mergedProblems).map((r) => (
      <span key={title + r[0]}>
        <span className="font-weight-bold">{`${r[0]}: `}</span>
        <ul>
          {r[1].map((ra) => (
            <li key={r[0] + ra}>{ra}</li>
          ))}
        </ul>
      </span>
    ))

    return (
      <WidgetCollapsibleRow
        handler={this.collapseToggle.bind(this)}
        id={`FTI_reasons_${title}_${release.replace(/\s/g, "")}_${repo}`}
        collapsibleData={reasons_list}>
        <WidgetHead type={tooltip} icon={icon} col="col-10">
          <WidgetTitle fulltitle={fulltitle}>{fulltitle}</WidgetTitle>
          <WidgetSubTitle>
            {this.state.collapsed ? Object.keys(problems).join(", ") : <span>&nbsp;</span>}
          </WidgetSubTitle>
        </WidgetHead>
        <WidgetChevron collapsed={this.state.collapsed} />
      </WidgetCollapsibleRow>
    )
  }
}
