import React from 'react'
import ReactDOM from 'react-dom'
import Airwaves from 'airwaves'
import xhr from 'xhr'

import UserInput from './UserInput.react'
import HashOutput from './HashOutput.react'
import {Logger} from './LogOutputToggle.react'
import HashBox from './HashBox'

import builtinConfig from '../public/config.json'

let configUrl = 'config.json'
let radio = new Airwaves.Channel()

Logger.interceptConsole(radio)

window.onload = () => {
  let loadConfig = (err, resp, defaultConfig) => {
    if(err || !resp.body) {
      console.warn('Loading configuration from "' + configUrl + '": FAILED, using builtin fallback, error occured on loading: "' +  err + '"')
      return defaultConfig
    }

    try {
      let config = JSON.parse(resp.body)
      console.log('Loading configuration from "' + configUrl + '": OK')
      return config
    } catch (e) {
      console.warn('Loading configuration from "' + configUrl + '": FAILED, using builtin fallback, error occured on parsing: "' +  e + '"')
      return defaultConfig
    }
  }

  let xhrCallback = (err, resp) => {
    let config = loadConfig(err, resp, builtinConfig)

    let callback = (hashs) => {radio.broadcast('hashsCalculated', hashs)}
    let box = new HashBox(config.hashBox, callback)
    box.setProfilesConfig(config.profiles)

    radio.subscribe('setIdentifier', box.setIdentifier)
    radio.subscribe('setToken', box.setToken)
    radio.subscribe('setTimeEpoche', box.setTimeEpoche)
    radio.subscribe('setProfileByName', box.setProfileByName)

    ReactDOM.render(<UserInput profiles={config.profiles} config={config.hashBox} radio={radio} />, document.getElementById('userInput'))
    ReactDOM.render(<HashOutput config={config.UI} radio={radio} />, document.getElementById('hashOutput'))
  }

  xhr.get(configUrl, xhrCallback)
}
