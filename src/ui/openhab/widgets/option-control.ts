import {Component} from "vue-property-decorator";
import WidgetControl from "@app/ui/openhab/widgets/widget-control";
import {Mapping} from "@app/api/openhab-types";
import {parseLabel} from "@app/ui/openhab/widgets/label-parser";

@Component({})
export default class OptionControl extends WidgetControl {
    get stateLabel(): string {
        const commandOptions = this.commandOptions;
        if (commandOptions && commandOptions.length) {
            const mapping = commandOptions.find(m => m.command === this.item.state);
            return mapping ? mapping.label : null;
        }
        return parseLabel(this.widget.label).state;
    }

    get commandOptions(): Mapping[] {
        const {mappings} = this.widget;
        if (mappings && mappings.length) {
            return mappings;
        }
        return this.item?.commandDescription?.commandOptions;
    }

    get hasCommands(): boolean {
        return !!(this.commandOptions && this.commandOptions.length);
    }

}
