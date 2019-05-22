import { EventEmitter } from 'events'

export type LogEntry = { channel: string, messages: string[] }

export default interface ILogger {
    interceptConsole(emitter: EventEmitter): void
    getLogs(): LogEntry[]
}
