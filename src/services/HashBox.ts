import findIndex from 'lodash/findIndex'
import isEqual from 'lodash/isEqual'
import { pbkdf2 } from 'pbkdf2'
import { IHashBoxConfig, IProfile } from '../@types/Config'

export default class HashBox {

  public static async run(config: IHashBoxConfig, profile: IProfile, input: string): Promise<string[][]> {
    HashBox.verifyConfig(config)

    // TODO: add tests to check if parameters are used
    const inputHashed = await HashBox.calculateHash(input, config.keySalt, config.tokenHashingIterations, 128)

    const results = Array(config.outputRows)

    for (let i = 0; i < config.outputRows; i++) {
      const salt = i + config.tokenSalt
      const hash = await HashBox.calculateHash(inputHashed, salt, config.rowHashIterations, config.hashResultLengthInBytes)
      const readableString = HashBox.translateBufferToReadableString(hash, profile.charGroups)
      const columns = HashBox.createColumnsMatchingSize(readableString, config.outputColumns)

      results[i] = columns
    }

    return results
  }

  public static async selfTest() {
    const hashBox = {
      hashResultLengthInBytes: 12,
      keySalt: 'f134§',
      outputColumns: [3, 6, -1],
      outputRows: 2,
      rowHashIterations: 2,
      tokenHashingIterations: 32,
      tokenSalt: 'fdF6e%! #wMe',
    }

    const profile = {
      charGroups: [
        'abcdefghijklmnopqrstuvwxyzäöü',
        'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ',
        '1234567890',
        '!$%(){}[]-_.:,;+*@~',
      ],
      name: 'selfTest',
    }

    const expectedHashes = [
      ['eQ9', 'eQ9{aY', 'eQ9{aY'],
      ['eR7', 'eR7$qR', 'eR7$qR'],
    ]
    const actualHashes = await HashBox.run(hashBox, profile, 'hello world')

    if (isEqual(actualHashes, expectedHashes)) {
      console.log('HashBox: Self test passed')
      return
    }

    const joinStringA = '\'; \''
    const joinStringB = '\', \''
    const expectedOutput = expectedHashes.map(e => e.join(joinStringB)).join(joinStringA)
    if (actualHashes) {
      const actualOutput = actualHashes.map(a => a.join(joinStringB)).join(joinStringA)
      throw Error(`Self test failed (1). Expected\n\'${expectedOutput}\' but got\n\'${actualOutput}\'`)
    } else {
      throw Error(`Self test failed (2). Expected\n\'${expectedOutput}\' but got ${actualHashes}`)
    }
  }

  public static calculateHash(input: string | Buffer, salt: string, rowHashIterations: number, hashResultLengthInBytes: number): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const cb = (err: Error, derivedKey: Buffer): void => {
        if (err) {
          return reject(err)
        }
        return resolve(derivedKey)
      }

      pbkdf2(input, salt, rowHashIterations, hashResultLengthInBytes, HashBox.digest, cb)
    })
  }

  public static translateBufferToReadableString(buffer: Buffer, charGroups: string[]): string {
    if (charGroups.length === 0 || findIndex(charGroups, g => g.length === 0) !== -1) {
      throw Error('Characters must not be empty')
    }
    if (buffer.length % 2 !== 0) {
      throw Error('Buffer length must be even')
    }

    const result = []
    let startingPosition = 0

    let charGroupIndex = 0

    for (let i = 0; i < buffer.length - 1; i += 2) {
      const bufferValueAt = buffer[i]
      const bufferValueAtNext = buffer[i + 1] // not used for next starting position in order to increase entropy

      const charGroup = charGroups[charGroupIndex]
      startingPosition = (startingPosition + bufferValueAt) % charGroup.length

      const nextPositionWithAddedEntropy = startingPosition + bufferValueAtNext

      const char = charGroup[nextPositionWithAddedEntropy % charGroup.length]
      result.push(char)

      charGroupIndex = (charGroupIndex + 1) % charGroups.length
    }

    return result.join('')
  }

  public static createColumnsMatchingSize(pwd: string, outputColumns: number[]): string[] {
    return outputColumns.map(end => {
      if (end >= 0) {
        return pwd.substring(0, end).trim()
      } else {
        return pwd.trim()
      }
    })
  }

  private static digest = 'sha512'

  private static verifyConfig(config: IHashBoxConfig) {
    if (config.outputRows <= 0) {
      throw Error('Output rows must be greater 0')
    }

    if (!config.keySalt) {
      throw Error('Key salt must be given')
    }

    if (config.outputColumns.length === 0) {
      throw Error('Output columns must be given')
    }
  }
}
