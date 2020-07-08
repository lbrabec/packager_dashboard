import React, { PureComponent } from "react"
import { connect } from "react-redux"
import { Bug } from "./WidgetItemBug"
import { Update } from "./WidgetItemUpdate"
import { PR } from "./WidgetItemPR"
import { Override } from "./WidgetItemOverride"
import { Koschei } from "./WidgetItemKoschei"
import { FTI } from "./WidgetItemFTI"
import { Orphan } from "./WidgetItemOrphan"
import { OrphanBadge, FTBadge, BBBadge } from "./WidgetLayout"
import $ from "jquery"
import * as R from "ramda"
import * as moment from "moment"

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
      prs,
      updates,
      overrides,
      koschei,
      fti,
      ownershipIcon,
      orphan,
    } = this.props

    const bugs_items = R.sortWith([
      R.descend(bug => bug.keywords.includes("ProposedBlocker")? 1:0 +
                       bug.keywords.includes("AcceptedBlocker")? 1:0
      ),
      R.descend(bug => moment.utc(bug.reported).unix())
    ], bugs).map((bug) => <Bug {...bug} key={bug.url} />)
    const updates_items = updates.map((update) => (
      <Update {...update} key={title + update.pretty_name} />
    ))
    const pull_requests_items = prs.map((pr) => <PR {...pr} key={"pr" + pr.title} />)
    const overrides_items = overrides.map((override) => (
      <Override {...override} key={"override" + override.pretty_name} />
    ))
    const koschei_items = koschei.map((k) => (
      <Koschei title={title} {...k} key={"koschei" + title + k.release} />
    ))

    const fti_no_src = R.compose(
      R.filter((r) => R.keys(r).length > 0),
      R.map((f) => R.pickBy((v, k) => k !== "src", f.reason))
    )(fti)

    const fti_items = fti.map((f) => <FTI title={title} {...f} key={"fti_" + title + f.release + f.repo} isFTI={fti_no_src.length > 0} />)
    const orphan_badge = orphan.orphaned ? <OrphanBadge since={orphan.problematic_since} /> : null
    const orphan_item = orphan.depends_on_orphaned? <Orphan {...orphan} title={title}/> : null
    const fti_src = fti.map(f => R.keys(f.reason).includes("src")).some(R.identity)
    const ftbfs_badge = (fti_src || koschei.length > 0) ? <FTBadge>FTBFS</FTBadge> : null
    const fti_badge = fti_no_src.length > 0 ? <FTBadge>FTI</FTBadge> : null
    const pb_badge = bugs.map(bug => bug.keywords.includes("ProposedBlocker")).some(R.identity)? <BBBadge color="warning">Proposed Blocker</BBBadge> : null

    return (
      <div className="widget card py-3">
        <div className="row no-gutters d-flex justify-content-between">
          <div>
            <h5 className="font-weight-bold d-flex align-items-center">
              {title}
              {orphan_badge}
              {ftbfs_badge}
              {fti_badge}
              {pb_badge}
            </h5>
          </div>
          <div>{ownershipIcon}</div>
        </div>
        <div className="list-group">
          {bugs_items}
          {updates_items}
          {overrides_items}
          {pull_requests_items}
          {koschei_items}
          {fti_items}
          {orphan_item}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (_) => {
  return {}
}

export default connect(mapStateToProps)(Widget)
