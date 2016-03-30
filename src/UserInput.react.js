import React from 'react'
import _ from 'lodash'
import Entities from 'html-entities'

import ReactComponent from './ReactComponent.react'
import TimeEpocheHelper from './TimeEpocheHelper.react'
import ConfigToggle from './ConfigToggle.react'
import LogOutputToggle from './LogOutputToggle.react'

export default class UserInput extends ReactComponent {
  constructor(props) {
    super(props)

    this.state = {
      tokenFieldType: 'password',
      isAutoDestroy: true,
      inputIdentifier: '',
      inputToken: '',
      inputProfile: Object.keys(this.props.profiles)[0]
    }

    this.escapeHelper = new Entities.AllHtmlEntities()
  }

  componentDidMount() {
    this.props.radio.subscribe('hashsCalculated', this.outputGenerated)
  }

  componentWillUnmount() {
    this.props.radio.unubscribe('hashsCalculated', this.outputGenerated)
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
      inputToken: token
    })

    this.clearAutoDestroy()
    if(this.timerToken) {
      clearTimeout(this.timerToken)
    }
  }

  setIdentifier(event) {
    let identifier = event.target.value
    this.setState({
      inputIdentifier: identifier
    })

    this.clearAutoDestroy()
    if(this.timerIdentifier) {
      clearTimeout(this.timerIdentifier)
    }
  }

  selectProfile(event) {
    let profile = event.target.value

    this.setState({
      inputProfile: profile
    })

    this.clearAutoDestroy()
  }

  toggleAutoDestroy() {
    let isEnabled = !this.state.isAutoDestroy
    this.setState({
      isAutoDestroy: isEnabled
    })

    if(!isEnabled) {
      this.clearAutoDestroy()
    }
  }

  setAutoDestroy() {
    this.clearAutoDestroy()
    this.autoDestroyTimeout = setTimeout(() => {
      location.reload()
    }, 45000)
  }

  clearAutoDestroy() {
    if(this.autoDestroyTimeout) {
      clearTimeout(this.autoDestroyTimeout)
    }
  }

  sendData(event) {
    if(event) {
      event.preventDefault()
    }

    this.props.radio.broadcast('setProfileByName', this.state.inputProfile)
    this.props.radio.broadcast('setIdentifier', this.state.inputIdentifier)
    this.props.radio.broadcast('setToken', this.state.inputToken)

    this.setState({})
  }

  outputGenerated(hashs) {
    if(!hashs) {
      this.clearAutoDestroy()
      return
    }

    let isEnabled = this.state.isAutoDestroy
    if(isEnabled) {
      this.setAutoDestroy()
    } else {
      this.clearAutoDestroy()
    }
  }

  renderProfiles() {
    return _.map(this.props.profiles, (profile, key) => {
      return <option key={key} value={key}>{key}</option>
    })
  }

  render() {
    return <div>
      <h1 id='title'>key derivator</h1>
      <form className='form-horizontal' onSubmit={this.sendData}>

          <div className='input-group with-spacer'>
            <input type={this.state.tokenFieldType}
              className='form-control'
              aria-label='Token (slow calculation)'
              onKeyUp={this.setToken}
              tabIndex='1'
              autoFocus={true} />
            <div className='input-group-btn'>
              <button type='button'
                className='btn btn-default'
                aria-label='Hint'
                onClick={this.showToken}>
                <span className='glyphicon glyphicon-eye-open'></span>
              </button>
            </div>
          </div>

          <input type='text'
            className='form-control with-spacer'
            placeholder='Identifier'
            onKeyUp={this.setIdentifier}
            tabIndex='2' />

          <select className='form-control with-spacer'
            onChange={this.selectProfile}
            tabIndex='3'>
            {this.renderProfiles()}
          </select>

        <ConfigToggle config={this.props.config}
          profiles={this.props.profiles}
          radio={this.props.radio} />

        <LogOutputToggle radio={this.props.radio} />

        <div className='checkbox'>
          <label>
            <input type='checkbox'
              checked={this.state.isAutoDestroy}
              onChange={this.toggleAutoDestroy} />
          reload page after 45 sec
          </label>
        </div>

        <TimeEpocheHelper intervalInMin={3} radio={this.props.radio} />

        <div className='pull-right'>
          <button type='submit'
            className='btn btn-link btn-minimal'
            onClick={this.sendData}
            tabIndex='4'>generate</button>
        </div>
      </form>
    </div>
  }
}
