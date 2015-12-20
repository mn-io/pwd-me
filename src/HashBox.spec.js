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
  "hashs": [["+eÖa*ö","+eÖa*öfyT!M ","+eÖa*öfyT!M D7QPoGsT$dÄJ)m;ö2rZ "], ["6[(SvF","6[(SvFDq0s4W","6[(SvFDq0s4Wq#ZNA%QYybaVÄqö uHga"]]
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
      }
    })
  })

  describe('#setIdentifier', () => {

    let box

    beforeEach(() => {
      box = new HashBox(config)
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
      box = new HashBox(config)
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

      box = new HashBox(wrongConfig)
      let result = box.setToken(inAndOut.token)

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

  describe('#createHashs', () => {

    let box

    beforeEach(() => {
      box = new HashBox(config)
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
      let box = new HashBox(config)
      box.setIdentifier(inAndOut.identifier)
      box.setToken(inAndOut.token)
      let result = box.createHashs()
      assert.deepEqual(result, inAndOut.hashs)
    })
  })

  describe('#translateHash', () => {

      it('replaces bytes to character', () => {
        let box = new HashBox(config)
        let buf =  new Buffer('aaaa')
        let result = box.translateHash(buf)
        assert.equal('BZ', result)
      })

      it('replaces bytes to character', () => {
        let newConfig = _.cloneDeep(config)
        newConfig.validCharacters = "abc"

        let box = new HashBox(newConfig)
        let buf =  new Buffer('aaaaaa')
        let result = box.translateHash(buf)
        assert.equal('cab', result)
      })

      it('does not work with invalid config', (done) => {
        let invalidConfig = _.cloneDeep(config)
        invalidConfig.validCharacters = ""

        let box = new HashBox(invalidConfig)
        try{
          let buf =  new Buffer('aaaaaa')
          box.translateHash(buf)
        } catch(e) {
          assert(e)
          done()
        }
      })

      it('does not work with invalid parameter type', (done) => {
        let box = new HashBox(config)
        try{
          box.translateHash('aa')
        } catch(e) {
          assert(e)
          done()
        }
      })

      it('does not work with invalid parameter length', (done) => {
        let box = new HashBox(config)
        try{
          let buf =  new Buffer('aaadaaa')
          box.translateHash(buf)
        } catch(e) {
          assert(e)
          done()
        }
      })
    })
    
  //TODO: createColumns testting
  //TODO: happy path testing

  //TODO: testing on build
  //TODO: testing on app load
})
