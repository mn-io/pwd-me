import React from 'react'
import ReactDOM from 'react-dom'
import Airwaves from 'airwaves'
import xhr from 'xhr'

import UserInput from './UserInput'
import HashOutput from './HashOutput'
import HashBox from './HashBox'

import builtinConfig from '../public/config.json'

let configUrl = 'config.json'
let radio = new Airwaves.Channel()

let xhrCallback = (err, resp) => {
  let config = builtinConfig
  if(!err) {
    console.log('Loading configuration from "' + configUrl + '": OK')
    config = resp.body
  } else {
    console.log('Loading configuration from "' + configUrl + '": FAILED, using builtin fallback, error was: "' +  err + '"')
  }

  let callback = (hashs) => {radio.broadcast('hashsCalculated', hashs)}
  let box = new HashBox(config.hashBox, callback)
  box.setProfilesConfig(config.profiles)

  radio.subscribe('setIdentifier', box.setIdentifier)
  radio.subscribe('setToken', box.setToken)
  radio.subscribe('setTimeEpoche', box.setTimeEpoche)
  radio.subscribe('setProfileByName', box.setProfileByName)

  ReactDOM.render(<UserInput profiles={config.profiles} radio={radio} />, document.getElementById('userInput'))
  ReactDOM.render(<HashOutput config={config.UI} radio={radio} />, document.getElementById('hashOutput'))
}

window.onload = () => {
  xhr.get(configUrl, xhrCallback)
}
