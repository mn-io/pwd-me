import React from 'react'
import _ from 'lodash'

export default class UserInput extends React.Component {

  constructor(props) {
    super(props)

    _.bindAll(this, 'showPassword')
  }

  showPassword() {

  }

  render() {
    return (<div>
      Identifier: <input type="text" /> Token: <input type="password" />
      <span className="glyphicon glyphicon-eye-open pointer" aria-hidden="true" onClick={this.showPassword}></span>
      <span></span>
    </div>)
  }
}
