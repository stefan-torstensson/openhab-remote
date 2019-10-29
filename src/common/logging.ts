export enum LogLevel {
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    NONE = 5
}

let logLevel: LogLevel = LogLevel.ERROR;

export class Logger {
    private readonly name: string;

    constructor(loggerName: string) {
        this.name = loggerName + ": ";
    }

    debug(...args: any[]): void {
        if (logLevel <= LogLevel.DEBUG) {
            console.debug(this.name, ...args);
        }
    }

    info(...args: any[]): void {
        if (logLevel <= LogLevel.INFO) {
            console.info(this.name, ...args);
        }
    }

    warn(...args: any[]): void {
        if (logLevel <= LogLevel.WARN) {
            console.warn(this.name, ...args);
        }
    }

    error(...args: any[]): void {
        if (logLevel <= LogLevel.ERROR) {
            console.error(this.name, ...args);
        }
    }
}

export class LoggerFactory {

    static set logLevel(value: LogLevel) {
        logLevel = value;
    }

    static get logLevel(): LogLevel {
        return logLevel;
    }

    static get(nameOrClass?: string | (new(...args: any[]) => any)) {
        let name = null;
        if (!nameOrClass) {
            name = "";
        } else if (typeof nameOrClass === "string") {
            name = nameOrClass;
        } else if (nameOrClass.constructor) {
            name = nameOrClass.name;
        } else {
            name = nameOrClass.toString();
        }
        return new Logger(name);
    }
}

export const logger = LoggerFactory;
