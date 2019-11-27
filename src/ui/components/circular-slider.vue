<template>
    <progress-indicator :start="0" :end="endValue" :width="4" :show-bg="true" :radius="49"></progress-indicator>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component, Prop} from "vue-property-decorator";
    import ProgressIndicator from "./progress-indicator.vue";

    function withinRange(value: number) {
        value = Math.max(0, value);
        return Math.min(1, value);
    }

    @Component({components: {ProgressIndicator}})
    export default class CircularSlider extends Vue {
        @Prop({type: Number, default: 0})
        value: number;

        get endValue(): number {
            return withinRange(this.value / 100);
        }
    }
</script>

