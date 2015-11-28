
import _ from 'lodash'
import pbkdf2 from 'pbkdf2-sha256'

export default class HashBox {
  constructor(radio, config) {
    this.radio = radio

    this.config = {
      rows: config.outputRows,
      salt: config.salt,
      iterations: config.pbkdf2Iterations
    }

    this.state = {
      epocheCount: 0,
      identifier: "",
      tokenHash: ""
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
    let hash = pbkdf2(token, this.config.salt , this.config.iterations , 64) //TOOD: extract config
    // console.log(hash.toString('hex'))
    this.state.tokenHash = hash
    this.createHashs()
  }

  timeEpocheChanged(epocheCount) {
    this.state.epocheCount = epocheCount
    this.createHashs()
  }

  createHashs() {
    let key = this.state.identifier +  this.state.tokenHash + this.state.epocheCount

    let hashs = []
    for (let i = 0; i < this.config.rows; i++) {
      let currentHash = pbkdf2(key, i + "sall2", 1, 64) //TOOD: extract config
      //TODO: continue here with translation table
      hashs.push([currentHash, currentHash])
    }

    this.radio.broadcast('hashsCalculated', hashs)
  }
}
