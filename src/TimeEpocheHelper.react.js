import React from 'react'
import _ from 'lodash'
import moment from 'moment'

import ReactComponent from './ReactComponent.react'

export default class TimeEpocheHelper extends ReactComponent {
  constructor(props) {
    super(props)

    this.oneMinuteInMilliseconds = 60 * 1000
    this.state = {
      intervalInMs: props.intervalInMin * this.oneMinuteInMilliseconds,
      visible: false
    }

    this.props.radio.broadcast('setTimeEpoche', 0)
  }

  componentDidMount() {
    this.tick()
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  tick(event) {
    clearTimeout(this.timeout)

    let now = Date.now()
    let count = Math.floor(now / this.state.intervalInMs)

    let beginInMs = count * this.state.intervalInMs
    let endInMs = beginInMs + this.state.intervalInMs

    let timeoutForUpdate = endInMs - now

    let intervalInMs = this.state.intervalInMs
    if(event && event.target.value > 0) {
      intervalInMs = event.target.value * this.oneMinuteInMilliseconds
    }

    this.setState({
      epocheCount: count,
      epocheBeginInMs: beginInMs,
      epocheEndInMs: endInMs,
      intervalInMs: intervalInMs
    })

    this.timeout = setTimeout(this.tick, timeoutForUpdate)
  }

  toggleVisibility() {
    let newVisisbility = !this.state.visible
    this.setState({
      visible: newVisisbility
    })

    if(!newVisisbility) {
      this.props.radio.broadcast('setTimeEpoche', 0)
    }
  }

  render() {
    let beginCurrentEpoche = moment(this.state.epocheBeginInMs).format('LTS')
    let beginNextEpoche = moment(this.state.epocheEndInMs).format('LTS')

    let intervalInMin = this.state.intervalInMs /  this.oneMinuteInMilliseconds

    if(this.state.visible) {
      this.props.radio.broadcast('setTimeEpoche', this.state.epocheCount)
    }


    let helper = !this.state.visible ? (<div></div>) : (<div className="form-inline">
          <div className="with-spacer">
            <small>Count of minute epoches from UNIX timestamp.</small>
          </div>
          <label className="with-spacer">Minutes:
            <input type="number" className="form-control input-epoche" value={intervalInMin} onChange={this.tick} min="1"/>
            </label>
          <div className="table info-epoche">
            <div className="table-row">
              <div className="table-cell">count is:</div>
              <div className="table-cell">{this.state.epocheCount}</div>
            </div>
            <div className="table-row">
              <div className="table-cell">start was:</div>
              <div className="table-cell">{beginCurrentEpoche}</div>
            </div>
            <div className="table-row">
              <div className="table-cell">end will be:</div>
              <div className="table-cell">{beginNextEpoche}</div>
            </div>
          </div>
        </div>)

    return (
      <div>
        <div className="checkbox">
          <label><input type="checkbox" checked={this.state.visible} onChange={this.toggleVisibility} />
            time epoche helper
          </label>
        </div>

        {helper}

      </div>)
  }
}