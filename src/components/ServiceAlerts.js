import React, { PureComponent } from "react"
import { connect } from "react-redux"
import * as R from "ramda"

class ServiceAlerts extends PureComponent {
  dismissHandler(id) {
    const dismissedMessages = R.defaultTo([], JSON.parse(localStorage.getItem('dismissedMessages')))
    console.log(dismissedMessages)
    const newDismissedMessages = [...dismissedMessages, id]
    console.log(newDismissedMessages)
    localStorage.setItem('dismissedMessages', JSON.stringify(newDismissedMessages))
  }

  render() {
    const dissmissedMessages = R.defaultTo([], JSON.parse(localStorage.getItem('dismissedMessages')))
    console.log("*************************")
    console.log(dissmissedMessages)
    const messages = R.compose(
      R.map(message => (
        <div className={"alert alert-" + message.severity + " alert-dismissible fade show mt-4"} role="alert" key={`message_${message.id}`}>
          <span className="font-weight-bold">
            {message.text}

            <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={(e) => this.dismissHandler(message.id)}>
              <span aria-hidden="true">&times;</span>
            </button>
          </span>
        </div>
      )),
      R.filter(m => !dissmissedMessages.includes(m.id))
    )(this.props.service_messages)


    return (
      <div className="container">
        {messages}
      </div>
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
