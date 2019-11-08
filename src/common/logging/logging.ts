import {ENV_LOGLEVEL} from "@app/ui/globals";
import {LogLevel} from "@app/common/logging/log-level";

global.__logLevel = ENV_LOGLEVEL;

export function getLogLevel(): LogLevel {
    return global.__logLevel;
}

export function setLogLevel(value: LogLevel): void {
    global.__logLevel = value;
}

export abstract class Logger {
    abstract debug(...args: any[]): void;

    abstract info(...args: any[]): void;

    abstract warn(...args: any[]): void;

    abstract error(...args: any[]): void;
}
