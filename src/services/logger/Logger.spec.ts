import emitter from '../Emitter'
import logger from "./Logger"


describe('Logger', () => {

    const listener = jest.fn()
    const originalLogWriter = console.log

    beforeEach(() => {
        emitter.addListener(logger.EVENT_NAME, listener)
    })

    afterEach(() => {
        console.log = originalLogWriter
        emitter.removeListener(logger.EVENT_NAME, listener)
    })

    it('happy path intercepting and message propagating', () => {
        const logTestInterceptor = jest.fn()
        console.log = logTestInterceptor

        const originalConsole = console

        expect(originalConsole).toBe(console)
        logger.interceptConsole(emitter)
        expect(originalConsole).not.toBe(console)

        expect(logger.getLogs()).toEqual([])
        expect(listener.mock.calls.length).toBe(0)

        expect(logTestInterceptor.mock.calls.length).toBe(0)
        console.log('Hello World')
        expect(logTestInterceptor.mock.calls.length).toBe(1)

        console.error('Hello Error')
        console.info('Hello Info')
        console.warn('Hello Warn')

        expect(logger.getLogs()).toEqual([
            { "channel": "warn", "messages": ["Hello Warn"] },
            { "channel": "info", "messages": ["Hello Info"] },
            { "channel": "error", "messages": ["Hello Error"] },
            { "channel": "log", "messages": ["Hello World"] },
        ])
        expect(listener.mock.calls.length).toBe(4)
    })
})
