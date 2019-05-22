
export interface IHashBoxConfig {
  keySalt: string
  tokenSalt: string

  tokenHashingIterations: number
  rowHashIterations: number

  hashResultLengthInBytes: number // max result has half the size given here due to translateBufferToReadableString

  outputColumns: number[] // number < 0 returns max length, max lengths is defined by hashResultLengthInBytes / 2
  outputRows: number
}

export interface IProfile {
  name: string
  charGroups: string[]
}

export interface IOtm {
  uri: string
  accessToken: string
}

export interface IUi { colors: string[] }

export default interface IConfig {
  hashBoxConfig: IHashBoxConfig
  profiles: IProfile[]
  otm?: IOtm
  ui: IUi
}
