require('babel/polyfill')
import React from 'react'
import ReactDOM from 'react-dom'
import UserInput from './UserInput'

window.onload = function() {
  ReactDOM.render(<UserInput />, document.getElementById('entry-point'))
}
