import React from 'react'
import _ from 'lodash'

export default class ShowConfigToggle extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false
    }

    _.bindAll(this, 'toggleVisibility')
  }

  toggleVisibility() {
    this.setState({
      visible: !this.state.visible
    })
  }

  render() {
    let renderConfigTable = () => {
      let configRows = []

      let keys = Object.keys(this.props.config)
      for (let index in keys) {
        let currentKey = keys[index]
        let currentValue = this.props.config[currentKey]

        currentKey = currentKey.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()
        if('object' === typeof(currentValue)) {
          currentValue = JSON.stringify(currentValue)
        }
        if(currentValue.length > 30) {
          currentValue = (<input type="text" readOnly={true} value={currentValue} />)
        }

        configRows.push(<tr key={index}>
            <td>{currentKey}</td>
            <td>{currentValue}</td>
          </tr>)
      }

      return (<table className="table table-condensed table-striped info-config">
          <tbody>{configRows}</tbody>
        </table>)
    }

    let configTable = this.state.visible ? renderConfigTable() : (<div></div>)

    return (
      <div>
        <div className="checkbox">
          <label>
            <input type="checkbox" checked={this.state.visible} onChange={this.toggleVisibility} />Show current configuration
          </label>
        </div>

      {configTable}
      </div>)
  }
}
