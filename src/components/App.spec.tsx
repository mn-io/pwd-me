import { mount } from 'enzyme'
import * as React from 'react'
import renderer from 'react-test-renderer'
import Logger from '../services/logger/Logger'
import App from './App'

jest.mock('../services/configProvider/ConfigProvider')
// jest.mock('../services/logger/Logger')

describe('App', () => {

  xit('renders matching snapshot', async () => {
    const tree = renderer
      .create(<App />)

    expect(tree.toJSON()).toMatchSnapshot()

    tree.unmount()
  })

  it('does a full circle', async () => {
    const expectedLogs = [
      {
        channel: 'log',
        messages: ['Mocking config loading from config.json']
      },
    ]


    const wrapper = mount(<App />)

    await new Promise(resolve => setTimeout(() => {
      wrapper.update()

      expect(Logger.getLogs()).toEqual(expectedLogs)

      // console.log('', wrapper.html())
      resolve()
    }))

  })
})
