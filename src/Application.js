import React from 'react'
import ReactDOM from 'react-dom'
import Airwaves from 'airwaves'

import UserInput from './UserInput'
import HashOutput from './HashOutput'
import HashBox from './HashBox'

import config from '../public/config/config.json'


let radio = new Airwaves.Channel()
let callback = (hashs) => {radio.broadcast('hashsCalculated', hashs)}
radio.subscribe('setIdentifier', box.setIdentifier)
radio.subscribe('setToken', box.setToken)
radio.subscribe('setTimeEpoche', box.setTimeEpoche)
let box = new HashBox(config, callback)

window.onload = () => {
  ReactDOM.render(<UserInput radio={radio} />, document.getElementById('userInput'))
  ReactDOM.render(<HashOutput config={config} radio={radio} />, document.getElementById('hashOutput'))
}
