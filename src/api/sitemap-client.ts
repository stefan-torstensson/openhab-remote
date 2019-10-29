import {Page, Sitemap} from "./openhab-types";
import {parse, resolve} from "url";
import {inject} from "aurelia-dependency-injection";
import {PubSub} from "@app/ui/event-bus";
import {ApplicationError} from "@app/common/application-error";
import {AppSettings} from "@app/configuration/app-settings";
import {logger, Logger} from "@app/common/logging";
import {ResponseParser} from "./response-parser";

export enum VerificationResult {
    OK,
    INVALID_URL,
    BAD_RESPONSE,
    NETWORK_ERROR,
    NOT_OPENHAB
}

@inject("fetch", ResponseParser, PubSub, AppSettings)
export class SitemapClient {
    private static readonly log: Logger = logger.get(SitemapClient);
    private static readonly URL_VALIDATOR = new RegExp("^https?:\/\/.*", "i");
    private static readonly REST_PATH: string = "rest/";

    private readonly responseParser: ResponseParser;
    private readonly pubsub: PubSub;
    private readonly fetch: Fetch;
    private readonly appSettings: AppSettings;


    constructor(fetchClient: Fetch,
                responseParser: ResponseParser, pubsub: PubSub, appSettings: AppSettings) {
        this.fetch = fetchClient;
        this.responseParser = responseParser;
        this.pubsub = pubsub;
        this.appSettings = appSettings;
    }


    async getSitemaps(): Promise<Sitemap[]> {
        return await this.get(this.sitemapPath()) as Sitemap[];
    }

    async verifyUrl(url: string): Promise<VerificationResult> {
        if (!SitemapClient.URL_VALIDATOR.test(url)) {
            return VerificationResult.INVALID_URL;
        }
        const resolvedUrl = resolve(url, SitemapClient.REST_PATH);
        let response = null;
        try {
            response = await this.fetch(resolvedUrl);
        } catch (e) {
            SitemapClient.log.error("Network error", e);
            console.log("Error", e);
            return VerificationResult.NETWORK_ERROR;
        }
        if (!response.ok) {
            return VerificationResult.BAD_RESPONSE;
        }
        return this.responseParser.looksLikeOpenhab(response) ?
            VerificationResult.OK :
            VerificationResult.NOT_OPENHAB;
    }

    onSameHost(url: string): boolean {
        try {
            return url && parse(url).host === parse(this.appSettings.remoteUrl).host;
        } catch (e) {
            SitemapClient.log.error("Failed parsing urls", e);
        }
        return false;
    }

    async getSitemap(sitemapName: string): Promise<Sitemap> {
        return await this.get(this.sitemapPath(sitemapName)) as Sitemap;
    }

    async getPage(sitemapName: string, pageId: string, subscriptionId?: string): Promise<Page> {
        return await this.get(this.sitemapPath(sitemapName, pageId), subscriptionId) as Page;
    }

    get(path: string, subscriptionId?: string): Promise<any> {
        const url = parse(resolve(this.baseUrl, path));
        if (subscriptionId) {
            url.query = {subscriptionid: subscriptionId};
        }
        return this.fetch(url.format())
            .then(r => this.responseParser.parse(r))
            .catch(this.reportAndRethrow.bind(this, url.format()));
    }


    post(path: string, data?: any): Promise<any> {
        const url = new URL(path, this.baseUrl).href;
        const params = {
            method: "POST",
            body: data
        };
        return this.fetch(url, params)
            .then(r => this.responseParser.parse(r))
            .catch(this.reportAndRethrow.bind(this, url));

    }

    private get baseUrl(): string {
        return resolve(this.appSettings.remoteUrl, SitemapClient.REST_PATH);
    }

    private sitemapPath(...path: string[]): string {
        return ["sitemaps"].concat(path).join("/");
    }

    private reportAndRethrow(url: string, error: Error) {
        this.pubsub.$emit(ApplicationError.eventName,
            new ApplicationError(error.name, `${error.message}  ${url}`, error));
        throw error;
    }

}

