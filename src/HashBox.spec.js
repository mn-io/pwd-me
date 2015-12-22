import assert from 'assert'
import _ from 'lodash'

import HashBox from './HashBox'

let config = {
  "tokenSalt": "fdF6e%! #wMe",
  "keySalt": "f134§",
  "outputRows": 2,
  "outputColumns": [6, 12, -1],
  "tokenHashingIterations": 128,
  "rowHashIterations": 2,
  "hashResultLengthInBytes": 64,
  "validCharacters": "abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ äöü ÄÖÜ 1234567890 abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ äöü ÄÖÜ 1234567890 !$%&(){}[]-_.:,;#+*@",
}

let inAndOut = {
  "identifier": "fweq342Ö43",
  "token": "345$%3",
  "epocheCount": 3,
  "tokenHash": "a4a09823a46c8240a585e81cdb0a42856ce5bdf96ad390ba3f5b142dc34a7ca37620abfe9b6ad830af1a1f040925c4c145ed6ac42e435316a32e337071fea61e",
  "hashs": [["sASH Ö","sASH Ö(YQfRy","sASH Ö(YQfRy+MZt&d v&Dn4g4ÖünHt3"], ["D[4ia8","D[4ia8U o4af","D[4ia8U o4afJrtÖjOh,7N}ÜXi&yF zd"]]
}

