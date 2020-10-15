import {Page} from "@app/api/openhab-types";

export class PageCache {
    private cache: { [id: string]: Page } = {};
    private sitemapName: string;

    get(sitemapName: string, pageId: string) : Page {
        if (sitemapName === this.sitemapName) {
            return this.cache[pageId];
        }
        return null;
    }

    set(sitemapName: string, pageId:string, page:Page): Page {
        if (sitemapName !== this.sitemapName) {
            this.sitemapName = sitemapName;
            this.cache = {};
        }
        return this.cache[pageId] = page;
    }
}

