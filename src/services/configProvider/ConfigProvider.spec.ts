import mock, { once } from 'xhr-mock'
import defaultConfig from '../../DefaultConfig'
import configProvider from './ConfigProvider'

describe('ConfigProvider', () => {

  const configUrl = 'someRandomStringHere'

  beforeEach(() => mock.setup())

  afterEach(() => mock.teardown())

  it('calls url with GET', async () => {
    const expectedResponseBody = { test: true }
    mock.get(configUrl, once({
      body: JSON.stringify(expectedResponseBody),
      status: 200,
    }))

    const actualResponsebody = await configProvider.loadConfig(configUrl)
    expect(actualResponsebody).toEqual(expectedResponseBody)
  })

  it('provides default config in case of HTTP non 200', async () => {
    mock.get(configUrl, once({
      status: 404,
    }))

    const actualResponsebody = await configProvider.loadConfig(configUrl)
    expect(actualResponsebody).toEqual(defaultConfig)
  })

  it('provides default config in case of error', async () => {
    mock.get(configUrl, () => Promise.reject(new Error()))

    const actualResponsebody = await configProvider.loadConfig(configUrl)
    expect(actualResponsebody).toEqual(defaultConfig)
  })
})
