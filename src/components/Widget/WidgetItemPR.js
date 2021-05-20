import React, { PureComponent } from "react"
import {
  WidgetCollapsibleRow,
  WidgetHead,
  WidgetTitle,
  WidgetSubTitle,
  WidgetBadge,
  WidgetChevron,
} from "./WidgetLayout"
import $ from "jquery"
import * as R from "ramda"
import * as moment from "moment"


const getMixedBadge = (cis) => {
  const results = R.compose(
    R.toPairs,
    R.pickBy((val, key) => ["succ", "fail", "erro"].includes(val)),
    R.mapObjIndexed((val, key, obj) => val.slice(0,4)),
    R.pickBy((val, key) => val !== null)
  )(cis)

  if (results.length === 0){
    return (
      <div className="col-2">&nbsp;</div>
    )
  }

  if (results.every((val) => val[1] === "succ")) {
    return (
      <WidgetBadge col="col-md-2" type="success">
        PASS <i className="fas fa-check-circle"></i>
      </WidgetBadge>
    )
  } else
  if (results.every((val) => val[1] === "fail")) {
    return (
      <WidgetBadge col="col-md-2" type="danger">
        FAIL <i className="fas fa-times-circle"></i>
      </WidgetBadge>
    )
  } else {
    return (
      <WidgetBadge col="col-md-2" type="warning">
        <span className="text-white">MIXED <i className="fas fa-exclamation-circle"></i></span>
      </WidgetBadge>
    )
  }
}

const resultToBadge = (result) => {
  if (result.startsWith("succ"))
    return (
      <span className="badge badge-success">{result}</span>
    )
  if (result.startsWith("fail") || (result.startsWith("error")))
  return (
    <span className="badge badge-danger">{result}</span>
  )

  return (
    <span className="badge badge-info">{result}</span>
  )
}

export class PR extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      collapsed: true,
    }

    this.pkg = this.props.url.split('/').slice(-3)[0].replace(/\./g,"_")
    this.prid = this.props.url.split('/').slice(-1)[0]
  }

  collapseToggle(e) {
    this.setState({ collapsed: !this.state.collapsed })
    $(`#PR_${this.pkg}_${this.prid}`).collapse('toggle')
    e.stopPropagation()
  }

  render() {
    const created = moment.utc(this.props.date_created)

    const data = (
      <>
          opened <span title={created.toDate()}> {created.fromNow()}</span>&nbsp;by{" "}
              {this.props.author} for {this.props.release}
        <div className="my-2">
          {
            R.compose(
              R.map((ci) => (
                <div className="row" key={`${this.prid}_${ci[0]}`}>
                  <div className="col-6">{ci[0]}</div>
                  <div className="col-6">{resultToBadge(ci[1])}</div>
                </div>
              )),
              R.toPairs,
              R.pickBy((val, key) => val !== null)
            )(this.props.ci_status)
          }
        </div>
      </>
    )

    return (
      <WidgetCollapsibleRow
        handler={this.collapseToggle.bind(this)}
        id={`PR_${this.pkg}_${this.prid}`}
        collapsibleData={data}>
        <WidgetHead type="This is a pull request" icon="fa-git" col="col-md">
          <WidgetTitle fulltitle={this.props.title}>
            <a target="_blank" rel="noopener noreferrer" href={this.props.url}>{this.props.title}</a>
          </WidgetTitle>
          <WidgetSubTitle>
          {this.state.collapsed ? (
            <>opened <span title={created.toDate()}> {created.fromNow()}</span>&nbsp;by{" "}
            {this.props.author} for {this.props.release}</>
          ) : (<span>&nbsp;</span>)
          }
          </WidgetSubTitle>
        </WidgetHead>
        {getMixedBadge(this.props.ci_status)}

        <WidgetChevron collapsed={this.state.collapsed} col="col-md-1"/>
      </WidgetCollapsibleRow>
    )
  }
}
