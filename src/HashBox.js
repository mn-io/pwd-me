
import _ from 'lodash'
import Sha1 from 'sha1'

export default class HashBox {
  constructor(radio, config) {
    this.radio = radio

    this.config = {
      rows: config.outputRows,
      salt: config.globalSalt
    }

    this.epocheCount = 0

    _.bindAll(this, 'inputChanged', 'timeEpocheChanged')

    radio.subscribe('inputChanged', this.inputChanged)
    radio.subscribe('timeEpocheChanged', this.timeEpocheChanged)
  }

  inputChanged(identifier, token) {
    let key = identifier +  token + this.epocheCount

    let hashs = []
    for (let i = 0; i < this.config.rows; i++) {
      hashs.push(Sha1(key + i))
    }

    this.radio.broadcast('hashsCalculated', hashs)
  }

  timeEpocheChanged(epocheCount) {
    this.epocheCount = epocheCount
  }
}
