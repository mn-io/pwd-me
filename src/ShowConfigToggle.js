import React from 'react'
import _ from 'lodash'

import HashBox from './HashBox'

export default class ShowConfigToggle extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false,
      config: this.props.config
    }

    _.bindAll(this, 'toggleVisibility', 'setProfile')
  }

  componentDidMount() {
   this.props.radio.subscribe('setProfileByName', this.setProfile)
  }

  componentWillUnmount() {
    this.props.radio.unsubscribe('setProfileByName', this.setProfile)
  }

  setProfile(name) {
    let profile = this.props.profiles[name]
    let config = this.props.config

    if(profile) {
      config = HashBox.createConfig(config, profile)
    }

    this.setState({config: config})
  }

  toggleVisibility() {
    this.setState({
      visible: !this.state.visible
    })
  }

  render() {
    let renderConfigTable = () => {
      let configRows = []

      let keys = Object.keys(this.state.config)
      for (let index in keys) {
        let currentKey = keys[index]
        let currentValue = this.state.config[currentKey]

        currentKey = currentKey.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()
        if('object' === typeof(currentValue)) {
          currentValue = currentValue.toString()
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
