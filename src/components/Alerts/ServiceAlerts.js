import React, { PureComponent } from "react"
import { connect } from "react-redux"
import * as R from "ramda"

class ServiceAlerts extends PureComponent {
  dismissHandler(id) {
    const dismissedMessages = R.defaultTo([], JSON.parse(localStorage.getItem('dismissedMessages')))
    const newDismissedMessages = [...dismissedMessages, id]
    localStorage.setItem('dismissedMessages', JSON.stringify(newDismissedMessages))
  }

  render() {
    const dissmissedMessages = R.defaultTo([], JSON.parse(localStorage.getItem('dismissedMessages')))
    const messages = R.compose(
      R.map(message => (
        <div className="container pt-4">
          <div className={"alert alert-" + message.severity + " alert-dismissible fade show"} role="alert" key={`message_${message.id}`}>
            <span className="font-weight-bold">
              {message.text}
              <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={(e) => this.dismissHandler(message.id)}>
                <span aria-hidden="true">&times;</span>
              </button>
            </span>
          </div>
        </div>
      )),
      R.filter(m => !dissmissedMessages.includes(m.id))
    )(this.props.service_messages)


    return (
        messages
    )
  }
}

const mapStateToProps = (state) => {
  const { service_messages } = state
  return {
    service_messages
  }
}

export default connect(mapStateToProps)(ServiceAlerts)
