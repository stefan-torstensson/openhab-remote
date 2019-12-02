import {inject} from "aurelia-dependency-injection";
import FrameWidget from "./widgets/frame-widget.vue";
import SwitchControl from "./widgets/switch-control.vue";
import SetpointControl from "./widgets/setpoint-control.vue";
import SetpointView from "./widgets/setpoint-view.vue";
import TextView from "./widgets/text-view.vue";
import {Widget} from "@app/api/openhab-types";
import SelectionControl from "./widgets/selection-control.vue";
import Vue from "vue";
import PlayerControl from "@app/ui/openhab/widgets/player-control.vue";
import WidgetControl from "@app/ui/openhab/widgets/widget-control";

interface Mapping {
    list: new (...args: any[]) => Vue;
    single: any; // (widget: Widget) => new (...args: any[]) => Vue | (new (...args: any[]) => Vue);
    shouldRender?: (widget: Widget) => boolean;
}

interface WidgetMap {
    [s: string]: Mapping;
}

function mapSelection(widget: Widget): new (...args: any[]) => Vue {
    if (widget.item.type === "Player") {
        return PlayerControl;
    }
    return SelectionControl;
}

const widgetConfig: WidgetMap = {
    "Frame": {list: FrameWidget, single: FrameWidget, shouldRender: w => !!w.label},
    "Setpoint": {list: SetpointView, single: SetpointControl},
    "Slider": {list: SetpointView, single: SetpointControl},
    "Switch": {list: SwitchControl, single: mapSelection },
    "Selection": {list: SwitchControl, single: SelectionControl},
    "Text": {list: TextView, single: TextView},
    "Group": {list: TextView, single: TextView}
};

export enum RenderMode {
    list,
    single
}

@inject(widgetConfig)
export class WidgetMapper {
    private readonly config: WidgetMap = {};

    constructor(config: WidgetMap) {
        this.config = config;
    }

    getControl(widget: Widget, mode: RenderMode = RenderMode.list): new (...args: any[]) => Vue {
        const type = widget && widget.type;
        const mapping = this.config[type];
        if (mapping && (!mapping.shouldRender || mapping.shouldRender(widget))) {
            const result = (mode === RenderMode.single ? mapping.single : mapping.list);
            if (result.prototype instanceof WidgetControl) {
                return result;
            }
            return result(widget);
        }
        return null;
    }
}
