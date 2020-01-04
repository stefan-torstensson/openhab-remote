import {inject} from "aurelia-dependency-injection";
import {Configuration} from "@app/configuration/configuration";
import {JsonSerializer} from "@app/configuration/json-serializer";

@inject(global.localStorage, JsonSerializer)
export class LocalStorage implements Configuration {
    private readonly localStorage: Storage;
    private serializer: JsonSerializer;

    constructor(localStorage: Storage, serializer: JsonSerializer) {
        this.localStorage = localStorage;
        this.serializer = serializer;
    }

    get<T>(key: string, targetType?: new (...args: any[]) => T): T | any {
        const item = this.localStorage.getItem(key);
        return this.serializer.deserialize(item, targetType);
    }

    set<T>(key: string, value: T): void {
        this.localStorage.setItem(key, this.serializer.serialize(value));
    }

    remove(key: string): void {
        this.localStorage.removeItem(key);
    }
}
