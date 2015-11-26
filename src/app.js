require('babel/polyfill')
import React from 'react'
import ReactDOM from 'react-dom'
import Airwaves from 'airwaves'

import UserInput from './UserInput'
import TimeEpocheHelper from './TimeEpocheHelper'
import HashOutput from './HashOutput'

import config from '../public/config/config.json'

let radio = new Airwaves.Channel

window.onload = () => {
  ReactDOM.render(<UserInput radio={radio} />, document.getElementById('userInput'))
  ReactDOM.render(<TimeEpocheHelper intervalInMin={3} />, document.getElementById('helperField'))
  ReactDOM.render(<HashOutput rows={config.outputRows} radio={radio} />, document.getElementById('hashOutput'))
}
