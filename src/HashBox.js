export default class HashBox {
  constructor(radio) {

      radio.subscribe('inputChanged', (identifier, token) => {
        console.log("intercept: " + identifier + " - " + token)

        radio.broadcast('hashsCalculated', identifier+identifier, token+token)
      })

      radio.subscribe('timeEpocheChanged', (arg1) => console.log(arg1))
  }
}
