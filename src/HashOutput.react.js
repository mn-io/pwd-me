import React from 'react'
import _ from 'lodash'

import ReactComponent from './ReactComponent.react'

let scrollRight = () => {
  document.body.scrollLeft += 300
  document.documentElement.scrollLeft += 300
}

class HashRow extends ReactComponent {
  handleFocus(event) {
    let select = () => event.target.select()
    setTimeout(select, 0)
  }

  render() {
    let index = this.props.index
    let colors = this.props.config.colors
    let hashs = this.props.hashs

    let currentColor = colors[index % colors.length]
    let colorStyle = {
      background: currentColor
    }

    let fields = _.map(hashs, (hash, i) => {
      let widthStyle = {
        width: hash ? hash.length + 'rem' : '3rem'
      }
      return <div className='table-cell' key={i}>
        <input type='text' value={hashs[i]} readOnly={true} onFocus={this.handleFocus} style={widthStyle} />
      </div>
    })

    return <div className='table-row'>
      <div className='table-cell'>
        {index}
      </div>
      <div className='table-cell'>
        <div className='rounded' style={colorStyle}></div>
      </div>
      {fields}
    </div>
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
    let setStateAsync = () => this.setState({hashs})

    if(this.isFirstTime) {
      setTimeout(scrollRight, 40)
      this.isFirstTime = false
    }

    setTimeout(setStateAsync, 20)
  }

  render() {
    let hashs = this.state.hashs
    if(!hashs || hashs.length === 0) {
      return false
    }

    let rows = _.map(hashs, (hash, i) => {
      return <HashRow key={i} index={i+1} hashs={hashs[i]} config={this.props.config} />
    })

    return <div className='table'>{rows}</div>
  }
}