describe('HashBox', () => {

  describe('happy path', () => {
    it('returns new state if possible', () => {
      let box = new HashBox(config)
      let state1 = box.setIdentifier(inAndOut.identifier)
      let state2 = box.setToken(inAndOut.token)

      assert(!state1)
      assert.deepEqual(inAndOut.hashs, state2)

      let state3 = box.setTimeEpoche(inAndOut.epocheCount)
      assert.notDeepEqual(state2, state3)
    })

    it('returns new state by callback', (done) => {
      let callback = (hashs) => {
        assert.deepEqual(inAndOut.hashs, hashs)
        done()
      }

      let box = new HashBox(config, callback, true)

      let state1 = box.setIdentifier(inAndOut.identifier)
      let state2 = box.setToken(inAndOut.token)

      assert(!state1)
      assert.deepEqual(inAndOut.hashs, state2)
    })

    it('returns no new state by same input', () => {
      let box = new HashBox(config)
      box.setIdentifier(inAndOut.identifier)
      let state = box.setToken(inAndOut.token)
      assert.deepEqual(inAndOut.hashs, state)

      box.setIdentifier(inAndOut.identifier)
      state = box.setToken(inAndOut.token)
      assert(!state)
    })

    it('returns new state several times', () => {
      let box = new HashBox(config)
      box.setIdentifier(inAndOut.identifier)
      let state = box.setToken(inAndOut.token)
      assert.deepEqual(inAndOut.hashs, state)

      for (let i = 0; i < 4; i++) {
        box.setIdentifier('')
        box.setToken('')

        box.setIdentifier(inAndOut.identifier)
        state = box.setToken(inAndOut.token)
        assert.deepEqual(inAndOut.hashs, state)

        box.setIdentifier('')
        box.setToken('')

        box.setIdentifier(inAndOut.identifier)
        state = box.setToken(inAndOut.token)
        assert.deepEqual(inAndOut.hashs, state)
      }
    })
  })

  describe('#constructor', () => {
    it('inits', () => {
      let box = new HashBox(config, null, false)
    })

    it('does not init without config', (done) => {
      try{
        let box = new HashBox()
      } catch(e) {
        assert(e)
        done()
      }
    })
  })

  describe('#setIdentifier', () => {
    let box

    beforeEach(() => {
      box = new HashBox(config, null, false)
    })

    it('saves identifier and return no new state', () => {
      let result = box.setIdentifier(inAndOut.identifier)
      assert(!result)
      assert.equal(inAndOut.identifier, box.state.identifier)
    })

    it('clears hashs on empty identifier and return new state', () => {
      let result = box.setIdentifier("")
      assert.deepEqual([], result)
      assert(!box.state.identifier)
    })

    it('clears hashs on null identifier and return new state', () => {
      let result = box.setIdentifier(null)
      assert.deepEqual([], result)
      assert(!box.state.identifier)
    })
  })

  describe('#setToken', () => {
    let box

    beforeEach(() => {
      box = new HashBox(config, null, false)
    })

    it('saves and hashs token and return no new state', () => {
      let result = box.setToken(inAndOut.token)
      assert(!result)
      assert.equal(inAndOut.token, box.state.token)
      assert.equal(inAndOut.tokenHash, box.state.tokenHash.toString('hex'))
    })

    it('clears hashs on empty token and return new state', () => {
      let result = box.setToken("")
      assert.deepEqual([], result)
      assert(!box.state.token)
      assert(!box.state.tokenHash)
    })

    it('clears hashs on null token and return new state', () => {
      let result = box.setToken(null)
      assert.deepEqual([], result)
      assert(!box.state.token)
      assert(!box.state.tokenHash)
    })

    it('calculates invalid hash with wrong config', () => {
      let wrongConfig = _.cloneDeep(config)
      wrongConfig.tokenSalt = "something else"

      box = new HashBox(wrongConfig, null, false)
      let result = box.setToken(inAndOut.token)

      assert.equal(inAndOut.token, box.state.token)
      assert.notEqual(inAndOut.tokenHash, box.state.tokenHash.toString('hex'))
    })
  })

  describe('#setTimeEpoche', () => {

    it('saves value and return no new state', () => {
      let box = new HashBox(config, null, false)
      let result = box.setTimeEpoche(inAndOut.epocheCount)
      assert(!result)
      assert.equal(inAndOut.epocheCount, box.state.epocheCount)
    })
  })

  describe('#createHashs', () => {
    let box

    beforeEach(() => {
      box = new HashBox(config, null, false)
    })

    it('returns no new state if missing token', () => {
      let result = box.createHashs()
      assert(!result)

      box.setIdentifier("dummy")
      result = box.createHashs()
      assert(!result)
    })

    it('returns no new state if missing identifier', () => {
      box.setToken("dummy")
      let result = box.createHashs()
      assert(!result)
    })

    it('returns new state if has token and identifier', () => {
      box.setIdentifier(inAndOut.identifier)
      box.setToken(inAndOut.token)
      let result = box.createHashs()
      assert.deepEqual(result, inAndOut.hashs)
    })

    it('returns different hashs with changed rowHashIterations', () => {
      let newConfig = _.cloneDeep(config)
      newConfig.rowHashIterations = 3
      box = new HashBox(newConfig, null, false)

      box.setIdentifier(inAndOut.identifier)
      box.setToken(inAndOut.token)
      let result = box.createHashs()
      assert.notDeepEqual(result, inAndOut.hashs)
    })

    it('returns different hashs with changed tokenHashingIterations', () => {
      let newConfig = _.cloneDeep(config)
      newConfig.tokenHashingIterations = 129
      box = new HashBox(newConfig, null, false)

      box.setIdentifier(inAndOut.identifier)
      box.setToken(inAndOut.token)
      let result = box.createHashs()
      assert.notDeepEqual(result, inAndOut.hashs)
    })

    it('returns different hashs with changed hashResultLengthInBytes', () => {
      let newConfig = _.cloneDeep(config)
      newConfig.tokenHashingIterations = 65
      box = new HashBox(newConfig, null, false)

      box.setIdentifier(inAndOut.identifier)
      box.setToken(inAndOut.token)
      let result = box.createHashs()
      assert.notDeepEqual(result, inAndOut.hashs)
    })

    it('returns different hashs with changed keySalt', () => {
      let newConfig = _.cloneDeep(config)
      newConfig.keySalt = "this is a test"
      box = new HashBox(newConfig, null, false)

      box.setIdentifier(inAndOut.identifier)
      box.setToken(inAndOut.token)
      let result = box.createHashs()
      assert.notDeepEqual(result, inAndOut.hashs)
    })
  })

  describe('#translateHash', () => {

    it('replaces bytes to character', () => {
      let box = new HashBox(config, null, false)
      let buf =  new Buffer('aaaa')
      let result = box.translateHash(buf)
      assert.equal('BZ', result)
    })

    it('replaces bytes to character', () => {
      let newConfig = _.cloneDeep(config)
      newConfig.validCharacters = "abc"

      let box = new HashBox(newConfig, null, false)
      let buf =  new Buffer('aaaaaa')
      let result = box.translateHash(buf)
      assert.equal('cab', result)
    })

    it('does not work with invalid config', (done) => {
      let invalidConfig = _.cloneDeep(config)
      invalidConfig.validCharacters = ""

      let box = new HashBox(invalidConfig, null, false)
      try{
        let buf =  new Buffer('aaaaaa')
        box.translateHash(buf)
      } catch(e) {
        assert(e)
        done()
      }
    })

    it('does not work with invalid parameter type', (done) => {
      let box = new HashBox(config, null, false)
      try{
        box.translateHash('aa')
      } catch(e) {
        assert(e)
        done()
      }
    })

    it('does not work with invalid parameter length', (done) => {
      let box = new HashBox(config, null, false)
      try{
        let buf =  new Buffer('aaadaaa')
        box.translateHash(buf)
      } catch(e) {
        assert(e)
        done()
      }
    })
  })

  describe('#createColumns', () => {
    let abc = "abcdefghijklmnopqrstuvwxyz"

    it('works with default config', () => {
      let box = new HashBox(config, null, false)
      let result = box.createColumns(abc)

      assert.deepEqual(['abcdef','abcdefghijkl','abcdefghijklmnopqrstuvwxyz'], result)
      assert.equal(config.outputColumns[0], result[0].length)
      assert.equal(config.outputColumns[1], result[1].length)
      assert.equal(abc.length, result[2].length)
    })

    it('works with minimal config', () => {
      let localConfig = _.cloneDeep(config)
      localConfig.outputColumns = []

      let box = new HashBox(localConfig, null, false)
      let result = box.createColumns(abc)

      assert.deepEqual([], result)
    })

    it('works with large config', () => {
      let localConfig = _.cloneDeep(config)
      localConfig.outputColumns = [abc.length + 5]

      let box = new HashBox(localConfig, null, false)
      let result = box.createColumns(abc)

      assert.equal(abc.length, result[0].length)
    })
  })
})
