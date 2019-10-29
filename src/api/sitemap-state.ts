import {inject} from "aurelia-dependency-injection";
import {Page, Sitemap, Widget} from "./openhab-types";
import {SitemapClient} from "./sitemap-client";
import {SitemapSubscriber} from "./subscription/sitemap-subscriber";
import {assign} from "./util";
import {AppEvent, PubSub} from "../ui/event-bus";
import {logger} from "../common/logging";
import {UpdateEvent} from "./subscription/update-event";
import {synchronized} from "@app/common/synchronized";
import {loadingIndication} from "@app/ui/loading-state";

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

    private sitemap: Sitemap;
    private currentPage: Page;
    private client: SitemapClient;
    private sitemapSubscriber: SitemapSubscriber;
    private _widgets: Widget[] = [];

    constructor(client: SitemapClient, sitemapSubscriber: SitemapSubscriber, pubsub: PubSub) {
        this.client = client;
        this.sitemapSubscriber = sitemapSubscriber;
        this.sitemapSubscriber.onUpdate(this.updateWidget.bind(this));
        pubsub.$on(AppEvent.VISIBILITY_CHANGE, this.visibilityChange.bind(this));
    }

    get widgets(): Widget[] {
        return this._widgets;
    }

    stop() {
        this.sitemapSubscriber.stop();
    }

    async restart(): Promise<void> {
        await this.sitemapSubscriber.start();
        return this.refreshActivePage();
    }

    async setSitemap(name: string): Promise<Sitemap> {
        if (!this.sitemap || this.sitemap.name !== name) {
            this.sitemap = await this.client.getSitemap(name);
            await this.sitemapSubscriber.subscribeTo(this.sitemap.name, this.sitemap.homepage.id);
        }
        return this.sitemap;
    }

    @synchronized()
    @loadingIndication()
    async setActivePage(sitemapName: string, pageId: string): Promise<void> {
        await this.setSitemap(sitemapName);
        this.currentPage = await this.client.getPage(sitemapName, pageId, this.sitemapSubscriber.subscriptionId);
        this.pageTitle = this.currentPage.title;
        this.setWidgets(this.currentPage.widgets);
    }

    getWidget(widgetId: string): Widget {
        return SitemapState.findWidgetById(this.widgets, widgetId);
    }

    private setWidgets(value: Widget[]) {
        this._widgets.splice(0);
        this._widgets.push(...value);
    }

    private async refreshActivePage(): Promise<void> {
        if (this.currentPage) {
            return this.setActivePage(this.sitemap.name, this.currentPage.id);
        }
    }

    private updateWidget(e: UpdateEvent) {
        log.debug(`Updating ${e.widgetId} on page ${e.pageId}`);
        if (this.currentPage && this.currentPage.id === e.pageId) {
            const widget = SitemapState.findWidgetById(this.widgets, e.widgetId);
            assign(widget.item, e.item);
            if (widget.label !== e.label) {
                widget.label = e.label;
            }
        }
    }

    private visibilityChange(state: VisibilityState) {
        switch (state) {
            case "visible":
                // noinspection JSIgnoredPromiseFromCall
                this.restart();
                break;
            case "hidden":
                this.stop();
                break;
        }
    }

}

const log = logger.get("SitemapState");
