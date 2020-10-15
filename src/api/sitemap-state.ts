import {inject} from "aurelia-dependency-injection";
import {Item, Page, Widget} from "./openhab-types";
import {SitemapClient} from "./sitemap-client";
import {SitemapSubscriber} from "./subscription/sitemap-subscriber";
import {assign} from "@app/common/assign";
import {AppEvent, PubSub} from "../ui/event-bus";
import {logger} from "../common/logging";
import {UpdateEvent} from "./subscription/update-event";
import {synchronized} from "@app/common/synchronized";
import {loadingIndication} from "@app/ui/loading-state";
import {ApplicationError, ResponseError} from "@app/common/application-error";
import {findWidgetById} from "./widget-utils";
import {PageCache} from "./page-cache";

export abstract class SitemapState {
    abstract pageTitle: string;
    abstract readonly widgets: Widget[];

    abstract stop(): void;

    abstract setActivePage(sitemapName: string, pageId: string): Promise<void>;

    abstract postUpdate(item: Item, state: string): Promise<void> ;
}

@inject(SitemapClient, SitemapSubscriber, PageCache, PubSub)
export class OpenhabSitemapState implements SitemapState {
    public pageTitle: string;
    private readonly log = logger.get(OpenhabSitemapState);
    private pubsub: PubSub;
    private currentPage: Page;
    private client: SitemapClient;
    private sitemapSubscriber: SitemapSubscriber;
    private _widgets: Widget[] = [];
    private pageCache: PageCache;

    constructor(client: SitemapClient, sitemapSubscriber: SitemapSubscriber, pageCache: PageCache, pubsub: PubSub) {
        this.client = client;
        this.sitemapSubscriber = sitemapSubscriber;
        this.sitemapSubscriber.onUpdate(this.updateWidget.bind(this));
        this.pubsub = pubsub;
        this.pageCache = pageCache;
        pubsub.$on(AppEvent.ONLINE_CHANGE, this.onOnlineChange.bind(this));
    }

    get widgets(): Widget[] {
        return this._widgets;
    }

    stop() {
        this.sitemapSubscriber.stop();
    }

    @loadingIndication()
    @synchronized()
    async setActivePage(sitemapName: string, pageId: string): Promise<void> {
        this.log.info(`setActivePage(${sitemapName}, ${pageId})`);
        try {
            const cachedPage = this.pageCache.get(sitemapName, pageId);
            if (cachedPage) {
                this.setCurrentPage(cachedPage);
            }
            const page = await this.getPage(sitemapName, pageId);
            this.pageCache.set(sitemapName, pageId, page);
            this.setCurrentPage(page);
        } catch (e) {
            this.log.error("setActivePage failed:", e);
            this.pubsub.$emit(ApplicationError.eventName, e);
        }
    }

    private setCurrentPage(page: Page) : void {
        this.currentPage = page;
        this.pageTitle = page.title;
        this.setWidgets(page.widgets);
    }

    async postUpdate(item: Item, state: string): Promise<void> {
        const link = (item && item.link);
        if (link && state) {
            await this.client.post(link, state);
        }
    }

    private async getPage(sitemapName: string, pageId: string): Promise<Page> {
        try {
            // Sitemap subscriptions seems very much implemented with BasicUI in mind.

            // 1. A subscription is required to get sitemap updates
            const subscriptionId = await this.sitemapSubscriber.getSubscriptionId();

            // 2. The page request needs the subscriptionId to attach the page to the subscription
            const page = await this.client.getPage(sitemapName, pageId, subscriptionId);

            // 3. The subscription isn't valid until a page has been attached.
            this.sitemapSubscriber.start();

            return page;
        } catch (e) {
            if (e instanceof ResponseError && e.statusCode === 400) {
                await this.sitemapSubscriber.stop();
                return await this.client.getPage(sitemapName, pageId);
            }
            throw e;
        }
    }

    private setWidgets(value: Widget[]) {
        this._widgets.splice(0);
        this._widgets.push(...value);
    }

    private updateWidget(e: UpdateEvent) {
        this.log.debug(`Updating ${e.widgetId} on page ${e.pageId}`);
        if (this.currentPage && this.currentPage.id === e.pageId) {
            const widget = findWidgetById(this.widgets, e.widgetId);
            if (widget && widget.item) {
                assign(widget.item, e.item);
                if (widget.label !== e.label) {
                    widget.label = e.label;
                }
            }
        }
    }

    private onOnlineChange(online: boolean) {
        if (!online) {
            this.stop();
        }
    }
}
