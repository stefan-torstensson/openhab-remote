import {LogLevel} from "@app/common/logging/log-level";

declare var FILE_LOGGER: boolean;
export const ENV_FILE_LOGGER: boolean = typeof (FILE_LOGGER) !== "undefined" ? FILE_LOGGER : false;

declare var LOG_LEVEL: string;
export const ENV_LOGLEVEL: LogLevel = typeof (LOG_LEVEL) !== "undefined" ?
    LogLevel[LOG_LEVEL.toUpperCase() as keyof typeof LogLevel] : LogLevel.ERROR;

declare var BROWSER_CONSOLE: boolean;
export const ENV_BROWSER_CONSOLE: boolean = typeof(BROWSER_CONSOLE) !== "undefined" ? BROWSER_CONSOLE : false;
