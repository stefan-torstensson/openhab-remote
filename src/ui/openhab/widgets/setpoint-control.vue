<script lang="ts">
    import {sprintf} from "sprintf-js";
    import {Component} from "vue-property-decorator";
    import SliderControl from "../../components/slider-control.vue";
    import WidgetControl from "./widget-control";
    import {StateDescription} from "@app/api/openhab-types";

    function parseValue(value: string): number {
        const result = parseFloat(value);
        return isNaN(result) ? 0 : result;
    }

    @Component({
        components: {SliderControl}
    })
    export default class SetpointControl extends WidgetControl {
        get value(): number {
            return parseValue(this.state);
        }

        set value(value: number) {
            this.setState(value.toString(10));
        }

        get displayValue(): string {
            const stateLabel = this.stateLabel;
            if (stateLabel) {
                return stateLabel;
            }
            const {state, stateDescription} = this.item;
            if (stateDescription) {
                return sprintf(stateDescription.pattern, state);
            }
            return state;
        }

        get stepSize(): number {
            return this.widget.step || this.stateDescription.step;
        }

        get maxValue(): number {
            return this.widget.maxValue || this.stateDescription.maximum;
        }

        get minValue(): number {
            return this.widget.minValue || this.stateDescription.minimum;
        }

        get stateDescription(): StateDescription {
            return this.item.stateDescription || {} as StateDescription;
        }
    }
</script>

<template>
    <slider-control v-model="value" :step-size="stepSize" :max-value="maxValue" :min-value="minValue">
        <div class="setpoint_label">{{label}}</div>
        <div class="setpoint_value">{{displayValue}}</div>
    </slider-control>
</template>

<style lang="scss" scoped>
    @import "~settings";
    .setpoint_label {
        font-size: .8em;
        text-decoration: underline;
        white-space: nowrap;
        overflow: hidden;
        margin: 0 40px;
        text-overflow: ellipsis;
    }
    .setpoint_value {
        padding-bottom: 50px;
        padding-top: 20px;
    }
</style>
