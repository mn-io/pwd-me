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
      'setProfilesConfig',
      'invokeCallbackWithReturn'
    )

    runSelfTest && this.selfTest()

    this.config = HashBox.createConfig(config)
    this.defaultConfig = _.cloneDeep(this.config)
    this.callback = callback

    this.state = {
      epocheCount: 0
    }
  }

  selfTest() {
    let config = {
      tokenSalt: 'fdF6e%! #wMe',
      keySalt: 'f134§',
      outputRows: 2,
      outputColumns: [6, 12, -1],
      tokenHashingIterations: 128,
      rowHashIterations: 2,
      hashResultLengthInBytes: 64,
      validCharacters: 'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ äöü ÄÖÜ 1234567890 abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ äöü ÄÖÜ 1234567890 !$%&(){}[]-_.:,;#+*@',
    }
    let tmpInstance = new HashBox(config, null, false)

    tmpInstance.setToken('345$%3')

    let actualTokenHash = tmpInstance.state.tokenHash.toString('hex')
    let actualState = tmpInstance.setIdentifier('fweq342Ö43')

    let expectedTokenHash = 'a4a09823a46c8240a585e81cdb0a42856ce5bdf96ad390ba3f5b142dc34a7ca37620abfe9b6ad830af1a1f040925c4c145ed6ac42e435316a32e337071fea61e'
    let expectedState = [['sASH Ö','sASH Ö(YQfRy','sASH Ö(YQfRy+MZt&d v&Dn4g4ÖünHt3'], ['D[4ia8','D[4ia8U o4af','D[4ia8U o4afJrtÖjOh,7N}ÜXi&yF zd']]

    assert.equal(expectedTokenHash, actualTokenHash)
    assert.deepEqual(actualState, expectedState)

    console.log('HashBox self test: OK')
  }

  setProfilesConfig(profiles) {
    this.profilesConfig = profiles
  }

  setIdentifier(identifier) {
    if('' === identifier) {
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
    if('' === token || undefined === token) {
      token = null
    }

    assert(this.config.tokenSalt)
    assert(this.config.tokenHashingIterations > 0)
    assert(this.config.hashResultLengthInBytes > 0)

    let tokenHashCurrentConfig = this.config.tokenSalt +
      this.config.tokenHashingIterations +
      this.config.hashResultLengthInBytes

    if(token === this.state.token
      && tokenHashCurrentConfig === this.state.tokenHashUsedConfig) {
      return
    }

    if(null === token) {
      this.state.tokenHash = hash
      this.state.token = null
      return this.invokeCallbackWithReturn()
    }

    let hash = pbkdf2(token,
      this.config.tokenSalt ,
      this.config.tokenHashingIterations,
      this.config.hashResultLengthInBytes)

    this.state.tokenHashUsedConfig = tokenHashCurrentConfig
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

    if(name === this.state.selectedProfileByName) {
      return
    }

    let profile = this.profilesConfig[name]
    if(profile) {
      console.log(`Using profile with name ${name}`)
      this.config = HashBox.createConfig(this.defaultConfig, profile)
    } else {
      console.log(`Using default profile, name ${name} not found`)
      this.config = this.defaultConfig
    }

    this.state.selectedProfileByName = name
    let hashes = this.setToken(this.state.token)
    return hashes ? hashes : this.createHashs()
  }

  static createConfig(rootConfig, currentConfig) {
    let config = _.cloneDeep(rootConfig)

    if(currentConfig) {
      _.merge(config, currentConfig)
    }

    if(config.constraints) {
      config.constraints = _.map(config.constraints, constraint => {
        return 'string' === typeof(constraint) ? new RegExp(constraint) : constraint
      })
    }

    return config
  }

  createHashs() {
    if(!this.state.identifier || !this.state.tokenHash) {
      return
    }

    assert(this.config.keySalt)
    assert(this.config.rowHashIterations > 0)
    assert(this.config.hashResultLengthInBytes > 0)

    let key = `id=${this.state.identifier}&token=${this.state.tokenHash}&epoche=${this.state.epocheCount}`

    let hashs = []
    for (let i = 0; i < this.config.outputRows; i++) {
      let currentHash = pbkdf2(key, i + this.config.keySalt,
        this.config.rowHashIterations,
        this.config.hashResultLengthInBytes)
      let readablePwd = HashBox.translateHash(currentHash, this.config.validCharacters)
      let pwds = HashBox.createColumns(readablePwd, this.config.outputColumns)

      pwds = _.map(pwds, pwd => {
        if(!HashBox.verifyPwdAgainstConstraints(pwd, this.config.constraints)) {
          return _.repeat('_', pwd.length)
        }
        return pwd
      })

      hashs.push(pwds)
    }

    return this.invokeCallbackWithReturn(hashs)
  }

  static translateHash(hash, chars) {
    assert('Buffer' === hash.constructor.name)
    assert(hash.length % 2 === 0)
    assert(chars.length > 0)

    let result = []
    let position = 0

    for (let i = 0; i < hash.length-1; i=i+2) {
      position = position + hash[i]
      let validPosition = (position + hash[i+1]) % chars.length
      result.push(chars[validPosition])
    }

    return result.join('')
  }

  static createColumns(pwd, columnsSpec) {
    let columns = []

    for (let i = 0; i < columnsSpec.length; i++) {
      let end = columnsSpec[i]
      let value = pwd
      if(end > 0) {
        value = pwd.substring(0, end)
      }
      value = value.trim()
      columns.push(value)
    }

    return columns
  }

  static verifyPwdAgainstConstraints(pwd, constraints) {
    let valid = true
    _.each(constraints, constraint => {
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
