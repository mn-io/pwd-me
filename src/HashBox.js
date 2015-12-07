import _ from 'lodash'
import assert from 'assert'
import pbkdf2 from 'pbkdf2-sha256'

export default class HashBox {
  constructor(radio, config) {
    assert(radio)
    assert(config)

    this.radio = radio

    this.config = {
      rows: config.outputRows,
      columns: config.outputColumns,
      tokenSalt: config.tokenSalt,
      keySalt: config.keySalt,
      iterations: config.pbkdf2Iterations,
      chars: config.validCharacters
    }

    this.state = {
      epocheCount: 0
    }

    _.bindAll(this, 'identifierChanged', 'tokenChanged', 'timeEpocheChanged', 'createHashs', 'translateHash', 'createColumns')

    radio.subscribe('identifierChanged', this.identifierChanged)
    radio.subscribe('tokenChanged', this.tokenChanged)
    radio.subscribe('timeEpocheChanged', this.timeEpocheChanged)
  }

  identifierChanged(identifier) {
    if("" === identifier) {
      identifier = null
    }

    if(identifier === this.state.identifier) {
      return
    }

    if(null === identifier) {
      this.state.identifier = null
      this.radio.broadcast('clearHashs')
      return
    }

    this.state.identifier = identifier
    this.createHashs()
  }

  tokenChanged(token) {
    if("" === token) {
      token = null
    }

    if(token === this.state.token) {
      return
    }

    if(null === token) {
      this.state.tokenHash = hash
      this.state.token = null
      this.radio.broadcast('clearHashs')
      return
    }

    let hash = pbkdf2(token, this.config.tokenSalt , this.config.iterations , 64)
    this.state.tokenHash = hash
    this.state.token = token
    this.createHashs()
  }

  timeEpocheChanged(epocheCount) {
    this.state.epocheCount = epocheCount
    this.createHashs()
  }

  createHashs() {
    if(!this.state.identifier || !this.state.tokenHash) {
      return
    }

    let key = "id=" + this.state.identifier + "&token=" + this.state.tokenHash + "&epoche=" + this.state.epocheCount

    let hashs = []
    for (let i = 0; i < this.config.rows; i++) {
      let currentHash = pbkdf2(key, i + this.config.keySalt, 1, 64)
      let readablePwd = this.translateHash(currentHash)
      let pwds = this.createColumns(readablePwd)
      hashs.push(pwds)
    }

    this.radio.broadcast('hashsCalculated', hashs)
  }

  translateHash(hash) {
    let result = []
    let position = 0

    for (let i = 0; i < hash.length-1; i=i+2) {
      position = position + hash[i]
      let validPosition = (position + hash[i+1]) % this.config.chars.length
      result.push(this.config.chars[validPosition])
    }

    return result.join("")
  }

  createColumns(pwd) {
    let columns = []

    for (let i = 0; i < this.config.columns.length; i++) {
      let end = this.config.columns[i]
      let value = pwd
      if(end > 0) {
        value = pwd.substring(0, end)
      }
      columns.push(value)
    }

    return columns
  }
}
