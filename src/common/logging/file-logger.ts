import {getLogLevel, Logger} from "./logging";
import {LogLevel} from "./log-level";

export class FileLogger extends Logger {
    private static format(...args: any[]): string {
        return args.map(arg => {
            if (typeof arg === "string") {
                return arg;
            }
            if (typeof arg === "number") {
                return arg.toString();
            }
            return JSON.stringify(arg);
        }).join(" ");
    }

    private fileHandle: org.tizen.FileStream;
    private readonly name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }

    debug(...args: any[]): void {
        this.write(LogLevel.DEBUG, ...args);
    }

    error(...args: any[]): void {
        this.write(LogLevel.ERROR, ...args);
    }

    info(...args: any[]): void {
        this.write(LogLevel.INFO, ...args);
    }

    warn(...args: any[]): void {
        this.write(LogLevel.WARN, ...args);
    }

    private async write(logLevel: LogLevel, ...text: any[]) {
        if (logLevel < getLogLevel()) {
            return;
        }
        const level = LogLevel[logLevel];
        const message = FileLogger.format(`${level}: ${this.name}:`, ...text) + "\n";
        console.log(message);
        if (typeof tizen !== "undefined") {
            const fileStream = await this.getFileStream();
            fileStream.write(message);
        }
    }

    private getFileStream(): Promise<org.tizen.FileStream> {
        if (this.fileHandle) {
            return Promise.resolve(this.fileHandle);
        }
        return new Promise((resolve, reject) => {
            tizen.filesystem.resolve("documents", dir => {
                let logfile: org.tizen.File;
                try {
                    logfile = dir.resolve("openhab.log");
                } catch (e) {
                    logfile = dir.createFile("openhab.log");
                }
                logfile.openStream("a", stream => {
                    this.fileHandle = stream;
                    resolve(this.fileHandle);
                }, reject);
            }, reject);
        });
    }

}

