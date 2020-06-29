import React, { PureComponent } from "react"

class ItemsInfo extends PureComponent {
  render() {
    return (
      <div className="container text-center text-muted font-weight-bold py-4">
        {this.props.hiddenDueFiltering ? (
          "Some packages or items are hidden due to the filtering options"
        ) : this.props.shownPackages === 0 ? (
          <div>
            <h1 className="display-1">
              <i className="fas fa-clipboard-check"></i>
            </h1>
            <h1 className="mt-4">No action items</h1>
          </div>
        ) : (
          ""
        )}
      </div>
    )
  }
}

export default ItemsInfo
