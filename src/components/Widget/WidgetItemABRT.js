import React, { PureComponent } from "react"
import {
  WidgetCollapsibleRow,
  WidgetRow,
  WidgetHead,
  WidgetTitle,
  WidgetSubTitle,
  WidgetChevron,
} from "./WidgetLayout"
import $ from "jquery"

export const ABRT = (props) => {
  if (props.outstanding_problems.length > 0) {
    return <ABRToutstanding {...props} />
  } else {
    return <ABRTnoOutstanding {...props} />
  }
}

class ABRToutstanding extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      collapsed: true,
    }
  }

  collapseToggle(e) {
    this.setState({ collapsed: !this.state.collapsed })
    $(`#ABRT_${this.props.pkg.replace(".", "_")}`).collapse("toggle")
    e.stopPropagation()
  }

  render() {
    const data = (
      <ul>
        {this.props.outstanding_problems.map((p) => (
          <li>
            crash function: {p.crash_function} <br />
            count: {p.count} <br />
            <a target="_blank" rel="noopener noreferrer" href={p.url} onClick={(e) => { e.stopPropagation() }}>{p.url}</a>
          </li>
        ))}
      </ul>
    )

    const outProbCnt = this.props.outstanding_problems.length
    return (
      <WidgetCollapsibleRow
        handler={this.collapseToggle.bind(this)}
        id={`ABRT_${this.props.pkg.replace(".", "_")}`}
        collapsibleData={data}>
        <WidgetHead type="ABRT problems" icon="fa-chart-area" col="col-md">
          <WidgetTitle fulltitle={this.props.title}>
            <a target="_blank" rel="noopener noreferrer" href={this.props.retrace_link}>
              There are ABRT problems reported
            </a>
          </WidgetTitle>
          <WidgetSubTitle>
            {this.state.collapsed ? (
              <>
                {outProbCnt} outlying problem{outProbCnt === 1 ? null : "s"} (> 2.7σ)
              </>
            ) : (
              <span>&nbsp;</span>
            )}
          </WidgetSubTitle>
        </WidgetHead>

        <WidgetChevron collapsed={this.state.collapsed} col="col-md-1" />
      </WidgetCollapsibleRow>
    )
  }
}

class ABRTnoOutstanding extends PureComponent {
  render() {
    return (
      <WidgetRow>
        <WidgetHead type="ABRT problems" icon="fa-chart-area" col="col-md">
          <WidgetTitle fulltitle={this.props.title}>
            <a target="_blank" rel="noopener noreferrer" href={this.props.retrace_link}>
              There are ABRT problems reported
            </a>
          </WidgetTitle>
          <WidgetSubTitle>0 outlying problems</WidgetSubTitle>
        </WidgetHead>
      </WidgetRow>
    )
  }
}
