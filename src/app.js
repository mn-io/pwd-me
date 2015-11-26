require('babel/polyfill')
import React from 'react'
import ReactDOM from 'react-dom'
import UserInput from './UserInput'
import HelperField from './HelperFields'

window.onload = function() {
  ReactDOM.render(<UserInput />, document.getElementById('userInput'))
  ReactDOM.render(<HelperField start={Date.now()} intervalInMinutes={3}/>, document.getElementById('helperField'))
}
