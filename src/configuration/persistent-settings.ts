import {AppSettings} from "@app/configuration/app-settings";
import {inject} from "aurelia-dependency-injection";
import {Configuration} from "@app/configuration/configuration";
import {LocalStorage} from "@app/configuration/local-storage";
import {SecureStorage} from "@app/configuration/secure-storage";


@inject(LocalStorage, SecureStorage)
export class PersistentSettings extends AppSettings {
    private storage: Configuration;
    private secureStorage: Configuration;

    constructor(storage: Configuration, secureStorage: Configuration) {
        super();
        this.storage = storage;
        this.secureStorage = secureStorage;
    }

    get remoteUrl(): string {
        return this.storage.get("remoteUrl");
    }

    set remoteUrl(value: string) {
        this.storage.set("remoteUrl", value);
    }

    get sitemapName(): string {
        return this.storage.get("sitemapName");
    }

    set sitemapName(value: string) {
        this.storage.set("sitemapName", value);
    }

    get username() {
        return this.secureStorage.get("username");
    }

    set username(value: string) {
        this.secureStorage.set("username", value);
    }

    get password() {
        return this.secureStorage.get("password");
    }

    set password(value: string) {
        this.secureStorage.set("password", value);
    }

}
