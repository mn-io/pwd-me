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
    let hashs = this.props.hashs

    let currentColor = colors[index % colors.length]
    let colorStyle = {
      background: currentColor
    }

    let fields = []
    for (let i = 0; i < hashs.length; i++) {
      let widthStyle = {
        width: hashs[i].length + "rem"
      }
      fields.push(<input key={i} type="text" value={hashs[i]} readOnly={true} onFocus={this.handleFocus} style={widthStyle} />);
    }

    return (<div>{index}
        <div className="rounded" style={colorStyle}></div>
        {fields}
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
    this.props.radio.subscribe('clearHashs', () => this.fillFields([]))
  }

  componentWillUnmount() {
    this.props.radio.unubscribe('hashsCalculated')
    this.props.radio.unsubscribe('clearHashs')
  }

  fillFields(hashs) {
    let setStateAsync = () => {
      this.setState({
        hashs: hashs
      })
    }

    setTimeout(setStateAsync, 20) //TODO: extract constant
  }

  render() {
    let hashs = this.state.hashs
    if(!hashs) {
      return (<div></div>)
    }

    let rows = [];
    for (let i = 0; i < hashs.length; i++) {
      rows.push(<HashRow key={i} index={i+1} hashs={hashs[i]} config={this.props.config} />);
    }

    return (<div>{rows}</div>)
  }
}
