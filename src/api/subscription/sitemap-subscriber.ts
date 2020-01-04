import {inject} from "aurelia-dependency-injection";
import {logger} from "@app/common/logging";
import {UpdateEvent} from "./update-event";
import {EventSourceListener} from "./event-source-listener";
import {Subscription} from "./subscription";
import {SitemapClient} from "../sitemap-client";
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

    public abstract start(): void;

    public abstract onUpdate(f: (e: UpdateEvent) => void): void;

    public abstract getSubscriptionId(): Promise<string>;
}

@inject(EventSourceListener, SitemapClient, PubSub)
export class OpenhabSitemapSubscriber extends SitemapSubscriber {
    private readonly log = logger.get(OpenhabSitemapSubscriber);
    private _subscription: Subscription;
    private _eventSource: EventSourceListener;
    private _updateEventListener: (e: UpdateEvent) => void;
    private _sitemapClient: SitemapClient;
    private _pubsub: PubSub;
    private _emitTimeout: number;

    constructor(eventSource: EventSourceListener, sitemapClient: SitemapClient, pubsub: PubSub) {
        super();
        this._eventSource = eventSource;
        this._sitemapClient = sitemapClient;
        this._pubsub = pubsub;
        this._eventSource.onEvent(this.onEventMessage.bind(this));
        this._eventSource.onError(this.onEventSourceError.bind(this));
    }

    async getSubscriptionId(): Promise<string> {
        if (!this._subscription) {
            this._subscription = await this.createSubscription();
        }
        return this._subscription && this._subscription.subscriptionId;
    }

    start(): void {
        this.emitActive(this.startEventSource());
    }

    stop(): void {
        this._eventSource.stop();
        this._subscription = null;
    }

    onUpdate(f: (e: UpdateEvent) => void) {
        this._updateEventListener = f;
    }

    private startEventSource(): boolean {
        if (this._eventSource.started) {
            return true;
        }
        if (!this._subscription) {
            return false;
        }
        this._eventSource.start(this._subscription.url);
        return true;
    }

    private async createSubscription(): Promise<Subscription> {
        this.log.info(`Creating subscription`);
        let response: SubscriptionResponse;
        try {
            response = await this._sitemapClient.post("sitemaps/events/subscribe", {});
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

