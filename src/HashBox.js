import _ from 'lodash'
import assert from 'assert'
import pbkdf2 from 'pbkdf2-sha256'

export default class HashBox {
  constructor(config, callback, runSelfTest = true) {
    assert(config)

    _.bindAll(this,
      'setIdentifier',
      'setToken',
      'setTimeEpoche',
      'setProfileByName',
      'createHashs',
      'translateHash',
      'createColumns',
      'setProfilesConfig',
      'verifyPwdAgainstProfileConstraints',
      'invokeCallbackWithReturn'
    )

    if(runSelfTest) {
      this.selfTest()
    }

    this.config = {
      tokenSalt: config.tokenSalt,
      keySalt: config.keySalt,
      rows: config.outputRows,
      columns: config.outputColumns,
      tokenIterations: config.tokenHashingIterations,
      rowHashIterations: config.rowHashIterations,
      hashLength: config.hashResultLengthInBytes,
      chars: config.validCharacters,
      defaultChars: config.validCharacters,
      pwdConstraints: null
    }

    this.state = {
      epocheCount: 0
    }

    this.callback = callback
  }

  selfTest() {
    this.config = {
      tokenSalt: "fdF6e%! #wMe",
      keySalt: "f134§",
      rows: 2,
      columns: [6, 12, -1],
      tokenIterations: 128,
      rowHashIterations: 2,
      hashLength: 64,
      chars: "abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ äöü ÄÖÜ 1234567890 abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ äöü ÄÖÜ 1234567890 !$%&(){}[]-_.:,;#+*@",
    }

    this.state = {epocheCount: 0}
    this.setToken("345$%3")

    let actualTokenHash = this.state.tokenHash.toString('hex')
    let actualState = this.setIdentifier("fweq342Ö43")

    let expectedTokenHash = "a4a09823a46c8240a585e81cdb0a42856ce5bdf96ad390ba3f5b142dc34a7ca37620abfe9b6ad830af1a1f040925c4c145ed6ac42e435316a32e337071fea61e"
    let expectedState = [["sASH Ö","sASH Ö(YQfRy","sASH Ö(YQfRy+MZt&d v&Dn4g4ÖünHt3"], ["D[4ia8","D[4ia8U o4af","D[4ia8U o4afJrtÖjOh,7N}ÜXi&yF zd"]]

    assert.equal(expectedTokenHash, actualTokenHash)
    assert.deepEqual(actualState, expectedState)

    console.log("HashBox self test: OK")
  }

  setProfilesConfig(profiles) {
    this.profilesConfig = profiles
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

  setTimeEpoche(epocheCount) {
    this.state.epocheCount = epocheCount
    return this.createHashs()
  }

  setProfileByName(name) {
    if(!this.profilesConfig) {
      return
    }

    if(this.state.selectedProfileByName && name === this.state.selectedProfileByName) {
      return
    }

    let profile = this.profilesConfig[name]
    if(profile) {
      if(profile.validCharacters) {
        this.config.chars = profile.validCharacters
      }
      this.config.pwdConstraints = _.map(profile.constraints, (constraint) => new RegExp(constraint))
    } else {
      this.config.chars = this.config.defaultChars
      this.config.pwdConstraints = null
    }

    this.state.selectedProfileByName = name
    return this.createHashs(true)
  }

  createHashs(force = false) {
    if(!force && (!this.state.identifier || !this.state.tokenHash)) {
      return
    }

    assert(this.config.keySalt)
    assert(this.config.rowHashIterations > 0)

    let key = "id=" + this.state.identifier + "&token=" + this.state.tokenHash + "&epoche=" + this.state.epocheCount

    let hashs = []
    for (let i = 0; i < this.config.rows; i++) {
      let currentHash = pbkdf2(key, i + this.config.keySalt, this.config.rowHashIterations, this.config.hashLength)
      let readablePwd = this.translateHash(currentHash)
      let pwds = this.createColumns(readablePwd)
      pwds = _.map(pwds, (pwd) => {
        if(!this.verifyPwdAgainstProfileConstraints(pwd)) {
          return null
        }
        return pwd
      })
      hashs.push(pwds)
    }

    return this.invokeCallbackWithReturn(hashs)
  }

  translateHash(hash) {
    assert('Buffer' === hash.constructor.name)
    assert(hash.length % 2 === 0)
    assert(this.config.chars.length > 0)

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

  verifyPwdAgainstProfileConstraints(pwd) {
    let valid = true
    _.each(this.config.pwdConstraints, (constraint) => {
      valid = valid && constraint.test(pwd)
    })
    return valid
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
