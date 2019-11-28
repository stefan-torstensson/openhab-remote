import {Page, Sitemap} from "./openhab-types";
import {parse, resolve} from "url";
import {inject} from "aurelia-dependency-injection";
import {PubSub} from "@app/ui/event-bus";
import {NetworkError, ResponseError} from "@app/common/application-error";
import {AppSettings} from "@app/configuration/app-settings";
import {logger, Logger} from "@app/common/logging";
import {ResponseParser, JsonResponseParser} from "./response-parser";

export enum VerificationResult {
    OK,
    INVALID_URL,
    BAD_RESPONSE,
    NETWORK_ERROR,
    NOT_OPENHAB
}

@inject("fetch", JsonResponseParser, PubSub, AppSettings)
export class SitemapClient {
    private static readonly URL_VALIDATOR = new RegExp("^https?:\/\/.*", "i");
    private static readonly REST_PATH: string = "rest/";

    private readonly log = logger.get(SitemapClient);
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

    async verifyUrl(url: string): Promise<VerificationResult> {
        if (!SitemapClient.URL_VALIDATOR.test(url)) {
            return VerificationResult.INVALID_URL;
        }
        const resolvedUrl = resolve(url, SitemapClient.REST_PATH);
        let response = null;
        try {
            response = await this.fetch(resolvedUrl);
        } catch (e) {
            this.log.error("Network error", e.message);
            return VerificationResult.NETWORK_ERROR;
        }
        if (!response.ok) {
            return VerificationResult.BAD_RESPONSE;
        }
        return await this.responseParser.looksLikeOpenhab(response) ?
            VerificationResult.OK :
            VerificationResult.NOT_OPENHAB;
    }

    onSameHost(url: string): boolean {
        try {
            return url && parse(url).host === parse(this.appSettings.remoteUrl).host;
        } catch (e) {
            this.log.error("Failed parsing urls", e.message);
        }
        return false;
    }

    getSitemaps(): Promise<Sitemap[]> {
        return this.get<Sitemap[]>(this.sitemapPath());
    }

    getSitemap(sitemapName: string): Promise<Sitemap> {
        return this.get<Sitemap>(this.sitemapPath(sitemapName));
    }

    getPage(sitemapName: string, pageId: string, subscriptionId?: string): Promise<Page> {
        return this.get<Page>(this.sitemapPath(sitemapName, pageId), subscriptionId);
    }

    get<T>(path: string, subscriptionId?: string): Promise<T> {
        const url = parse(resolve(this.baseUrl, path));
        if (subscriptionId) {
            url.query = {subscriptionid: subscriptionId};
        }
        return this.execute<T>(new Request(url.format()));
    }

    post<T>(path: string, data?: any): Promise<T> {
        const request = new Request(new URL(path, this.baseUrl).href, {
            method: "POST",
            body: data
        });
        return this.execute<T>(request);
    }

    private async execute<T>(request: Request): Promise<T> {
        let response: Response;
        try {
            response = await this.fetch(request);
        } catch (e) {
            this.log.error("Fetch error", e.message);
            throw new NetworkError(`Could not connect to ${request.url}`, e);
        }
        if (!response.ok) {
            const error = await this.tryGetOpenhabError(response);
            const message = error.message || "";
            this.log.error(`Failed request: ${response.status}, ${message || request.url}`);
            const httpError = response.statusText || "HTTP error " + response.status;
            throw new ResponseError(message || `${request.url} returned ${httpError}`, response.status);
        }
        return this.responseParser.parse<T>(response);
    }

    private async tryGetOpenhabError(response: Response): Promise<any> {
        try {
            const data = await response.json();
            return data && data.error || {};
        } catch {
            return {};
        }
    }

    private get baseUrl(): string {
        return resolve(this.appSettings.remoteUrl, SitemapClient.REST_PATH);
    }

    private sitemapPath(...path: string[]): string {
        return ["sitemaps"].concat(path).join("/");
    }
}

