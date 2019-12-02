import {SitemapState} from "@app/api";
import {Item, Widget} from "@app/api/openhab-types";

export class FakeSitemapState extends SitemapState {
    pageTitle: string = "";
    readonly widgets: Widget[] = [];

    postUpdate(item: Item, state: string): Promise<void> {
        console.log(`FakeSitemapState.postUpdate(${item.link}, ${state})`);
        return Promise.resolve();
    }

    setActivePage(sitemapName: string, pageId: string): Promise<void> {
        console.log(`FakeSitemapState.setActivePage(${sitemapName}, ${pageId})`);
        return Promise.resolve();
    }

    stop(): void {
        console.log("FakeSitemapState.stop()");
    }

}
