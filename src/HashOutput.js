import React from 'react'
import _ from 'lodash'

class HashRow extends React.Component {

  handleFocus(event) {
    let target = event.target;
    setTimeout(() => {
      target.select();
    }, 0);
  }

  render() {
    let index = this.props.index
    let colors = this.props.config.colors
    let currentColor = colors[index % colors.length]
    let colorStyle = {
      background: currentColor
    }

    return (<div>{index}
        <div className="rounded" style={colorStyle}></div>
        <input type="text" value={this.props.value} readOnly={true} onFocus={this.handleFocus} />
      </div>)
  }
}

export default class HashOutput extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      hashs : []
    }
  }

  componentDidMount() {
    this.props.radio.subscribe('hashsCalculated', (hashs) => this.fillFields(hashs))
  }

  componentWillUnmount() {
    this.props.radio.unubscribe('hashsCalculated')
  }

  fillFields(hashs) {
    let setStateAsync = () => {
      this.setState({
        hashs: hashs
      })
    }

    setTimeout(setStateAsync, 100) //TODO: extract constant
  }

  render() {
    let hashs = this.state.hashs
    if(!hashs) {
      return (<div></div>)
    }

    let fields = [];
    for (let i = 0; i < hashs.length; i++) {
      fields.push(<HashRow key={i} index={i+1} value={hashs[i]} config={this.props.config} />);
    }

    return (<div>{fields}</div>)
  }
}
