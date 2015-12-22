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
  let box = new HashBox(config, callback)

  radio.subscribe('setIdentifier', box.setIdentifier)
  radio.subscribe('setToken', box.setToken)
  radio.subscribe('setTimeEpoche', box.setTimeEpoche)

  ReactDOM.render(<HashOutput config={config} radio={radio} />, document.getElementById('hashOutput'))
}

window.onload = () => {
  ReactDOM.render(<UserInput radio={radio} />, document.getElementById('userInput'))
  xhr.get(configUrl, xhrCallback)
}
