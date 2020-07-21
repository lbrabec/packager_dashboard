import React, { Component } from "react"
import { connect } from "react-redux"
import { Network } from "vis-network"
import "vis-network/styles/vis-network.min.css"
import $ from "jquery"

class ModalNetwork extends Component {
  draw() {
    const container = document.getElementById("network-canvas")
    const options = {
      autoResize: true,
      interaction: {
        navigationButtons: true
      },
      height: "100%",
      width: "100%",
      nodes: {
        shape: "dot",
        size: 5,
        borderWidth: 3,
        color: {
          border: "#3c6eb4",
          background: "white",
        },
        fixed: false,
      },
      edges: {
        smooth: {
          type: "cubicBezier",
          forceDirection: "horizontal",
          roundness: 0.6,
        },
        color: "#3c6eb4",
      },
      layout: {
        hierarchical: {
          sortMethod: "directed",
          shakeTowards: "leaves",
          parentCentralization: false,
          direction: "LR",
          nodeSpacing: 100,
          levelSeparation: 150,
          blockShifting: true,
          edgeMinimization: false,
        },
      },
      physics: false,
    }

    var network = new Network(container, this.props.depGraph, options)
    network.redraw()
  }

  componentDidMount() {
    const that = this
    $("#modal-network").on("shown.bs.modal", (event) => {
      that.draw()
    })
  }

  render() {
    return (
      <div
        className="modal fade"
        id="modal-network"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="networkModal"
        aria-hidden="true"
        data-focus="false">
        <div className="modal-dialog modal-xl" role="document">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center">
              <h4 className="modal-title" id="optionsModalLabel">
                Dependency network
              </h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                data-taget="#modal-network"
                aria-label="Close"
                id="close-button">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body p-0">
              <div id="network-canvas"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    depGraph: state.depGraph,
  }
}

export default connect(mapStateToProps)(ModalNetwork)
