import React from 'react'
import _ from 'lodash'

import ReactComponent from './ReactComponent.react'

export default class LogOutputToggle extends ReactComponent {
  constructor(props) {
    super(props)

    this.state = {
      visible: false,
      entries: []
    }
  }

  componentDidMount() {
   this.props.radio.subscribe('toggleLog', this.toggleVisibility)
   this.props.radio.subscribe('addLogEntry', this.addLogEntry)
  }

  componentWillUnmount() {
    this.props.radio.unsubscribe('toggleLog', this.toggleVisibility)
    this.props.radio.unsubscribe('addLogEntry', this.addLogEntry)
  }

  addLogEntry(msg) {

  }

  toggleVisibility() {
    this.setState({
      visible: !this.state.visible
    })
  }

  renderLogTable() {
    let logRows = []

    for (let index in this.state.entries) {
      let current = this.state.entries[index]

      logRows.push(<tr key={index}>
          <td>{current}</td>
        </tr>)
    }

    return <table className="table table-condensed table-striped info-config">
        <tbody>{logRows}</tbody>
      </table>
  }

  render() {
    let logTable = this.state.visible && this.renderLogTable()

    return <div>
        <div className="checkbox">
          <label>
            <input type="checkbox" checked={this.state.visible} onChange={this.toggleVisibility} />show log
          </label>
        </div>

      {logTable}
      </div>
  }
}
