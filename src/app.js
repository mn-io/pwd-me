import React from 'react'
import ReactDOM from 'react-dom'
import Airwaves from 'airwaves'

import UserInput from './UserInput'
import HashOutput from './HashOutput'

import HashBox from './HashBox'

import config from '../public/config/config.json'

let radio = new Airwaves.Channel()

let box = new HashBox(radio, config)

window.onload = () => {
  ReactDOM.render(<UserInput radio={radio} />, document.getElementById('userInput'))
  ReactDOM.render(<HashOutput config={config} radio={radio} />, document.getElementById('hashOutput'))
}
