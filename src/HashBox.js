
import _ from 'lodash'

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
    //radio.broadcast('hashsCalculated', identifier+identifier, token+token)
    console.log(identifier + "-" + token)

    let hashs = []
    for (let i = 0; i < this.config.rows; i++) {
      hashs.push(i)
    }

    this.radio.broadcast('hashsCalculated', hashs)
  }

  timeEpocheChanged(epocheCount) {
    this.epocheCount = epocheCount
  }
}
