import {getLogLevel, Logger} from "./logging";
import {LogLevel} from "./log-level";

export class ConsoleLogger extends Logger {
    private readonly name: string;

    constructor(loggerName: string) {
        super();
        this.name = loggerName + ": ";
    }

    debug(...args: any[]): void {
        if (getLogLevel() <= LogLevel.DEBUG) {
            console.debug(this.name, ...args);
        }
    }

    info(...args: any[]): void {
        if (getLogLevel() <= LogLevel.INFO) {
            console.info(this.name, ...args);
        }
    }

    warn(...args: any[]): void {
        if (getLogLevel() <= LogLevel.WARN) {
            console.warn(this.name, ...args);
        }
    }

    error(...args: any[]): void {
        if (getLogLevel() <= LogLevel.ERROR) {
            console.error(this.name, ...args);
        }
    }
}
