import {inject} from "aurelia-dependency-injection";
import {parse} from "url";
import {logger} from "@app/common/logging";
import {UpdateEvent} from "./update-event";
import {EventSourceListener} from "./event-source-listener";
import {Subscription} from "./subscription";
import {SitemapClient} from "../sitemap-client";
import {Configuration} from "@app/configuration";

export abstract class SitemapSubscriber {
    public abstract start(): Promise<boolean>;

    public abstract stop(): void;

    public abstract subscribeTo(sitemapName: string, pageId: string): Promise<boolean>;

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

    subscribeTo(sitemapName: string, pageId: string): Promise<boolean> {
        this.stop();
        this._pageId = pageId;
        this._sitemapName = sitemapName;
        return this.start();
    }

    async start(): Promise<boolean> {
        if (!(this._pageId && this._sitemapName) || this._eventSource.started) {
            return true;
        }
        const params = {
            pageid: this._pageId,
            sitemap: this._sitemapName
        };
        return await this.startEventSource(params) || await this.startEventSource(params, true);
    }

    stop() {
        this._eventSource.stop();
        this._subscription = null;
    }

    onUpdate(f: (e: UpdateEvent) => void) {
        this._listener = f;
    }

    get subscriptionId(): string {
        return this._subscription && this._subscription.subscriptionId;
    }

    private async startEventSource(params: { [k: string]: string }, refresh: boolean = false) {
        const subscription = await this.getSubscription(refresh);
        if (!subscription) {
            return false;
        }
        const url = parse(subscription.url);
        url.query = params;
        try {
            log.info("Starting event listener");
            await this._eventSource.start(url.format());
            this._subscription = subscription;
            return true;
        } catch (e) {
            log.warn("Failed opening event source", e);
            this._subscription = null;
            return false;
        }
    }

    private async getSubscription(refresh: boolean = false) {
        let subscription = this._config.get("subscription", Subscription);
        const isValid = subscription && this._sitemapClient.onSameHost(subscription.url);
        if (refresh || !isValid) {
            subscription = await this.createSubscription();
            this._config.set("subscription", subscription);
        }
        return subscription;
    }

    private async createSubscription(): Promise<Subscription> {
        log.info(`Creating subscription`);
        let response: SubscriptionResponse;
        try {
            response = await this._sitemapClient.post("sitemaps/events/subscribe");
        } catch (e) {
            log.warn("Failed creating subscription", e);
            return null;
        }
        if (response.status === "CREATED") {
            const location = response.context.headers.Location[0];
            return new Subscription(location);
        }
        log.warn("Failed creating subscription - unknown response");
        return null;
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
