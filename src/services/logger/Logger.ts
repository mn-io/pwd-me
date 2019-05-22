import { EventEmitter } from 'events'
import ILogger from './ILogger'
import { LogEntry } from './ILogger'

declare global {
  /* tslint:disable */
  interface Window {
    console: Console
  }
  /* tslint:enable */
}

class Logger implements ILogger {

  public readonly EVENT_NAME = 'LOG_ENTRY_ADDED'

  private logs: LogEntry[]

  constructor() {
    this.logs = []
  }

  public interceptConsole(emitter: EventEmitter) {
    // TODO: Not referencing complete console API, https://developer.mozilla.org/en-US/docs/Web/API/console
    const console = {
      error: this.log('error', emitter, window.console),
      info: this.log('info', emitter, window.console),
      log: this.log('log', emitter, window.console),
      warn: this.log('warn', emitter, window.console),
    }
    window.console = console as Console
  }

  public getLogs(): LogEntry[] {
    return this.logs
  }

  private log(channel: string, emitter: EventEmitter, windowConsole: Console) {
    return (...messages: string[]) => {
      windowConsole[channel](...messages)
      this.logs.unshift({ channel, messages })
      emitter.emit(this.EVENT_NAME, channel, messages)
    }
  }
}

export default new Logger()
