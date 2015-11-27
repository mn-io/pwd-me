import React from 'react'
import _ from 'lodash'
import Entities from 'html-entities'

export default class UserInput extends React.Component {
  constructor(props) {
    super(props)

    this.identifierFieldName = "identifierField"
    this.tokenFieldName = "tokenField"

    this.inputs = {}
    this.inputs[this.identifierFieldName] = ""
    this.inputs[this.tokenFieldName] = ""

    this.escapeHelper = new Entities.AllHtmlEntities()

    _.bindAll(this, 'showPassword', 'updateHashs')
  }

  showPassword(event) {
    let target = event.target;
    let token = this.inputs[this.tokenFieldName]
    target.innerHTML= this.escapeHelper.encode(token)

    setTimeout(() => {
      target.innerHTML = ""
    }, 1000) //TODO: extract constant, fade out animation
  }

  updateHashs(event) {
    this.inputs[event.target.id] = event.target.value

    this.props.radio.broadcast(
        'inputChanged',
        this.inputs[this.identifierFieldName],
        this.inputs[this.tokenFieldName]
      )
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
