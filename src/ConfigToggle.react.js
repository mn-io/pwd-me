import React from 'react'
import _ from 'lodash'

import ReactComponent from './ReactComponent.react'
import HashBox from './HashBox'

export default class ShowConfigToggle extends ReactComponent {
  constructor(props) {
    super(props)

    this.state = {
      visible: false,
      config: this.props.config
    }
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

  renderConfigTable() {
    let configRows = _.map(this.state.config, (value, key) => {
      let readableKey = key.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()
      if('object' === typeof(value)) {
        value = value.toString()
      }
      if(value.length > 30) {
        value = (<input type='text' readOnly={true} value={value} />)
      }

    return <tr key={key}>
        <td>{readableKey}</td>
        <td>{value}</td>
      </tr>
    })

    return <table className='table table-condensed table-striped info-config'>
        <tbody>{configRows}</tbody>
      </table>
  }

  render() {
    let configTable = this.state.visible && this.renderConfigTable()

    return <div>
        <div className='checkbox'>
          <label>
            <input type='checkbox'
              checked={this.state.visible}
              onChange={this.toggleVisibility} />
            show current configuration
          </label>
        </div>

      {configTable}
      </div>
  }
}
