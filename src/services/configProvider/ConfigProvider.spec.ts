import mock, { once } from 'xhr-mock'
import defaultConfig from '../../DefaultConfig'
import { mockResetAll } from '../../TestUtils'
import configProvider from './ConfigProvider'

describe('ConfigProvider', () => {

  const configUrl = 'someRandomStringHere'

  beforeEach(() => mock.setup())

  afterEach(() => {
    mock.teardown()
    mockResetAll(window.localStorage)
  })

  it('calls url with GET', async () => {
    // toBeCalledTimes does not work here on jest.fn()
    expect(window.localStorage.setItem.mock.calls.length).toBe(0)

    const expectedResponseBody = { test: true }
    mock.get(configUrl, once({
      body: JSON.stringify(expectedResponseBody),
      status: 200,
    }))

    const actualResponsebody = await configProvider.loadConfig(configUrl)
    expect(actualResponsebody).toEqual(expectedResponseBody)
    expect(window.localStorage.setItem.mock.calls.length).toBe(1)
  })

  it('provides default config in case of HTTP non 200', async () => {
    mock.get(configUrl, once({
      status: 404,
    }))

    const actualResponsebody = await configProvider.loadConfig(configUrl)
    expect(actualResponsebody).toEqual(defaultConfig)
    expect(window.localStorage.setItem.mock.calls.length).toBe(0)
  })

  it('provides default config in case of error', async () => {
    mock.get(configUrl, () => Promise.reject(new Error()))

    const actualResponsebody = await configProvider.loadConfig(configUrl)
    expect(actualResponsebody).toEqual(defaultConfig)
    expect(window.localStorage.setItem.mock.calls.length).toBe(0)
  })
})
