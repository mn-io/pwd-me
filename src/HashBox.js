
import _ from 'lodash'
import Sha1 from 'sha1'

export default class HashBox {
  constructor(radio, config) {
    this.radio = radio

    this.config = {
      rows: config.outputRows,
      salt: config.globalSalt
    }

    this.state = {
      epocheCount: 0,
      identifier: "",
      token: ""
    }

    _.bindAll(this, 'identifierChanged', 'tokenChanged', 'timeEpocheChanged', 'createHashs')

    radio.subscribe('identifierChanged', this.identifierChanged)
    radio.subscribe('tokenChanged', this.tokenChanged)
    radio.subscribe('timeEpocheChanged', this.timeEpocheChanged)
  }

  identifierChanged(identifier) {
    this.state.identifier = identifier
    this.createHashs()
  }

  tokenChanged(token) {
    this.state.token = token
    this.createHashs()
  }

  timeEpocheChanged(epocheCount) {
    this.state.epocheCount = epocheCount
    this.createHashs()
  }

  createHashs() {
    let key = this.config.globalSalt + this.state.identifier +  this.state.token + this.state.epocheCount

    let hashs = []
    for (let i = 0; i < this.config.rows; i++) {
      let currentHash = Sha1(key + i)
      hashs.push([currentHash, currentHash])
    }

    this.radio.broadcast('hashsCalculated', hashs)
  }
}
