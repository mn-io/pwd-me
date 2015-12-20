import React from 'react'
import MobileDetect from 'mobile-detect'
import _ from 'lodash'
import Entities from 'html-entities'

import TimeEpocheHelper from './TimeEpocheHelper'

export default class UserInput extends React.Component {
  constructor(props) {
    super(props)

    this.token = ""
    this.identifier = ""

    let isMobile = !!(new MobileDetect(navigator.userAgent).mobile())

    this.state = {
      isInstantGeneration: !isMobile,
      tokenFieldType: 'password'
    }

    this.escapeHelper = new Entities.AllHtmlEntities()

    _.bindAll(this, 'showPassword', 'setToken', 'setIdentifier', 'toggleInstantGeneration', 'sendDataOnClick')
  }

  showPassword(event) {
    this.setState({
      tokenFieldType: 'text'
    })

    setTimeout(() => {
      this.setState({
        tokenFieldType: 'password'
      })
    }, 1000) //TODO: extract constant
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
      this.props.radio.broadcast('setToken', this.token)
    }, 400) //TODO: extract constant
  }

  setIdentifier(event) {
    this.identifier = event.target.value

    if(!this.state.isInstantGeneration) {
      return
    }

    this.props.radio.broadcast('setIdentifier', this.identifier)
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
    this.props.radio.broadcast('setIdentifier', this.identifier)
    this.props.radio.broadcast('setToken', this.token)
  }

  render() {
    return (
      <div className="col-sm-12">
        <form className="form-horizontal">
          <div className="col-sm-12">
            <div className="form-group">
              <div className="input-group">
                <input type={this.state.tokenFieldType} className="form-control" aria-label="Token (slow calculation)" onKeyUp={this.setToken} />
                <div className="input-group-btn">
                  <button type="button" className="btn btn-default" aria-label="Hint" onClick={this.showPassword}>
                    <span className="glyphicon glyphicon-eye-open"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12">
            <div className="form-group">
              <input type="text" className="form-control" placeholder="Identifier" onKeyUp={this.setIdentifier} />
            </div>
          </div>

          <div className="col-sm-12">
            <div className="checkbox">
              <label>
                <input type="checkbox" checked={this.state.isInstantGeneration} onChange={this.toggleInstantGeneration} />Instant
              </label>
            </div>
          </div>

          <div className="col-sm-12">
            <TimeEpocheHelper intervalInMin={3} radio={this.props.radio} />
          </div>
          <div className="row">
            <button type="button" className="btn btn-link" onClick={this.sendDataOnClick}>Generate</button>
          </div>
        </form>
      </div>)
  }
}
