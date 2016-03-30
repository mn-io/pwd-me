import React from 'react'
import _ from 'lodash'
import xhr from 'xhr'

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

  createOTM(event) {
    let xhrCallback = (err, resp) => {
      console.log(`Hash stored at ${this.props.otm.uri}${resp.body}`)
    }

    let form = new FormData()
    form.append('accessToken', this.props.otm.accessToken)
    form.append('payload', this.props.hashs.join('\n\n'))

    xhr.post(this.props.otm.uri, {body: form}, xhrCallback)
  }

  render() {
    let currentColor = this.props.colors[this.props.index % this.props.colors.length]
    let colorStyle = {
      background: currentColor
    }

    let fields = _.map(this.props.hashs, (hash, i) => {
      let widthStyle = {
        width: hash ? hash.length + 'rem' : '3rem'
      }
      return <div className='table-cell' key={i}>
        <input type='text'
          value={hash}
          readOnly={true}
          onFocus={this.handleFocus}
          style={widthStyle} />
      </div>
    })

    return <div className='table-row'>
      <div className='table-cell'>
        {this.props.index}
      </div>
      <div className='table-cell'>
        <div className='rounded'
          style={colorStyle}
          onClick={this.createOTM}>
        </div>
      </div>
      {fields}
    </div>
  }
}

export default class HashOutput extends ReactComponent {
  constructor(props) {
    super(props)

    this.isFirstTime = true

    this.state = {hashs : []}
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
      return <HashRow key={i}
        index={i+1}
        hashs={hashs[i]}
        colors={this.props.colors}
        otm={this.props.otm} />
    })

    return <div className='table'>{rows}</div>
  }
}
