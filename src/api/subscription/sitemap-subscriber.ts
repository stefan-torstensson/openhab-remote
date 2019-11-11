import {inject} from "aurelia-dependency-injection";
import {parse} from "url";
import {logger} from "@app/common/logging";
import {UpdateEvent} from "./update-event";
import {EventSourceListener} from "./event-source-listener";
import {Subscription} from "./subscription";
import {SitemapClient} from "../sitemap-client";
import {Configuration} from "@app/configuration";

export abstract class SitemapSubscriber {
    public abstract start(): Promise<void>;
    public abstract stop(): void;
    public abstract subscribeTo(sitemapName: string, pageId: string): Promise<void>;
    public abstract onUpdate(f: (e: UpdateEvent) => void): void;
    public abstract get subscriptionId(): string;
}

@inject(EventSourceListener, SitemapClient, Configuration)
export class OpenhabSitemapSubscriber extends SitemapSubscriber {
    private _sitemapName: string;
    private _pageId: string;
    private _subscription: Subscription;
    private _eventSource: EventSourceListener;
    private _listener: (e: UpdateEvent) => void;
    private _sitemapClient: SitemapClient;
    private _config: Configuration;

    constructor(eventSource: EventSourceListener, sitemapClient: SitemapClient, config: Configuration) {
        super();
        this._eventSource = eventSource;
        this._sitemapClient = sitemapClient;
        this._config = config;
        this._eventSource.onEvent(this.onEventMessage.bind(this));
    }

    subscribeTo(sitemapName: string, pageId: string): Promise<void> {
        this.stop();
        this._pageId = pageId;
        this._sitemapName = sitemapName;
        return this.start();
    }

    async start(): Promise<void> {
        if (!(this._pageId && this._sitemapName) || this._eventSource.started) {
            return;
        }
        const params = {
            pageid: this._pageId,
            sitemap: this._sitemapName
        };
        await this.startEventSource(params) || await this.startEventSource(params, true);
    }

    stop() {
        this._eventSource.stop();
    }

    onUpdate(f: (e: UpdateEvent) => void) {
        this._listener = f;
    }

    get subscriptionId(): string {
        return this.subscription && this.subscription.subscriptionId;
    }

    private get subscription(): Subscription {
        if (!this._subscription) {
            const url = this._config.get("subscription-url") as string;
            this._subscription = url ? new Subscription(url) : null;
        }
        return this._subscription;
    }

    private set subscription(subscription: Subscription) {
        this._subscription = subscription;
        this._config.set("subscription-url", subscription.url);
    }

    private async startEventSource(params: { [k: string]: string }, refresh: boolean = false) {
        const subscription = await this.getSubscription(refresh);
        const url = parse(subscription.url);
        url.query = params;
        try {
            log.info("Starting event listener");
            await this._eventSource.start(url.format());
            return true;
        } catch (e) {
            log.warn("Failed opening event source", e);
            return false;
        }
    }

    private async getSubscription(refresh: boolean = false) {
        const isValid = this.subscription && this._sitemapClient.onSameHost(this._subscription.url);
        if (refresh || !isValid) {
            this.subscription = await this.createSubscription();
        }
        return this.subscription;
    }

    private async createSubscription(): Promise<Subscription> {
        log.info(`Creating subscription`);
        const result = await this._sitemapClient.post("sitemaps/events/subscribe") as SubscriptionResponse;
        if (result.status === "CREATED") {
            const location = result.context.headers.Location[0];
            return new Subscription(location);
        }
        throw new Error("Failed creating subscription");
    }

    private onEventMessage(e: any) {
        log.debug("Received event:", e);
        const receivedData = JSON.parse(e.data) as UpdateEvent;
        if (receivedData.item && this._listener) {
            this._listener(receivedData);
        }
    }
}

interface SubscriptionResponse {
    status: string;
    context: {
        headers: {
            Location: string[]
        }
    };
}

const log = logger.get(OpenhabSitemapSubscriber);
