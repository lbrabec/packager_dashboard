import React, { PureComponent } from "react"
import {
  WidgetCollapsibleRow,
  WidgetHead,
  WidgetTitle,
  WidgetSubTitle,
  WidgetChevron,
} from "./WidgetLayout"
import * as R from "ramda"
import * as moment from "moment"
import $ from "jquery"
import { connect } from "react-redux"
import { setDepGraph } from "../../actions/reduxActions"

class _Orphan extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      collapsed: true,
    }
  }

  collapseToggle(e) {
    this.setState({ collapsed: !this.state.collapsed })
    $(`#Orphan_reasons_tree_${this.props.title.replace(/\./g,'-')}`).collapse('toggle')
    e.stopPropagation()
  }

  showNetwork(e){
    const {title, vis_js, direct_dependencies, remote_dependencies} = this.props
    this.props.dispatch(setDepGraph({
      ...vis_js,
      allOrphans: [...direct_dependencies, ...remote_dependencies],
      forPkg: title,
    }))
    $('#modal-network').modal('toggle');
    e.stopPropagation()
  }

  render() {
    const { problematic_since, direct_dependencies, remote_dependencies, title } = this.props
    const titleSafe = title.replace(/\./g,'-') // dot in element IDs causes problems...
    const fulltitle = "depends on orphaned packages"
    const problematicSince = moment.utc(problematic_since)
    const trouble = moment.utc(problematic_since).add(6, "w")
    const now = moment().utc()

    const collapsibleData = (
      <span>
        problematic since {problematicSince.format("MMM D YYYY, H:mm:ss z")}
        <br />
        {now.isBefore(trouble) ? "will have trouble on" : "has trouble since"}{" "}
        {trouble.format("MMM D YYYY, H:mm:ss z")}
        <br /><br />
        {
          direct_dependencies.length > 0?
          (
            <span>
              directly depends on orphaned packages:
              <ul>
                {R.sortBy((pkg) => pkg.toLowerCase(), direct_dependencies).map((dirdep) => (
                  <li key={`orphan_dirdep_${titleSafe}_${dirdep}`}>{dirdep}</li>
                ))}
              </ul>
            </span>
          ) : null
        }
        {
          remote_dependencies.length > 0?
          (
            <span>
              remotely depends on orphaned packages:
              <ul>
                {R.sortBy((pkg) => pkg.toLowerCase(), remote_dependencies).map((remdep) => (
                  <li key={`orphan_remdep_${titleSafe}_${remdep}`}>{remdep}</li>
                ))}
              </ul>
            </span>
          ) : null
        }
        <button type="button" className="btn btn-primary btn-sm"
                onClick={this.showNetwork.bind(this)}>
          Show dependency network
        </button>
      </span>
    )
    return (
      <WidgetCollapsibleRow
        handler={this.collapseToggle.bind(this)}
        id={`Orphan_reasons_tree_${titleSafe}`}
        collapsibleData={collapsibleData}>
        <WidgetHead type="This package depends on orphan(s)" icon="fa-user-slash" col="col-10">
          <WidgetTitle fulltitle={fulltitle}>{fulltitle}</WidgetTitle>
          <WidgetSubTitle>
            {this.state.collapsed ? (
              now.isBefore(trouble) ? (
                `will have trouble ${trouble.fromNow()}`
              ) : (
                `has trouble since ${trouble.fromNow()}`
              )
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

export const Orphan = connect((_) => {
  return {}
})(_Orphan)
