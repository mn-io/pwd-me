import React from 'react'
import _ from 'lodash'

class HashRow extends React.Component {
  render() {
    return (<div>{this.props.index}<input type="text" /></div>)
  }
}

export default class HashOutput extends React.Component {

  constructor(props) {
    super(props)

    // _.bindAll(this, 'showPassword')
  }

  render() {
    let fields = [];
    for (let i = 0; i < this.props.rows; i++) {
      fields.push(<HashRow key={i} index={i+1}/>);
    }

    return (<div>
      {fields}
    </div>)
  }
}
