<script lang="ts">
    import {sprintf} from "sprintf-js";
    import {Component} from "vue-property-decorator";
    import SliderControl from "../../components/slider-control.vue";
    import WidgetControl from "./widget-control";

    function parseValue(value: string): number {
        const result = parseInt(value, 10);
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
            const {state, stateDescription} = this.item;
            if (stateDescription) {
                return sprintf(stateDescription.pattern, state);
            }
            return state;
        }

        get stepSize() {
            const {stateDescription} = this.item;
            return stateDescription && stateDescription.step;
        }

        get formattedValue() {
            const {stateDescription} = this.item;
            if (stateDescription) {
                return sprintf(stateDescription.pattern, this.value);
            }
            return this.value;
        }
    }
</script>

<template>
    <slider-control v-model="value" :step-size="stepSize">
        {{displayValue}}
    </slider-control>
</template>
