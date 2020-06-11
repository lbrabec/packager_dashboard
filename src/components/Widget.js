import React, { PureComponent } from "react"
import { connect } from "react-redux"
import { Bug, Update, PR, Override, Koschei, FTI } from "./WidgetItems"
import { OrphanBadge, FTBadge } from "./WidgetLayout"
import $ from "jquery"
import * as R from "ramda"

class Widget extends PureComponent {
  componentDidMount() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }

  render() {
    const {
      title,
      bugs,
      pull_requests,
      updates,
      overrides,
      koschei,
      fti,
      ownershipIcon,
      orphan,
    } = this.props

    const bugs_items = bugs.map((bug) => <Bug {...bug} key={bug.url} />)
    const updates_items = updates.map((update) => (
      <Update {...update} key={title + update.pretty_name} />
    ))
    const pull_requests_items = pull_requests.map((pr) => <PR {...pr} key={"pr" + pr.title} />)
    const overrides_items = overrides.map((override) => (
      <Override {...override} key={"override" + override.pretty_name} />
    ))
    const koschei_items = koschei.map((k) => (
      <Koschei title={title} {...k} key={"koschei" + title + k.release} />
    ))


    console.log(title)
    const fti_no_src = R.compose(
      R.filter((r) => R.keys(r).length > 0),
      R.map((f) => R.pickBy((v, k) => k !== "src", f.reason))
    )(fti)

    console.log(fti_no_src)

    const fti_items = fti.map((f) => <FTI title={title} {...f} key={"fti" + title + f} isFTI={fti_no_src.length > 0} />)
    const orphan_badge = orphan.orphaned ? <OrphanBadge since={orphan.orphaned_since} /> : null
    const fti_src = fti.map(f => R.keys(f.reason).includes("src")).some(R.identity)
    const ftbfs_badge = (fti_src || koschei.length > 0) ? <FTBadge>FTBFS</FTBadge> : null
    const fti_badge = fti_no_src.length > 0 ? <FTBadge>FTI</FTBadge> : null

    return (
      <div className="widget card py-3">
        <div className="row no-gutters d-flex justify-content-between">
          <div>
            <h5 className="font-weight-bold d-flex align-items-center">
              {title}
              {orphan_badge}
              {ftbfs_badge}
              {fti_badge}
            </h5>
          </div>
          <div>{ownershipIcon}</div>
        </div>
        <div className="list-group">
          {bugs_items}
          {updates_items}
          {pull_requests_items}
          {overrides_items}
          {koschei_items}
          {fti_items}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (_) => {
  return {}
}

export default connect(mapStateToProps)(Widget)
