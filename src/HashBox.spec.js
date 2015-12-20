import assert from 'assert'
import _ from 'lodash'

import HashBox from './HashBox'

let config = {
  "tokenSalt": "fdF6e%! #wMe",
  "keySalt": "f134§",
  "outputRows": 2,
  "outputColumns": [6, 12, -1],
  "tokenHashingIterations": 128,
  "hashResultLengthInBytes": 64,
  "validCharacters": "abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ äöü ÄÖÜ 1234567890 abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ äöü ÄÖÜ 1234567890 !$%&(){}[]-_.:,;#+*@",
}

let inAndOut = {
  "identifier": "fweq342Ö43",
  "token": "345$%3",
  "epocheCount": 3,
  "tokenHash": "a4a09823a46c8240a585e81cdb0a42856ce5bdf96ad390ba3f5b142dc34a7ca37620abfe9b6ad830af1a1f040925c4c145ed6ac42e435316a32e337071fea61e",
}

describe('HashBox', () => {

  describe('#constructor', () => {

    it('inits', () => {
      let box = new HashBox(config)
    })

    it('does not init without config', (done) => {
      try{
        let box = new HashBox()
      } catch(e) {
        assert(e)
        done()
        return
      }
    })
  })

  describe('#identifierChanged', () => {

    it('saves identifier and return no new state', () => {
      let box = new HashBox(config)
      let result = box.identifierChanged(inAndOut.identifier)
      assert(!result)
      assert.equal(inAndOut.identifier, box.state.identifier)
    })

    it('clears hashs on empty identifier and return new state', () => {
      let box = new HashBox(config)
      let result = box.identifierChanged("")
      assert.deepEqual([], result)
      assert(!box.state.identifier)
    })

    it('clears hashs on null identifier and return new state', () => {
      let box = new HashBox(config)
      let result = box.identifierChanged(null)
      assert.deepEqual([], result)
      assert(!box.state.identifier)
    })
  })

  describe('#tokenChanged', () => {

    it('saves and hashs token and return no new state', () => {
      let box = new HashBox(config)
      let result = box.tokenChanged(inAndOut.token)
      assert(!result)
      assert.equal(inAndOut.token, box.state.token)
      assert.equal(inAndOut.tokenHash, box.state.tokenHash.toString('hex'))
    })

    it('clears hashs on empty token and return new state', () => {
      let box = new HashBox(config)
      let result = box.tokenChanged("")
      assert.deepEqual([], result)
      assert(!box.state.token)
      assert(!box.state.tokenHash)
    })

    it('clears hashs on null token and return new state', () => {
      let box = new HashBox(config)
      let result = box.tokenChanged(null)
      assert.deepEqual([], result)
      assert(!box.state.token)
      assert(!box.state.tokenHash)
    })

    it('calculates invalid hash with wrong config', () => {
      let wrongConfig = _.cloneDeep(config)
      wrongConfig.tokenSalt = "something else"

      let box = new HashBox(wrongConfig)
      let result = box.tokenChanged(inAndOut.token)

      assert.equal(inAndOut.token, box.state.token)
      assert.notEqual(inAndOut.tokenHash, box.state.tokenHash.toString('hex'))
    })
  })

  describe('#timeEpocheChanged', () => {

    it('saves value and return no new state', () => {
      let box = new HashBox(config)
      let result = box.timeEpocheChanged(inAndOut.epocheCount)
      assert(!result)
      assert.equal(inAndOut.epocheCount, box.state.epocheCount)
    })
  })

  //TODO: createHash testing
  //TODO: translateHash testing
  //TODO: createColumns testting
  //TODO: happy path testing

  //TODO: testing on build
  //TODO: testing on app load
})
