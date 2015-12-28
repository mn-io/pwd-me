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
      tokenFieldType: 'password',
      isAutoDestroy: true,
      inputIdentifier: '',
      inputToken: ''
    }

    this.escapeHelper = new Entities.AllHtmlEntities()

    _.bindAll(this,
      'showToken',
      'setToken',
      'setIdentifier',
      'selectProfile',
      'toggleInstantGeneration',
      'sendData',
      'setAutoDestroy',
      'clearAutoDestroy',
      'toggleAutoDestroy'
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
    let token = event.target.value
    this.setState({
      hasSend: false,
      inputToken: token
    })

    if(this.timerToken) {
      clearTimeout(this.timerToken)
    }

    if(!this.state.isInstantGeneration) {
      return
    }

    this.timerToken = setTimeout(() => {
      this.props.radio.broadcast('setToken', Token)
    }, 400)
  }

  setIdentifier(event) {
    let identifier = event.target.value
    this.setState({
      hasSend: false,
      inputIdentifier: identifier
    })


    if(this.timerIdentifier) {
      clearTimeout(this.timerIdentifier)
    }

    if(!this.state.isInstantGeneration) {
      return
    }

    this.timerIdentifier = setTimeout(() => {
      this.props.radio.broadcast('setIdentifier', identifier)
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
      this.sendData()
    }
  }

  toggleAutoDestroy() {
    let isEnabled = !this.state.isAutoDestroy
    this.setState({
      isAutoDestroy: isEnabled
    })

    if(isEnabled) {
      this.setAutoDestroy()
    } else {
      this.clearAutoDestroy()
    }
  }

  setAutoDestroy() {
    this.autoDestroyTimeout = setTimeout(() => {
      location.reload()
    }, 10000)
  }

  clearAutoDestroy() {
    if(this.autoDestroyTimeout) {
      clearTimeout(this.autoDestroyTimeout)
    }
  }

  sendData(event) {
    if(this.state.isInstantGeneration) {
      return
    }

    this.setState({hasSend: true})

    if(this.profile) {
      this.props.radio.broadcast('setProfileByName', this.profile)
    }
    this.props.radio.broadcast('setIdentifier', this.state.inputIdentifier)
    this.props.radio.broadcast('setToken', this.state.inputToken)

    if(this.state.isAutoDestroy) {
      this.setAutoDestroy()
    }
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
        <form className="form-horizontal" onSubmit={this.sendData}>

            <div className="input-group with-spacer">
              <input type={this.state.tokenFieldType} className="form-control"
                aria-label="Token (slow calculation)" onKeyUp={this.setToken}
                tabIndex="1" autoFocus={true} />
              <div className="input-group-btn">
                <button type="button" className="btn btn-default" aria-label="Hint" onClick={this.showToken}>
                  <span className="glyphicon glyphicon-eye-open"></span>
                </button>
              </div>
            </div>

            <input type="text" className="form-control with-spacer" placeholder="Identifier"
              onKeyUp={this.setIdentifier} tabIndex="2" />

            <select className="form-control with-spacer" onChange={this.selectProfile} tabIndex="3">
              {renderProfiles()}
            </select>

          <ShowConfigToggle config={this.props.config} profiles={this.props.profiles} radio={this.props.radio} />

          <div className="checkbox">
            <label>
              <input type="checkbox" checked={this.state.isInstantGeneration} onChange={this.toggleInstantGeneration} />instant generate
            </label>
          </div>

          <div className="checkbox">
            <label>
              <input type="checkbox" checked={this.state.isAutoDestroy} onChange={this.toggleAutoDestroy} />reload page after 10 sec
            </label>
          </div>

          <TimeEpocheHelper intervalInMin={3} radio={this.props.radio} />

          <div className="pull-right">
            <button type="submit" className="btn btn-link btn-minimal" onClick={this.sendData}
              disabled={this.state.hasSend || this.state.isInstantGeneration} tabIndex="4">generate</button>
          </div>
        </form>
      </div>)
  }
}
