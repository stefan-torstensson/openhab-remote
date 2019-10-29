import {Item} from "../openhab-types";

export interface UpdateEvent {
    label: string;
    pageId: string;
    sitemapName: string;
    visibility: boolean;
    widgetId: string;
    item: Item;
}
