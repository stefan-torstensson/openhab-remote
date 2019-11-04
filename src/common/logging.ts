export enum LogLevel {
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    NONE = 5
}

global.__logLevel = LogLevel.WARN;

export function getLogLevel(): LogLevel {
    return global.__logLevel;
}

export function setLogLevel(value: LogLevel): void {
    global.__logLevel = value;
}

export class Logger {
    private readonly name: string;

    constructor(loggerName: string) {
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

export class LoggerFactory {
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
