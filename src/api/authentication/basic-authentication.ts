import {inject} from "aurelia-dependency-injection";
import {AppSettings} from "@app/configuration/app-settings";
import {isNullOrEmpty} from "@app/common/string-utils";

export const AUTHORIZATION_HEADER = "Authorization";

class Header {
    name: string;
    value: string;
}

export abstract class AuthenticationProvider {

    setHeader(headers?: Headers): Headers {
        if (!headers) {
            headers = new Headers();
        }
        const authHeader = this.getAuthHeader();
        if (authHeader) {
            headers.append(authHeader.name, authHeader.value);
        }
        return headers;
    }

    abstract getAuthHeader(): Header;

    abstract createAuthHeader(username: string, password: string): Header;
}

@inject(AppSettings)
export class BasicAuthentication extends AuthenticationProvider {
    private readonly appSettings: AppSettings;

    constructor(appSettings: AppSettings) {
        super();
        this.appSettings = appSettings;
    }

    getAuthHeader(): Header {
        const {username, password} = this.appSettings;
        if (!isNullOrEmpty(username) && !isNullOrEmpty(password)) {
            return this.createAuthHeader(username, password);
        }
        return null;
    }

    createAuthHeader(username: string, password: string): Header {
        const credentials = btoa(`${username || ""}:${password || ""}`);
        return {
            name: AUTHORIZATION_HEADER,
            value: `Basic ${credentials}`
        };
    }
}
