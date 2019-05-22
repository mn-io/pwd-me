import * as React from 'react'
import renderer from 'react-test-renderer'
import App from './App'

jest.mock('../services/configProvider/ConfigProvider')
jest.mock('../services/logger/Logger')

describe('App', () => {
  it('renders without crashing', () => {
    const tree = renderer
      .create(<App />)
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
