import _ from 'lodash'
import React from 'react'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}

    let proto = Object.getPrototypeOf(this)
    let properties = Object.getOwnPropertyNames(proto)
    _.bindAll(this, properties)
  }
}
