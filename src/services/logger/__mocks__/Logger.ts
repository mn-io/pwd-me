import { EventEmitter } from 'events'
import ILogger from '../ILogger'
import { LogEntry } from '../ILogger'

class Logger implements ILogger {
    public interceptConsole(emitter: EventEmitter) {
        // do nothing
    }

    public getLogs(): LogEntry[] {
        return []
    }

}

export default new Logger()
