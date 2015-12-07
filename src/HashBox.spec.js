import assert from 'assert'
import _ from 'lodash'
import Airwaves from 'airwaves'

import HashBox from './HashBox'

let config = {
  "tokenSalt": "fdF6e%! #wMe",
  "keySalt": "f134§",
  "outputRows": 17,
  "outputColumns": [6, 12, -1],
  "pbkdf2Iterations": 128,
  "validCharacters": "abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ äöü ÄÖÜ 1234567890 abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ äöü ÄÖÜ 1234567890 !$%&(){}[]-_.:,;#+*@",
}

let inAndOut = {
  "identifier": "hello",
  "token": "hello",
  "tokenHash": "db9b4e5f73d04ef01ba9295dc2a993c9177fc75546ba73083e780f9911258e5945d3772f2d25fd033fdb3ed8008a44aa0fe2b4baefc7705d7ebef85f26ec1f16",
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
})
