import React from 'react'
import _ from 'lodash'

class HashRow extends React.Component {
  render() {
    return (<div>{this.props.index}<input type="text" value={this.props.value} /></div>)
  }
}

export default class HashOutput extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      id: "",
      token: ""
    }
  }

  componentDidMount() {
    this.props.radio.subscribe('hashsCalculated', (id, token) => this.fillFields(id, token))
  }

  componentWillUnmount() {
    this.props.radio.unubscribe('hashsCalculated')
  }

  fillFields(id, token) {
    this.setState({
      id: id,
      token: token
    })
  }

  render() {
    let fields = [];
    for (let i = 0; i < this.props.rows; i++) {
      fields.push(<HashRow key={i} index={i+1} value={this.state.token}/>);
    }

    return (<div>
      {fields}
    </div>)
  }
}
