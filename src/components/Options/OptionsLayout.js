import React, { Component } from "react"


export class OptionsSwitch extends Component {
  render() {
    return (
      <div className="custom-control custom-switch">
        <input
          type="checkbox"
          className="custom-control-input"
          name={this.props.name}
          id={this.props.name}
          checked={this.props.value}
          onChange={this.props.handler}
        />
        <label className="custom-control-label" htmlFor={this.props.name}>
          {this.props.children}
        </label>
      </div>
    )
  }
}

export class CustomRadio extends Component {
  render() {
    return (
      <div className="custom-control custom-radio">
        <input
          type="radio"
          id={this.props.name + "-" + this.props.type}
          name={this.props.name}
          value={this.props.type}
          checked={this.props.value === this.props.type}
          onChange={this.props.handler}
          className="custom-control-input"
        />
        <label className="custom-control-label" htmlFor={this.props.name + "-" + this.props.type}>
          {this.props.children}
        </label>
      </div>
    )
  }
}

export class CustomCheckbox extends Component {
  render() {
    return (
      <div className="custom-control custom-checkbox">
        <input
          type="checkbox"
          className="custom-control-input"
          id={this.props.name}
          name={this.props.name}
          checked={this.props.value}
          onChange={this.props.handler}
        />
        <label className="custom-control-label" htmlFor={this.props.name}>
          {this.props.children}
        </label>
      </div>
    )
  }
}

export class GroupTriSwitch extends Component {
  render() {
    return (
      <div className="row no-gutters">
        <div className="col-1">
          <CustomRadio
            name={this.props.name}
            handler={this.props.handler}
            type="always"
            value={this.props.value}></CustomRadio>
        </div>
        <div className="col-1">
          <CustomRadio
            name={this.props.name}
            handler={this.props.handler}
            type="mine"
            value={this.props.value}></CustomRadio>
        </div>
        <div className="col-1">
          <CustomRadio
            name={this.props.name}
            handler={this.props.handler}
            type="never"
            value={this.props.value}></CustomRadio>
        </div>
        <div className="col-auto">
          <div className="">
            <label>{this.props.children}</label>
          </div>
        </div>
      </div>
    )
  }
}

export class GroupSwitch extends Component {
  render() {
    //compatibility with tri switch
    const value = this.props.value === "mine"? "never" : this.props.value

    return (
      <div className="row no-gutters">
        <div className="col-1">
          <CustomRadio
            name={this.props.name}
            handler={this.props.handler}
            type="always"
            value={value}></CustomRadio>
        </div>
        <div className="col-1">
          <CustomRadio
            name={this.props.name}
            handler={this.props.handler}
            type="never"
            value={value}></CustomRadio>
        </div>
        <div className="col-auto">
          <div className="">
            <label>{this.props.children}</label>
          </div>
        </div>
      </div>
    )
  }
}
