import Vue from "vue";
import {Prop} from "vue-property-decorator";
import {Item, Widget} from "@app/api/openhab-types";
import {Inject} from "@app/ui/ioc";
import {SitemapClient, SitemapState} from "@app/api";
import {parseLabel} from "./label-parser";

export default class WidgetControl extends Vue {
    @Prop(Object) widget: Widget;

    @Inject(SitemapState)
    sitemapState: SitemapState;

    get item(): Item {
        return this.widget.item;
    }

    get state(): string {
        return this.item && this.item.state;
    }

    get label(): string {
        const {label} = parseLabel(this.widget.label);
        return label;
    }

    get stateLabel(): string {
        const {state} = parseLabel(this.widget.label);
        if (state) {
            const mapping = this.widget.mappings.find(m => m.command === state);
            return mapping ? mapping.label : state;
        }
        return null;
    }

    setState(state: string): void {
        this.sitemapState.postUpdate(this.item, state);
    }
}
