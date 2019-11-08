import {ENV_FILE_LOGGER} from "@app/ui/globals";
import {FileLogger} from "./file-logger";
import {ConsoleLogger} from "./console-logger";
import {Logger} from "./logging";

export class LoggerFactory {
    static get(nameOrClass?: string | (new(...args: any[]) => any)): Logger {
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

        if (ENV_FILE_LOGGER) {
            return new FileLogger(name);
        } else {
            return new ConsoleLogger(name);
        }
    }
}
