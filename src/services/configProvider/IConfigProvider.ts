import IConfig from '../../@types/Config'

export default interface IConfigProvider {
  loadConfig(configUrl: string): Promise<IConfig>
}
