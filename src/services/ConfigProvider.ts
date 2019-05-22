import IConfig from '../@types/Config'
import defaultConfig from '../DefaultConfig'

export class ConfigProvider {

  public static async loadConfig(configUrl: string): Promise<IConfig> {

    return new Promise((resolve) => {
      const request = new XMLHttpRequest()
      request.open('GET', configUrl, true)
      request.onreadystatechange = () => {
        if (request.readyState !== ConfigProvider.READY_STATE_DONE) {
          return
        }

        if (request.status === 200) {
          try {
            const config = JSON.parse(request.response) as IConfig
            console.log(`Load config from ${configUrl} successful`)
            resolve(config)
          } catch (e) {
            console.error(`Load config from ${configUrl} failed due to '${e}', using default fallback`)
            resolve(defaultConfig)
          }
        } else {
          console.error(`Load config from ${configUrl} failed due to server response ${request.status}, using default fallback`)
          resolve(defaultConfig)
        }
      }

      request.send()
    })


  }

  private static READY_STATE_DONE = 4

  private constructor() {
  }
}
