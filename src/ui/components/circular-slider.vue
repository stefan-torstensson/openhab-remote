<template>
    <progress-indicator :start="0" :end="endValue" :width="6" :show-bg="true"></progress-indicator>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component, Prop} from "vue-property-decorator";
    import ProgressIndicator from "./progress-indicator.vue";

    @Component({components: {ProgressIndicator}})
    export default class CircularSlider extends Vue {
        @Prop({type: Number, default: 0})
        value: number;

        get endValue(): number {
            return this.value / 100;
        }
    }
</script>

