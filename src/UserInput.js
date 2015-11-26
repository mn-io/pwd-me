import React from 'react'
import _ from 'lodash'

export default class UserInput extends React.Component {

  constructor(props) {
    super(props)

    _.bindAll(this, 'showPassword', 'updateHashs')
  }

  showPassword() {

  }

  updateHashs(event) {
    console.log(event.target.value)
  }

  render() {
    return (<div>
      Identifier: <input type="text" onKeyUp={this.updateHashs} /> Token: <input type="password" onKeyUp={this.updateHashs} />
      <span className="glyphicon glyphicon-eye-open pointer" aria-hidden="true" onClick={this.showPassword}></span>
      <span></span>
    </div>)
  }
}
