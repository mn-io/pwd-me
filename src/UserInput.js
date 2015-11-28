import React from 'react'
import _ from 'lodash'
import Entities from 'html-entities'

export default class UserInput extends React.Component {
  constructor(props) {
    super(props)

    this.token = ""
    this.escapeHelper = new Entities.AllHtmlEntities()

    _.bindAll(this, 'showPassword', 'setToken', 'setIdentifier')
  }

  showPassword(event) {
    let target = event.target;
    target.innerHTML= this.escapeHelper.encode(this.token)

    setTimeout(() => {
      target.innerHTML = ""
    }, 1000) //TODO: extract constant, fade out animation
  }

  setToken(event) {
    this.token = event.target.value
    this.props.radio.broadcast('tokenChanged', this.token)
  }

  setIdentifier(event) {
    let id = event.target.value
    this.props.radio.broadcast('identifierChanged', id)
  }

  render() {
    return (<div>
      Token: <input type="password" onKeyUp={this.setToken} />
      Identifier: <input type="text" onKeyUp={this.setIdentifier} />
      <span className="glyphicon glyphicon-eye-open pointer" aria-hidden="true" onClick={this.showPassword}></span>
      <span></span>
    </div>)
  }
}
