require('babel/polyfill')
import React from 'react'
import ReactDOM from 'react-dom'
import UserInput from './UserInput'
import TimeEpocheHelper from './TimeEpocheHelper'
import HashOutput from './HashOutput'

window.onload = () => {
  ReactDOM.render(<UserInput />, document.getElementById('userInput'))
  ReactDOM.render(<TimeEpocheHelper intervalInMin={3} />, document.getElementById('helperField'))
}
