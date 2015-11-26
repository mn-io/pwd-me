export default class HashBox {
  constructor(radio) {

      radio.intercept('fieldChanged', (broadcast, identifier, token) => {
        console.log("intercept: " + identifier + " - " + token)
        
        broadcast(identifier+identifier, token+token)
      })
  }
}
