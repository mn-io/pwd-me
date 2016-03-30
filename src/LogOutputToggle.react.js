import React from 'react'
import _ from 'lodash'

import ReactComponent from './ReactComponent.react'

export default class LogOutputToggle extends ReactComponent {
  constructor(props) {
    super(props)

    let visible = false
    this.state = {visible}
  }

  componentDidMount() {
   this.props.radio.subscribe('addLogEntry', this.addLogEntry)
  }

  componentWillUnmount() {
    this.props.radio.unsubscribe('addLogEntry', this.addLogEntry)
  }

  addLogEntry(msg, channel) {
    if(this.state.visible) {
      this.forceUpdate()
    }
  }

  toggleVisibility() {
    this.setState({
      visible: !this.state.visible
    })
  }

  renderLogTable() {
    let logs = Logger.getInstance().getLogs()
    let logRows = _.map(logs, (log, i) => {
      let colorLevel
      switch (log.channel) {
        case 'warn':
            colorLevel = 'color-warn'
          break
        case 'error':
          colorLevel = 'color-error'
          break
        default:
          colorLevel = 'color-log'
      }

      let msg = log.msg
      if(!_.isString(msg)) {
        msg = JSON.stringify(msg)
      }
      return <tr key={i}><td className={colorLevel}>{msg}</td></tr>
    })

    return <table className='table table-condensed table-striped info-config'>
        <tbody>{logRows}</tbody>
      </table>
  }

  render() {
    let logTable = this.state.visible && this.renderLogTable()

    return <div>
        <div className='checkbox'>
          <label>
            <input type='checkbox'
              checked={this.state.visible}
              onChange={this.toggleVisibility} />
            show log
          </label>
        </div>

      {logTable}
      </div>
  }
}

let loggerInstance
export class Logger {

  constructor() {
    this.logs = []
  }

  static getInstance() {
    if (!loggerInstance) {
      loggerInstance = new Logger()
    }
    return loggerInstance
  }

  log(channel, radio, console) {
    return (...msg) => {
      if(msg && msg.length == 1) {
        msg = msg[0]
      }

      console[channel](msg)
      this.logs.push({msg, channel})
      radio.broadcast('addLogEntry', msg, channel)
    }
  }

  getLogs() {
    return this.logs
  }

  static interceptConsole(radio) {
    let l = Logger.getInstance()

    let winConsole = window.console
    window.console = {
      log: l.log('log', radio, winConsole),
      info: l.log('info', radio, winConsole),
      warn: l.log('warn', radio, winConsole),
      error: l.log('error', radio, winConsole)
    }
  }
}
