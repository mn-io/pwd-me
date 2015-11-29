import React from 'react'
import _ from 'lodash'
import moment from 'moment'

export default class TimeEpocheHelper extends React.Component {
  constructor(props) {
    super(props)

    this.oneMinuteInMilliseconds = 60 * 1000
    this.state = {
      intervalInMs: props.intervalInMin * this.oneMinuteInMilliseconds,
      visible: false
    }

    this.props.radio.broadcast('timeEpocheChanged', 0)

    _.bindAll(this, 'componentDidMount', 'componentWillUnmount', 'tick', 'toggleVisibility')
  }

  componentDidMount() {
    this.tick()
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  tick(event) {
    clearTimeout(this.timeout);

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
      this.props.radio.broadcast('timeEpocheChanged', 0)
    }
  }

  render() {
    let beginCurrentEpoche = moment(this.state.epocheBeginInMs).format('LTS')
    let beginNextEpoche = moment(this.state.epocheEndInMs).format('LTS')

    let intervalInMin = this.state.intervalInMs /  this.oneMinuteInMilliseconds

    if(this.state.visible) {
      this.props.radio.broadcast('timeEpocheChanged', this.state.epocheCount)
    }

    return (<div>
        <label><input type="checkbox" checked={this.state.visible} onChange={this.toggleVisibility} className="checkbox" />Time Epoche Helper</label>
        <div className={this.state.visible ? '' : 'hidden'}>
          Count of <input type="number" value={intervalInMin} onChange={this.tick} min="1" /> minute epoches in UNIX timestamp: {this.state.epocheCount},
          start was: {beginCurrentEpoche},
          end will be: {beginNextEpoche}
        </div>
      </div>)
  }
}
