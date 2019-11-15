import {inject} from "aurelia-dependency-injection";
import {Item, Page, Sitemap, Widget} from "./openhab-types";
import {SitemapClient} from "./sitemap-client";
import {SitemapSubscriber} from "./subscription/sitemap-subscriber";
import {assign} from "./util";
import {AppEvent, PubSub} from "../ui/event-bus";
import {logger} from "../common/logging";
import {UpdateEvent} from "./subscription/update-event";
import {synchronized} from "@app/common/synchronized";
import {loadingIndication} from "@app/ui/loading-state";
import {ApplicationError} from "@app/common/application-error";

@inject(SitemapClient, SitemapSubscriber, PubSub)
export class SitemapState {
    private static findWidgetById(widgets: Widget[], id: string): Widget {
        for (const widget of widgets) {
            if (widget.widgetId === id) {
                return widget;
            }
            if (id.startsWith(widget.widgetId)) {
                return SitemapState.findWidgetById(widget.widgets, id);
            }
        }
        return null;
    }

    public pageTitle: string;

    private readonly log = logger.get(SitemapState);
    private pubsub: PubSub;
    private sitemap: Sitemap;
    private currentPage: Page;
    private client: SitemapClient;
    private sitemapSubscriber: SitemapSubscriber;
    private _widgets: Widget[] = [];
    private _subscriptionActive: boolean = true;

    constructor(client: SitemapClient, sitemapSubscriber: SitemapSubscriber, pubsub: PubSub) {
        this.client = client;
        this.sitemapSubscriber = sitemapSubscriber;
        this.sitemapSubscriber.onUpdate(this.updateWidget.bind(this));
        this.pubsub = pubsub;
        pubsub.$on(AppEvent.ONLINE_CHANGE, this.onOnlineChange.bind(this));
    }

    get widgets(): Widget[] {
        return this._widgets;
    }

    stop() {
        this.sitemapSubscriber.stop();
    }

    @synchronized()
    @loadingIndication()
    async setActivePage(sitemapName: string, pageId: string): Promise<void> {
        this.log.info(`setActivePage(${sitemapName}, ${pageId})`);
        try {
            await this.setSitemap(sitemapName);
            this.currentPage = await this.client.getPage(sitemapName, pageId, this.sitemapSubscriber.subscriptionId);
            this.pageTitle = this.currentPage.title;
            this.setWidgets(this.currentPage.widgets);
        } catch (e) {
            this.log.error("setActivePage failed:", e);
            this.pubsub.$emit(ApplicationError.eventName, e);
        }
    }

    getWidget(widgetId: string): Widget {
        return SitemapState.findWidgetById(this.widgets, widgetId);
    }

    async postUpdate(item: Item, state: string): Promise<void> {
        const link = (item && item.link);
        if (link && state) {
            await this.client.post(link, state);
        }
    }

    private async setSitemap(name: string): Promise<Sitemap> {
        if (!this.sitemap || this.sitemap.name !== name) {
            this.sitemap = await this.client.getSitemap(name);
            this.emitSubscriptionState(
                await this.sitemapSubscriber.subscribeTo(this.sitemap.name, this.sitemap.homepage.id));
        } else {
            this.emitSubscriptionState(await this.sitemapSubscriber.start());
        }
        return this.sitemap;
    }

    private emitSubscriptionState(active: boolean) {
        if (this._subscriptionActive !== active) {
            this.pubsub.$emit(AppEvent.SUBSCRIPTION_ACTIVE_CHANGE, active);
        }
        this._subscriptionActive = active;
    }

    private setWidgets(value: Widget[]) {
        this._widgets.splice(0);
        this._widgets.push(...value);
    }

    private updateWidget(e: UpdateEvent) {
        this.log.debug(`Updating ${e.widgetId} on page ${e.pageId}`);
        if (this.currentPage && this.currentPage.id === e.pageId) {
            const widget = SitemapState.findWidgetById(this.widgets, e.widgetId);
            assign(widget.item, e.item);
            if (widget.label !== e.label) {
                widget.label = e.label;
            }
        }
    }

    private onOnlineChange(online: boolean) {
        if (!online) {
            this.stop();
        }
    }
}
