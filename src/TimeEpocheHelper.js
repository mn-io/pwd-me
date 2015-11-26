import React from 'react'
import _ from 'lodash'
import moment from 'moment'

export default class TimeEpocheHelper extends React.Component {

  constructor(props) {
    super(props)
    this.props = props

    this.intervalInMs= props.intervalInMin * 60 * 1000

    this.state = {
      epoches: 0,
    }

    _.bindAll(this, 'componentDidMount', 'componentWillUnmount', 'tick')
  }

  componentDidMount() {
    this.tick()
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  tick() {
    let count = Math.floor(Date.now() / this.intervalInMs)

    let beginInMs = count * this.intervalInMs
    let endInMs = beginInMs + this.intervalInMs

    let timeoutForUpdate = endInMs - beginInMs

    this.setState({
      epocheCount: count,
      epocheBeginInMs: beginInMs,
      epocheEndInMs: endInMs
    })

    this.timeout = setTimeout(this.tick, timeoutForUpdate)
    console.log("timeout: " + timeoutForUpdate)
    //TODO: check whether tick is called in correct moment
  }

  render() {
    let beginCurrentEpoche = moment(this.state.epocheBeginInMs).format('LTS')
    let beginNextEpoche = moment(this.state.epocheEndInMs).format('LTS')

    return (<div>
        Count of {this.props.intervalInMinutes} minute epoches in UNIX timestamp: {this.state.epocheCount},
        start was: {beginCurrentEpoche},
        end will be: {beginNextEpoche}
      </div>)
  }
}
