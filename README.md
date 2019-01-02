# Key Derivator

Tool for creating unique passwords, which can be re-generated from anywhere

More information about the basic idea can be found here: https://en.wikipedia.org/wiki/Key_derivation_function

## Implementation details
* Using PBKDF2 for hashing
* Hashs are translated into "readable" passwords by certain range of characters provided in `public/config.json`

##
* Code is executed within client's browser and no server interaction is needed. Therefore we can just serve static files
* Client App is based on ReactJS
* Hashbox with full test coverage and basic self-test on each app start.

## Screenshot
![Screenshot](https://raw.githubusercontent.com/mn-io/key-derivator/master/screenshot.png)

## To Dos

- Minimize bundle with proper tree shaking, especially for lodash
- Resolve To Dos
- Add https://david-dm.org/mn-io/key-derivator?type=dev
- Increase test coverage for non criticial code
- Use CI