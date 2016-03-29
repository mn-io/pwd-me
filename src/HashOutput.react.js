import React from 'react'
import _ from 'lodash'

import ReactComponent from './ReactComponent.react'

class HashRow extends ReactComponent {
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
        width: hashs[i] ? hashs[i].length + "rem" : "3rem"
      }
      fields.push(<div className="table-cell" key={i}>
        <input type="text" value={hashs[i]} readOnly={true} onFocus={this.handleFocus} style={widthStyle} />
      </div>);
    }

    return (<div className="table-row">
      <div className="table-cell">
        {index}
      </div>
      <div className="table-cell">
        <div className="rounded" style={colorStyle}></div>
      </div>
      {fields}
    </div>)
  }
}

export default class HashOutput extends ReactComponent {
  constructor(props) {
    super(props)

    this.isFirstTime = true

    this.state = {
      hashs : []
    }
  }

  componentDidMount() {
    this.props.radio.subscribe('hashsCalculated', this.fillFields)
  }

  componentWillUnmount() {
    this.props.radio.unubscribe('hashsCalculated', this.fillFields)
  }

  fillFields(hashs) {
    let setStateAsync = () => {
      this.setState({
        hashs: hashs
      })
    }

    if(this.isFirstTime) {
      let scrollRight = () => {
        document.body.scrollLeft += 300
        document.documentElement.scrollLeft += 300
      }

      setTimeout(scrollRight, 40)
      this.isFirstTime = false
    }

    setTimeout(setStateAsync, 20)
  }

  render() {
    let hashs = this.state.hashs
    if(!hashs || hashs.length === 0) {
      return (<div></div>)
    }

    let rows = [];
    for (let i = 0; i < hashs.length; i++) {
      rows.push(<HashRow key={i} index={i+1} hashs={hashs[i]} config={this.props.config} />);
    }

    return (<div className="table">{rows}</div>)
  }
}
