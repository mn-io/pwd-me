import IConfig from './@types/Config'

const config: IConfig = {
  hashBoxConfig: {
    keySalt: "f13ds334§",
    tokenSalt: "fdF6e%! #wasdkhke",

    rowHashIterations: 64,
    tokenHashingIterations: 64,

    hashResultLengthInBytes: 128,

    outputColumns: [12, 24, -1],
    outputRows: 12,
  },

  profiles: [{
    charGroups: ["abcdefghijklmnopqrstuvwxyzäöüABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ1234567890!$%(){}[]-_.:,;+*@~abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"],
    name: "Default",
  },
  {
    charGroups: ["abcdefghijklmnopqrstuvwxyzäöüABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ1234567890!@#$~-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"],
    name: "Ebay",
  },
  {
    charGroups: ["abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890", "!\"#$%&'()*+,-./:;<=>?@[\\]^{|}~abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"],
    name: "Google",
  },
  {
    charGroups: ["abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!\"#$%&'()*+,- ./:;<=> ?@{|}~[\\]^_`abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"],
    name: "VeraCrypt",
  },
  ],

  otm: {
    accessToken: "",
    uri: "",
  },

  ui: {
    colors: ["#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#F44336", "#E91E63", "#9C27B0", "#673AB7"],
  },
}

export default config