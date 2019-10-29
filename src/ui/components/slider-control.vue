<template>
    <div class="slider-control">
        <circular-slider :value="renderValue"></circular-slider>
        <div class="touch-source" ref="touchSource">
            <div class="content center-text center-vertically">
                <slot>
                    {{renderValue}}
                </slot>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .slider-control {
        position: relative;
    }

    .touch-source {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .content {
        pointer-events: none;
        position: absolute;
        width: 100%;
    }
</style>


<script lang="ts">

    import {Component, Model, Prop} from "vue-property-decorator";
    import {Inject} from "../ioc";
    import {PubSub} from "../event-bus";
    import Debounce from "debounce-decorator";
    import Vue from "vue";
    import CircularSlider from "./circular-slider.vue";
    import SwipeListener from "swipe-listener";

    enum Direction {
        Up = 1,
        Down = -1
    }

    interface SwipingDetails {
        x: [number, number];
        y: [number, number];
        touch: boolean;
    }

    @Component({
        components: {CircularSlider}
    })
    export default class SliderControl extends Vue {
        @Inject(PubSub)
        pubsub: PubSub;

        @Model("change", {type: Number})
        value: number;

        @Prop({type: [Number], default: 10})
        stepSize: number;

        @Prop({type: [Number], default: 0})
        minValue: number;

        @Prop({type: [Number], default: 100})
        maxValue: number;

        private modifiedValue: number = null;
        private swipeListener: any = null;
        private previousSwipePosition: number = 0;

        private get touchSource(): Element {
            return this.$refs.touchSource as Element;
        }

        get renderValue(): number {
            return (this.modifiedValue || this.value) * 100 / (this.maxValue - this.minValue);
        }

        mounted() {
            this.pubsub.$on("bezelRotation", this.bezelRotation);
            this.swipeListener = new SwipeListener(this.touchSource, {lockAxis: true});
            this.touchSource.addEventListener("swiping", this.onSwiping as EventListener);
            this.touchSource.addEventListener("swiperelease", this.onSwipeRelease);
        }

        destroyed() {
            this.pubsub.$off("bezelRotation", this.bezelRotation);
            this.touchSource.removeEventListener("swiping", this.onSwiping as EventListener);
            this.touchSource.removeEventListener("swiperelease", this.onSwipeRelease);

            if (this.swipeListener) {
                this.swipeListener.off();
            }
        }

        private onSwiping(e: CustomEvent<SwipingDetails>) {
            const [start, end] = e.detail.y;
            const dy = Math.trunc((start - end) / 20);
            if (dy !== this.previousSwipePosition) {
                const direction = Math.sign(dy - this.previousSwipePosition);
                this.previousSwipePosition = dy;
                this.updateValue(direction);
            }
        }

        private onSwipeRelease() {
            this.previousSwipePosition = 0;
        }

        private bezelRotation(direction: string) {
            this.updateValue(direction === "CW" ? Direction.Up : Direction.Down);
        }

        private updateValue(direction: Direction) {
            let value = this.renderValue;
            switch (direction) {
                case Direction.Up:
                    value += this.stepSize;
                    value = Math.min(this.maxValue, value);
                    break;
                case Direction.Down:
                    value -= this.stepSize;
                    value = Math.max(this.minValue, value);
                    break;
            }
            this.modifiedValue = value;
            this.emitChange(value);
        }

        @Debounce(200)
        private emitChange(value: number) {
            this.$emit("change", value);
        }
    }
</script>
