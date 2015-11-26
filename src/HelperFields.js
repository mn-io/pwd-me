import React from 'react'
import _ from 'lodash'
import moment from 'moment'

export default class HelperField extends React.Component {

  constructor(props) {
    super(props)
    this.props = props

    this.intervalInMilliSeconds = props.intervalInMinutes * 60 * 1000


    this.state = {
      elapsed: 0,

    }

    _.bindAll(this, 'componentDidMount', 'componentWillUnmount', 'tick')
  }

  componentDidMount() {
    this.timer = setInterval(this.tick, this.intervalInMilliSeconds);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick() {
    this.setState({
      elapsed: Date.now() - this.props.start
    });
  }

  render() {
    let epoches = Math.floor(Date.now() / this.intervalInMilliSeconds)
    let beginEpocheInMilliSeconds = epoches * this.intervalInMilliSeconds
    let beginCurrentEpoche = moment(beginEpocheInMilliSeconds).format('LTS')
    let beginNextEpoche = moment(beginEpocheInMilliSeconds + this.intervalInMilliSeconds).format('LTS')
    return (<div>Count of {this.props.intervalInMinutes} minute epoches in UNIX timestamp: {epoches}, start was: {beginCurrentEpoche}, end will be: {beginNextEpoche}</div>)
  }
}
