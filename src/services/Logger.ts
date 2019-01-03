import { EventEmitter } from 'events'

declare global {
  /* tslint:disable */
  interface Window {
    console: Console
  }
  /* tslint:enable */
}

export class Logger {

  public static EVENT_NAME = 'LOG_ENTRY_ADDED'

  public static instance = new Logger()

  public static interceptConsole(emitter: EventEmitter) {
    const instance = Logger.instance

    const console = {
      error: instance.log('error', emitter, window.console),
      info: instance.log('info', emitter, window.console),
      log: instance.log('log', emitter, window.console),
      warn: instance.log('warn', emitter, window.console),
    }
    window.console = console as Console
  }

  public logs: Array<{ channel: string, messages: string[] }>

  private constructor() {
    this.logs = []
  }

  public getLogs() {
    return this.logs
  }

  private log(channel: string, emitter: EventEmitter, windowConsole: Console) {
    return (...messages: string[]) => {
      windowConsole[channel](...messages)
      this.logs.unshift({ channel, messages })
      emitter.emit(Logger.EVENT_NAME, channel, messages)
    }
  }
}