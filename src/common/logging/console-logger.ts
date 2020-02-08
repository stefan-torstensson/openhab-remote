import {getLogLevel, Logger} from "./logging";
import {LogLevel} from "./log-level";
import {ENV_BROWSER_CONSOLE} from "@app/ui/globals";

export class ConsoleLogger extends Logger {
    private readonly name: string;

    constructor(loggerName: string) {
        super();
        this.name = loggerName + ":";
    }

    debug(...args: any[]): void {
        if (getLogLevel() <= LogLevel.DEBUG) {
            this.write(console.debug, ...args);
        }
    }

    info(...args: any[]): void {
        if (getLogLevel() <= LogLevel.INFO) {
            this.write(console.info, ...args);
        }
    }

    warn(...args: any[]): void {
        if (getLogLevel() <= LogLevel.WARN) {
            this.write(console.warn, ...args);
        }
    }

    error(...args: any[]): void {
        if (getLogLevel() <= LogLevel.ERROR) {
            this.write(console.error, ...args);
        }
    }

    private write(logMethod: (...m: any[]) => void, ...args: any[]): void {
        if (ENV_BROWSER_CONSOLE) {
            logMethod.call(console, this.name, ...args);
        } else {
            logMethod.call(console, Logger.format(this.name, ...args));
        }
    }
}
