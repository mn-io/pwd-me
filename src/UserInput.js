import React from 'react'
import Button from 'react-bootstrap/lib/Button'
import _ from 'lodash'
import Entities from 'html-entities'

export default class UserInput extends React.Component {
  constructor(props) {
    super(props)

    this.token = ""
    this.identifier = ""

    this.state = {
      isInstantGeneration: false
    }

    this.escapeHelper = new Entities.AllHtmlEntities()

    _.bindAll(this, 'showPassword', 'setToken', 'setIdentifier', 'toggleInstantGeneration', 'sendDataOnClick')
  }

  showPassword(event) {
    let target = event.target;
    target.innerHTML= this.escapeHelper.encode(this.token)

    setTimeout(() => {
      target.innerHTML = ""
    }, 1000) //TODO: extract constant, fade out animation
  }

  setToken(event) {
    if(this.timer) {
      clearTimeout(this.timer)
    }

    this.token = event.target.value

    if(!this.state.isInstantGeneration) {
      return
    }

    this.timer = setTimeout(() => {
      this.props.radio.broadcast('tokenChanged', this.token)
    }, 400) //TODO: extract constant
  }

  setIdentifier(event) {
    this.identifier = event.target.value

    if(!this.state.isInstantGeneration) {
      return
    }

    this.props.radio.broadcast('identifierChanged', this.identifier)
  }

  toggleInstantGeneration() {
    let isEnabled = !this.state.isInstantGeneration
    this.setState({
      isInstantGeneration: isEnabled
    })

    if(isEnabled) {
      this.sendDataOnClick()
    }
  }

  sendDataOnClick() {
    if(this.state.isInstantGeneration) {
      return
    }
    this.props.radio.broadcast('identifierChanged', this.identifier)
    this.props.radio.broadcast('tokenChanged', this.token)
  }

  render() {
    return (<div>
      Token (slow): <input type="password" onKeyUp={this.setToken} />
      <span className="glyphicon glyphicon-eye-open pointer" aria-hidden="true" onClick={this.showPassword}></span><br />
      Identifier: <input type="text" onKeyUp={this.setIdentifier} />
      <input type="checkbox" checked={this.state.isInstantGeneration} onChange={this.toggleInstantGeneration} />instant
      <Button onClick={this.sendDataOnClick}>Generate</Button>
    </div>)
  }
}
