import React from 'react'
import _ from 'lodash'

export default class UserInput extends React.Component {

  constructor(props) {
    super(props)

    this.identifierFieldName = "identifierField"
    this.tokenFieldName = "tokenField"

    this.inputs = {}

    _.bindAll(this, 'showPassword', 'updateHashs')
  }

  showPassword() {

  }

  updateHashs(event) {
    this.inputs[event.target.id] = event.target.value
    
    this.props.radio.broadcast('inputChanged',
      this.inputs[this.identifierFieldName],
      this.inputs[this.tokenFieldName])
  }

  render() {
    return (<div>
      Identifier: <input type="text" onKeyUp={this.updateHashs} id={this.identifierFieldName} />
      Token: <input type="password" onKeyUp={this.updateHashs} id={this.tokenFieldName} />
      <span className="glyphicon glyphicon-eye-open pointer" aria-hidden="true" onClick={this.showPassword}></span>
      <span></span>
    </div>)
  }
}
