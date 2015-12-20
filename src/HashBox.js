import _ from 'lodash'
import assert from 'assert'
import pbkdf2 from 'pbkdf2-sha256'

export default class HashBox {
  constructor(config, callback) {
    assert(config)

    this.config = {
      rows: config.outputRows,
      columns: config.outputColumns,
      tokenSalt: config.tokenSalt,
      keySalt: config.keySalt,
      tokenIterations: config.tokenHashingIterations,
      rowHashIterations: config.rowHashIterations,
      hashLength: config.hashResultLengthInBytes,
      chars: config.validCharacters
    }

    this.state = {
      epocheCount: 0
    }

    this.callback = callback

    _.bindAll(this,
      'setIdentifier',
      'setToken',
      'timeEpocheChanged',
      'createHashs',
      'translateHash',
      'createColumns',
      'invokeCallbackWithReturn'
    )
  }

  setIdentifier(identifier) {
    if("" === identifier) {
      identifier = null
    }

    if(identifier === this.state.identifier) {
      return
    }

    if(null === identifier) {
      this.state.identifier = null
      return this.invokeCallbackWithReturn()
    }

    this.state.identifier = identifier
    return this.createHashs()
  }

  setToken(token) {
    if("" === token) {
      token = null
    }

    if(token === this.state.token) {
      return
    }

    if(null === token) {
      this.state.tokenHash = hash
      this.state.token = null
      return this.invokeCallbackWithReturn()
    }

    let hash = pbkdf2(token, this.config.tokenSalt , this.config.tokenIterations, this.config.hashLength)
    this.state.tokenHash = hash
    this.state.token = token
    return this.createHashs()
  }

  timeEpocheChanged(epocheCount) {
    this.state.epocheCount = epocheCount
    return this.createHashs()
  }

  createHashs() {
    if(!this.state.identifier || !this.state.tokenHash) {
      return
    }

    let key = "id=" + this.state.identifier + "&token=" + this.state.tokenHash + "&epoche=" + this.state.epocheCount

    let hashs = []
    for (let i = 0; i < this.config.rows; i++) {
      let currentHash = pbkdf2(key, i + this.config.keySalt, this.config.rowHashIterations, this.config.hashLength)
      let readablePwd = this.translateHash(currentHash)
      let pwds = this.createColumns(readablePwd)
      hashs.push(pwds)
    }

    return this.invokeCallbackWithReturn(hashs)
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

  invokeCallbackWithReturn(hashs) {
    if(!hashs) {
      hashs= []
    }
    if(this.callback) {
      this.callback(hashs)
    }
    return hashs
  }
}
