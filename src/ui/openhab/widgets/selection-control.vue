<template>
    <div class="fill-available-space">
        <option-list v-model="value" :options="options" :heading="label"></option-list>
    </div>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import WidgetControl from "./widget-control";
    import {default as OptionList, SelectOption} from "@app/ui/components/option-list.vue";

    const ROLLERSHUTTER = "Rollershutter";
    const ROLLERSHUTTER_OPTIONS = [
        new SelectOption("UP", "Up"),
        new SelectOption("STOP", "Stop"),
        new SelectOption("DOWN", "Down")
    ];

    @Component({
        components: {OptionList}
    })
    export default class SelectionControl extends WidgetControl {

        get options() {
            if (ROLLERSHUTTER.localeCompare(this.item.type) === 0) {
                return ROLLERSHUTTER_OPTIONS;
            }
            return this.widget.mappings.map(m => new SelectOption(m.command, m.label));
        }

        get value(): string {
            return this.state;
        }

        set value(value: string) {
            this.setState("" + value);
        }

    }

</script>
