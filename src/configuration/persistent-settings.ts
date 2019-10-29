import {AppSettings} from "@app/configuration/app-settings";
import {inject} from "aurelia-dependency-injection";
import {Configuration} from "@app/configuration/configuration";


@inject(Configuration)
export class PersistentSettings extends AppSettings {
    private storage: Configuration;

    constructor(storage: Configuration) {
        super();
        this.storage = storage;
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
        return this.storage.get("username");
    }

    set username(value: string) {
        this.storage.set("username", value);
    }

    get password() {
        return this.storage.get("password");
    }

    set password(value: string) {
        this.storage.set("password", value);
    }

}
