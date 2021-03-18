import React, { PureComponent } from "react"
import { connect } from "react-redux"

class NewcomerAlert extends PureComponent {
  render() {
    if (!this.props.show)
      return null

    return (
      <div className="container mt-4">
        <div className="alert alert-primary alert-dismissible fade show" role="alert">
          It appears you are a newcomer or haven't visited the Fedora Packager Dashboard in the
          last {this.props.caching_info.visits_required_every_n_days} days. Loading could take up
          to a few minutes, depending on number of packages you are maintaining.
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { caching_info } = state
  return {
    caching_info
  }
}

export default connect(mapStateToProps)(NewcomerAlert)
