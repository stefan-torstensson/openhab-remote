import {getLogLevel, Logger} from "./logging";
import {LogLevel} from "./log-level";
import {container} from "@app/ui/ioc";

export class FileWriter {

    private fileHandle: org.tizen.FileStream;

    async write(message: string) {
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

export class FileLogger extends Logger {
    private readonly name: string;

    private readonly fileWriter: FileWriter;

    constructor(name: string) {
        super();
        this.name = name;
        this.fileWriter = container.get(FileWriter);
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

    async write(logLevel: LogLevel, ...text: any[]) {
        if (logLevel < getLogLevel()) {
            return;
        }
        const timestamp = new Date().toLocaleString("sv-SE");
        const level = LogLevel[logLevel];
        const message = Logger.format(`${timestamp}  ${level}: ${this.name}:`, ...text) + "\n";
        console.log(message);
        await this.fileWriter.write(message);
    }

}

