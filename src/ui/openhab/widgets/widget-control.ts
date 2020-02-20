import Vue from "vue";
import {Component, Prop} from "vue-property-decorator";
import {Item, Widget} from "@app/api/openhab-types";
import {Inject} from "@app/ui/ioc";
import {SitemapState} from "@app/api";
import {parseLabel} from "./label-parser";

@Component({})
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
        return parseLabel(this.widget.label).state;
    }

    setState(state: string): void {
        this.sitemapState.postUpdate(this.item, state);
    }

    render() {}
}
