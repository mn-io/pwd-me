import IConfig from '../../@types/Config'
import defaultConfig from '../../DefaultConfig'
import IConfigProvider from './IConfigProvider'

class ConfigProvider implements IConfigProvider {

  private static READY_STATE_DONE = 4

  public async loadConfig(configUrl: string): Promise<IConfig> {
    const localStorageKey = 'ConfigProvider:' + configUrl

    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.timeout = 500
      request.open('GET', configUrl, true)
      request.onreadystatechange = () => {
        if (request.readyState !== ConfigProvider.READY_STATE_DONE) {
          return
        }

        if (request.status === 200) {
          try {
            const config = JSON.parse(request.response) as IConfig
            console.log(`Load config from ${configUrl} successful`)

            localStorage.setItem(localStorageKey, request.response)
            resolve(config)
          } catch (e) {
            console.error(`Load config from ${configUrl} failed due to '${e}', using fallback`)
            reject(defaultConfig)
          }
        } else {
          console.error(`Load config from ${configUrl} failed due to server response ${request.status}, using fallback`)
          reject(defaultConfig)
        }
      }

      request.send()
    }).catch(() => {
      const fromLocalStorage = localStorage.getItem(localStorageKey)
      if (fromLocalStorage) {
        console.info(`Fallback is provided from local storage`)
        return fromLocalStorage
      }
      console.info(`Fallback is provided from build in default config`)
      return defaultConfig
    }).then()


  }
}

export default new ConfigProvider()
