<script lang="ts">
    import Vue from "vue";
    import {Component, Prop} from "vue-property-decorator";

    function getEndPoints(start: number, end: number) {
        const a1 = 2 * Math.PI * Math.max(.00001, start);
        const a2 = 2 * Math.PI * Math.min(.99999, end);
        return {
            x1: Math.sin(a1),
            y1: Math.cos(a1),
            x2: Math.sin(a2),
            y2: Math.cos(a2),
            large: (end - start) > .5 ? 1 : 0
        };
    }

    @Component
    export default class ProgressIndicator extends Vue {
        @Prop({type: Number, default: 0})
        start: number;

        @Prop({type: Number, default: 1})
        end: number;

        @Prop({type: Number, default: 2})
        width: number;

        @Prop({type: Boolean, default: true})
        showBg: boolean;

        @Prop({type: Number, default: 50})
        radius: number;

        get path(): string {
            const strokeOffset = this.width / 2;
            const radius = this.radius - strokeOffset;
            const p = getEndPoints(this.start, this.end);
            // `M 47 3 A 47 47, 0, 0, 1, 97 47`
            return `M ${50 + (radius * p.x1)} ${50 - (radius * p.y1)} A ${radius} ${radius}, 0, ${p.large}, 1, ${50 + radius * p.x2} ${50 - (radius * p.y2)}`;
        }
    }
</script>

<template>
    <div class="circular-slider">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <circle
                class="circular-slider__circle" :class="{hidden: !showBg}"
                cx="50"
                cy="50"
                :r="radius - width / 2"
                :stroke-width="width"></circle>
            <path
                class="circular-slider__path"
                fill="none"
                :stroke-width="width"
                :d="path"
            ></path>
        </svg>
    </div>
</template>

<style lang="scss" scoped>
    @import "~theming";

    .circular-slider {
        line-height: 0;
        background-color: transparent;
        pointer-events: none;

        &__circle {
            stroke: #222;
            fill: none;
        }

        &__path {
            fill: none;
            stroke-linecap: round;
            @include theme-color-active("stroke");
        }
    }
</style>
