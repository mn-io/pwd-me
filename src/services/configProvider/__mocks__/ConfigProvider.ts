import IConfig from '../../../@types/Config'
import defaultConfig from '../../../DefaultConfig'
import IConfigProvider from '../IConfigProvider'

export class MockConfigProvider implements IConfigProvider {

  public async loadConfig(configUrl: string): Promise<IConfig> {
    return new Promise((resolve) => {
      console.log(`Mocking config loading from ${configUrl}`)
      resolve(defaultConfig)
    })
  }
}

export default new MockConfigProvider()
