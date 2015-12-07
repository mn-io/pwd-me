import assert from 'assert'
import _ from 'lodash'
import Airwaves from 'airwaves'

import HashBox from './HashBox'

let config = {
  "tokenSalt": "fdF6e%! #wMe",
  "keySalt": "f134§",
  "outputRows": 2,
  "outputColumns": [6, 12, -1],
  "tokenHashingIterations": 128,
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
      let radio = new Airwaves.Channel()
      let box = new HashBox(radio, config)
    })
  })

  describe('#identifierChanged', () => {

    let radio;

    beforeEach(() => {
      radio = new Airwaves.Channel()
    })

    it('receives broadcast', () => {
      let box = new HashBox(radio, config)
      radio.broadcast('identifierChanged', inAndOut.identifier)
      assert(inAndOut.identifier, box.state.identifier)
    })

    it('clears hashs on empty identifier', (done) => {
      let box = new HashBox(radio, config)
      radio.subscribe('clearHashs', done)
      radio.broadcast('identifierChanged', "")
      assert(!box.state.identifier)
    })

    it('clears hashs on null identifier', (done) => {
      let box = new HashBox(radio, config)
      radio.subscribe('clearHashs', done)
      radio.broadcast('identifierChanged', null)
      assert(!box.state.identifier)
    })
  })

  describe('#tokenChanged', () => {

    let radio;

    beforeEach(() => {
      radio = new Airwaves.Channel()
    })

    it('receives broadcast and calculates correct hash', () => {
      let box = new HashBox(radio, config)
      radio.broadcast('tokenChanged', inAndOut.token)
      assert.equal(inAndOut.token, box.state.token)
      assert.equal(inAndOut.tokenHash, box.state.tokenHash.toString('hex'))
    })

    it('clears hashs on empty token', (done) => {
      let box = new HashBox(radio, config)
      radio.subscribe('clearHashs', done)
      radio.broadcast('tokenChanged', "")
      assert(!box.state.token)
      assert(!box.state.tokenHash)
    })

    it('receives broadcast and calculates invalid hash', () => {
      let wrongConfig = _.cloneDeep(config)
      wrongConfig.tokenSalt = "something else"

      let box = new HashBox(radio, wrongConfig)
      radio.broadcast('tokenChanged', inAndOut.token)
      assert.equal(inAndOut.token, box.state.token)
      assert.notEqual(inAndOut.tokenHash, box.state.tokenHash.toString('hex'))
    })

    it('clears hashs on null token', (done) => {
      let box = new HashBox(radio, config)
      radio.subscribe('clearHashs', done)
      radio.broadcast('tokenChanged', null)
      assert(!box.state.token)
      assert(!box.state.tokenHash)
    })

    it('clears hashs on empty token', (done) => {
      let box = new HashBox(radio, config)
      radio.subscribe('clearHashs', done)
      radio.broadcast('tokenChanged', "")
      assert(!box.state.token)
      assert(!box.state.tokenHash)
    })
  })

  describe('#timeEpocheChanged', () => {

    let radio;

    beforeEach(() => {
      radio = new Airwaves.Channel()
    })

    it('receives broadcast', () => {
      let box = new HashBox(radio, config)
      radio.broadcast('timeEpocheChanged', inAndOut.epocheCount)
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
