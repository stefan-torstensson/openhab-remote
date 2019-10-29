import {inject} from "aurelia-dependency-injection";
import {Configuration} from "@app/configuration/configuration";

@inject(global.localStorage)
export class LocalStorage implements Configuration {
    private readonly localStorage: Storage;

    constructor(localStorage: Storage) {
        this.localStorage = localStorage;
    }

    get<T>(key: string, defaultValue?: T): T {
        const item = this.localStorage.getItem(key);
        if (item) {
            return JSON.parse(item) as T;
        }
        return null;
    }

    set<T>(key: string, value: T): void {
        this.localStorage.setItem(key, JSON.stringify(value));
    }

    remove(key: string): void {
        this.localStorage.removeItem(key);
    }
}
