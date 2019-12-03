<template>
    <option-list v-model="value" :options="options" :heading="label"></option-list>
</template>

<script lang="ts">
    import {Component} from "vue-property-decorator";
    import WidgetControl from "@app/ui/openhab/widgets/widget-control";
    import {OptionList, SelectOption} from "@app/ui/components";

    const ROLLERSHUTTER = "Rollershutter";
    const ROLLERSHUTTER_OPTIONS = [
        new SelectOption("UP", "Up"),
        new SelectOption("STOP", "Stop"),
        new SelectOption("DOWN", "Down")
    ];

    @Component({components: {OptionList}})
    export default class OptionListControl extends WidgetControl {
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

<style lang="scss" scoped>

</style>
