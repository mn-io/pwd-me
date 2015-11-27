export default class HashBox {
  constructor(radio) {
    this.radio = radio
    radio.subscribe('inputChanged', this.inputChanged)
    radio.subscribe('timeEpocheChanged', this.timeEpocheChanged)
  }

  inputChanged(identifier, token) {
    //radio.broadcast('hashsCalculated', identifier+identifier, token+token)
    console.log(identifier)
  }

  timeEpocheChanged(epocheCount) {
    console.log(epocheCount)
  }
}
