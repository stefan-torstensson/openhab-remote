import {inject} from "aurelia-dependency-injection";
import {parse} from "url";
import {logger} from "@app/common/logging";
import {UpdateEvent} from "./update-event";
import {EventSourceListener} from "./event-source-listener";
import {Subscription} from "./subscription";
import {SitemapClient} from "../sitemap-client";
import {Configuration} from "@app/configuration";
import {AppEvent, PubSub} from "@app/ui/event-bus";

export interface SubscriptionResponse {
    status: string;
    context: {
        headers: {
            Location: string[]
        }
    };
}

export abstract class SitemapSubscriber {
    public abstract stop(): void;
    public abstract refreshSubscription(): Promise<void>;
    public abstract subscribeTo(sitemapName: string, pageId: string): Promise<void>;
    public abstract onUpdate(f: (e: UpdateEvent) => void): void;
    public abstract get subscriptionId(): string;
}

@inject(EventSourceListener, SitemapClient, Configuration, PubSub)
export class OpenhabSitemapSubscriber extends SitemapSubscriber {
    private readonly log = logger.get(OpenhabSitemapSubscriber);
    private _sitemapName: string;
    private _pageId: string;
    private _subscription: Subscription;
    private _eventSource: EventSourceListener;
    private _updateEventListener: (e: UpdateEvent) => void;
    private _sitemapClient: SitemapClient;
    private _config: Configuration;
    private _pubsub: PubSub;
    private _emitTimeout: number;

    constructor(eventSource: EventSourceListener, sitemapClient: SitemapClient, config: Configuration, pubsub: PubSub) {
        super();
        this._eventSource = eventSource;
        this._sitemapClient = sitemapClient;
        this._config = config;
        this._pubsub = pubsub;
        this._eventSource.onEvent(this.onEventMessage.bind(this));
        this._eventSource.onError(this.onEventSourceError.bind(this));
    }

    get subscriptionId(): string {
        return this._subscription && this._subscription.subscriptionId;
    }

    async subscribeTo(sitemapName: string, pageId: string): Promise<void> {
        if (sitemapName !== this._sitemapName && pageId !== this._pageId) {
            this.stop();
            this._pageId = pageId;
            this._sitemapName = sitemapName;
        }
        this.emitActive(await this.startEventSource());
    }

    stop() {
        this._eventSource.stop();
        this._subscription = null;
    }

    async refreshSubscription(): Promise<void> {
        this.log.info("Refreshing subscription");
        this.stop();
        this.emitActive(await this.startEventSource(true));
    }

    onUpdate(f: (e: UpdateEvent) => void) {
        this._updateEventListener = f;
    }

    private async startEventSource(refresh: boolean = false): Promise<boolean> {
        if (this._eventSource.started) {
            return true;
        }
        if (!(this._pageId && this._sitemapName)) {
            return false;
        }

        this._subscription = await this.getSubscription(refresh);
        if (this._subscription) {
            const url = parse(this._subscription.url);
            url.query = {
                sitemap: this._sitemapName,
                pageid: this._pageId
            };
            this._eventSource.start(url.format());
            return true;
        }

        return false;
    }

    private async getSubscription(refresh: boolean = false): Promise<Subscription> {
        let subscription = this._config.get("subscription", Subscription);
        const isValid = subscription && this._sitemapClient.onSameHost(subscription.url);
        if (refresh || !isValid) {
            subscription = await this.createSubscription();
            this._config.set("subscription", subscription);
        }
        return subscription;
    }

    private async createSubscription(): Promise<Subscription> {
        this.log.info(`Creating subscription`);
        let response: SubscriptionResponse;
        try {
            response = await this._sitemapClient.post("sitemaps/events/subscribe");
        } catch (e) {
            this.log.warn("Failed creating subscription", e);
            return null;
        }
        if (response.status === "CREATED") {
            const location = response.context.headers.Location[0];
            return new Subscription(location);
        }
        this.log.warn("Failed creating subscription - unknown response");
        return null;
    }

    private onEventMessage(e: any) {
        this.log.debug("Received event:", e);
        const receivedData = JSON.parse(e.data) as UpdateEvent;
        if (receivedData.item && this._updateEventListener) {
            this._updateEventListener(receivedData);
        }
    }

    private onEventSourceError(_e: any) {
        this.stop();
        this.emitActive(false);
    }

    private emitActive(active: boolean) {
        if (this._emitTimeout) {
            global.clearTimeout(this._emitTimeout);
            this._emitTimeout = null;
        }
        this._emitTimeout = global.setTimeout(() => {
            this._pubsub.$emit(AppEvent.SUBSCRIPTION_ACTIVE_CHANGE, active);
        }, active ? 0 : 1000);
    }

}

