import React from 'react'
import _ from 'lodash'
import Entities from 'html-entities'

import TimeEpocheHelper from './TimeEpocheHelper'
import ShowConfigToggle from './ShowConfigToggle'

export default class UserInput extends React.Component {
  constructor(props) {
    super(props)

    this.token = ""
    this.identifier = ""
    this.profile = ""

    this.state = {
      tokenFieldType: 'password'
    }

    this.escapeHelper = new Entities.AllHtmlEntities()

    _.bindAll(this,
      'showToken',
      'setToken',
      'setIdentifier',
      'selectProfile',
      'toggleInstantGeneration',
      'sendDataOnClick'
    )
  }

  showToken(event) {
    this.setState({
      tokenFieldType: 'text'
    })

    setTimeout(() => {
      this.setState({
        tokenFieldType: 'password'
      })
    }, 1000)
  }

  setToken(event) {
    this.setState({hasSend: false})
    if(this.timerToken) {
      clearTimeout(this.timerToken)
    }

    this.token = event.target.value

    if(!this.state.isInstantGeneration) {
      return
    }

    this.timerToken = setTimeout(() => {
      this.props.radio.broadcast('setToken', this.token)
    }, 400)
  }

  setIdentifier(event) {
    this.setState({hasSend: false})
    if(this.timerIdentifier) {
      clearTimeout(this.timerIdentifier)
    }

    this.identifier = event.target.value

    if(!this.state.isInstantGeneration) {
      return
    }

    this.timerIdentifier = setTimeout(() => {
      this.props.radio.broadcast('setIdentifier', this.identifier)
    }, 200)
  }

  selectProfile(event) {
    this.setState({hasSend: false})
    this.profile = event.target.value

    if(!this.state.isInstantGeneration) {
      return
    }

    this.props.radio.broadcast('setProfileByName', this.profile)
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

    this.setState({hasSend: true})

    if(this.profile) {
      this.props.radio.broadcast('setProfileByName', this.profile)
    }
    this.props.radio.broadcast('setIdentifier', this.identifier)
    this.props.radio.broadcast('setToken', this.token)
  }

  render() {
    let renderProfiles = () => {
      let keys = this.props.profiles ? Object.keys(this.props.profiles) : []
      keys.unshift('')
      return keys.map((key, i) => {
        return (<option key={i} value={key}>{key}</option>)
      })
    }

    return (
      <div>
        <h1 id="title">key derivator</h1>
        <form className="form-horizontal">

            <div className="input-group with-spacer">
              <input type={this.state.tokenFieldType} className="form-control"
                aria-label="Token (slow calculation)" onKeyUp={this.setToken} />
              <div className="input-group-btn">
                <button type="button" className="btn btn-default" aria-label="Hint" onClick={this.showToken}>
                  <span className="glyphicon glyphicon-eye-open"></span>
                </button>
              </div>
            </div>

            <input type="text" className="form-control with-spacer" placeholder="Identifier" onKeyUp={this.setIdentifier} />

            <select className="form-control with-spacer" onChange={this.selectProfile}>
              {renderProfiles()}
            </select>

          <ShowConfigToggle config={this.props.config} profiles={this.props.profiles} radio={this.props.radio} />

          <div className="checkbox">
            <label>
              <input type="checkbox" checked={this.state.isInstantGeneration} onChange={this.toggleInstantGeneration} />instant generate
            </label>
          </div>

          <TimeEpocheHelper intervalInMin={3} radio={this.props.radio} />

          <div className="pull-right">
            <button type="button" className="btn btn-link btn-minimal" onClick={this.sendDataOnClick}
              disabled={this.state.hasSend || this.state.isInstantGeneration}>generate</button>
          </div>
        </form>
      </div>)
  }
}
