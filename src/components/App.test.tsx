import * as React from 'react'
import renderer from 'react-test-renderer'
import mock, { once } from 'xhr-mock'
import config from './../DefaultConfig'
import App from './App'

describe('', () => {

  beforeEach(() => mock.setup())

  afterEach(() => mock.teardown())

  it('renders without crashing', () => {
    mock.get('config.json', once({
      body: JSON.stringify(config),
      status: 200,
    }))

    const tree = renderer
      .create(<App />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

})
