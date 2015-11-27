import React from 'react'
import _ from 'lodash'

class HashRow extends React.Component {
  render() {
    return (<div>{this.props.index}<input type="text" value={this.props.value} readOnly={true} /></div>)
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
    this.props.radio.subscribe('hashsCalculated', (hashs) => this.fillFields(hashs))
  }

  componentWillUnmount() {
    this.props.radio.unubscribe('hashsCalculated')
  }

  fillFields(hashs) {
    this.setState({
      hashs: hashs
    })
  }

  render() {
    let hashs = this.state.hashs
    if(!hashs) {
      return (<div></div>)
    }

    let fields = [];
    for (let i = 0; i < hashs.length; i++) {
      fields.push(<HashRow key={i} index={i+1} value={hashs[i]}/>);
    }

    return (<div>
      {fields}
    </div>)
  }
}
