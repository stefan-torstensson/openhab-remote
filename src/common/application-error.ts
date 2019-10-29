import {AppEvent} from "@app/ui/event-bus";

export class ApplicationError {
    static eventName = AppEvent.ERROR;

    private readonly _heading: string;
    private readonly _message: string;
    private readonly _exception: Error;

    constructor(heading: string, message: string, exception: Error) {
        this._heading = heading;
        this._message = message;
        this._exception = exception;
    }

    get message(): string {
        return this._message;
    }

    get heading(): string {
        return this._heading;
    }

    get error(): Error {
        return this._exception;
    }
}
