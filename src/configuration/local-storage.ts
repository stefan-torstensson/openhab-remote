import {inject} from "aurelia-dependency-injection";
import {Configuration} from "@app/configuration/configuration";

@inject(global.localStorage)
export class LocalStorage implements Configuration {
    private readonly localStorage: Storage;

    constructor(localStorage: Storage) {
        this.localStorage = localStorage;
    }

    get<T>(key: string, targetType?: new (...args: any[]) => T): T | any {
        const item = this.localStorage.getItem(key);
        if (item) {
            const data = JSON.parse(item);
            if (targetType) {
                const instance = Object.create(targetType.prototype);
                return Object.assign(instance, data);
            }
            return data;
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
