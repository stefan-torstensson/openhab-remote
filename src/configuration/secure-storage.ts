import {inject} from "aurelia-dependency-injection";
import {Configuration} from "@app/configuration/configuration";
import {JsonSerializer} from "@app/configuration/json-serializer";

@inject(tizen.keymanager, JsonSerializer)
export class SecureStorage implements Configuration {
    private readonly keyManager: org.tizen.KeyManager;
    private readonly serializer: JsonSerializer;
    private readonly cache: { [key: string]: any };

    constructor(keyManager: org.tizen.KeyManager, serializer: JsonSerializer) {
        this.keyManager = keyManager;
        this.serializer = serializer;
        this.cache = {};
    }

    get<T>(key: string, targetType?: new (...args: any[]) => T): T | any {
        if (this.cache.hasOwnProperty(key)) {
            return this.cache[key];
        }
        let value: T = null;
        if (this.exists(key)) {
            const data = this.keyManager.getData({name: key});
            value = this.serializer.deserialize(data);
        }
        return this.cache[key] = value;
    }

    set<T>(key: string, value: T): void {
        this.remove(key);
        this.keyManager.saveData(key, this.serializer.serialize(value));
    }

    remove(key: string): void {
        delete this.cache[key];
        if (this.exists(key)) {
            this.keyManager.removeData({name: key});
        }
    }

    private exists(key: string): boolean {
        return this.keyManager.getDataAliasList().some(entry => entry.name === key);
    }
}
