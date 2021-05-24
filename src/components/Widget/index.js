import React, { PureComponent } from "react"
import { connect } from "react-redux"
import { Bug } from "./WidgetItemBug"
import { Update } from "./WidgetItemUpdate"
import { PR } from "./WidgetItemPR"
import { Override } from "./WidgetItemOverride"
import { Koschei } from "./WidgetItemKoschei"
import { FTI } from "./WidgetItemFTI"
import { Orphan } from "./WidgetItemOrphan"
import { OrphanBadge, FTBadge, BBBadge, OrphanImpactedBadge } from "./WidgetLayout"
import $ from "jquery"
import * as R from "ramda"
import * as moment from "moment"

import "./widget.css"

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
      versions,
      cvesOnly,
    } = this.props

    const bugs_items = R.sortWith([
      cvesOnly?
      R.descend(bug => ["unspecified", "low", "medium", "high", "urgent"].indexOf(bug.severity))
      :
      R.descend(bug => bug.keywords.includes("ProposedBlocker")? 2:0 +
                       bug.keywords.includes("AcceptedBlocker")? 2:0 +
                       bug.keywords.includes("ProposedFE")? 1:0 +
                       bug.keywords.includes("AcceptedFE")? 1:0
      ),
      R.descend(bug => moment.utc(bug.reported).unix())
    ], bugs).map((bug) => <Bug {...bug} key={bug.url} />)
    const updates_items = updates.map((update) => (
      <Update {...update} key={title + update.pretty_name} />
    ))
    const pull_requests_items = prs.map((pr) => <PR {...pr} key={"pr" + pr.url} />)
    const overrides_items = overrides.map((override) => (
      <Override {...override} key={"override" + override.pretty_name} />
    ))
    const koschei_items = koschei.map((k) => (
      <Koschei title={title} {...k} key={"koschei" + title + k.release} />
    ))

    const fti_no_src = R.compose(
      R.filter((r) => R.keys(r).length > 0),
      R.map((f) => R.pickBy((v, k) => !k.startsWith("src"), f.problems))
    )(fti)

    const fti_items = fti.map((f) => <FTI title={title} {...f} key={"fti_" + title + f.release + f.repo} isFTI={fti_no_src.length > 0} />)
    const orphan_badge = orphan.orphaned ? <OrphanBadge since={orphan.problematic_since} /> : null
    const orphan_impacted_badge = orphan.depends_on_orphaned ? <OrphanImpactedBadge color="danger">Orphan impacted</OrphanImpactedBadge> : null
    const orphan_item = orphan.depends_on_orphaned? <Orphan {...orphan} title={title}/> : null
    const fti_src = fti.map(f => R.keys(f.problems).map(p => p.startsWith("src")).some(R.identity)).some(R.identity)
    const ftbfs_badge = (fti_src || koschei.length > 0) ? <FTBadge>FTBFS</FTBadge> : null
    const fti_badge = fti_no_src.length > 0 ? <FTBadge>FTI</FTBadge> : null

    const bug_badges = ["Proposed FE", "Accepted FE", "Proposed Blocker", "Accepted Blocker"]
      .filter(kw => bugs.map(bug => bug.keywords.includes(kw.replace(" ", ""))).some(R.identity))
      .map(kw => <BBBadge color={kw.includes("Proposed")?"warning":"danger"}>{kw}</BBBadge>)

    const cve_bage = bugs.map(bug => bug.keywords.includes("Security") && bug.keywords.includes("SecurityTracking")).some(R.identity)?
      <BBBadge color="danger">CVE</BBBadge> : null

    const orderPrefix = rv => {
      if(rv.startsWith("Fedora ELN")){
        return "2"
      } else
      if(rv.startsWith("Fedora")) {
        return "1"
      } else {
        // EPEL and fallback
        return "3"
      }
    }
    const versions_html = R.compose(
      R.join(""),
      R.map(rv => `${rv[0]}<ul>${rv[1].map(v=>`<li>${(v[0]+':').padEnd(8,"\u00A0")} ${v[1]}</li>`).join('')}</ul>`),
      R.sortBy(rv => orderPrefix(rv[0]) + rv[0]),
      R.toPairs,
      R.mapObjIndexed((val, key, obj) => R.toPairs(val)),
      R.pickBy((v,k) => !R.isEmpty(v)),
      R.mapObjIndexed((val, key, obj) => R.pickBy((v, k) => v!==null, val))
    )(versions)

    return (
      <div className="widget card py-3">
        <div className="row no-gutters d-flex justify-content-between">
          <div>
            <h5 className="font-weight-bold d-flex align-items-center">
              <span data-toggle="tooltip" title="" data-html="true" data-original-title={versions_html}>
                {title}
              </span>
              {orphan_badge}
              {ftbfs_badge}
              {fti_badge}
              {bug_badges}
              {cve_bage}
              {orphan_impacted_badge}
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
