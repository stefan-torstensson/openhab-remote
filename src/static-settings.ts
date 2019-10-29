import {AppSettings} from "@app/configuration/app-settings";

export class StaticSettings extends AppSettings {
    public get remoteUrl(): string {
        return "http://raspberry/";
    }

    public get sitemapName(): string {
        return "home";
    }

    password: string = null;
    username: string = null;
}
