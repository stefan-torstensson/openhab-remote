<template>
    <div class="slider-control fill-available-space">
        <div class="touch-source" ref="touchSource">
            <slot>
                <div class="center-text center-vertically">
                    {{renderValue}}
                </div>
            </slot>
        </div>
        <circular-slider :value="normalizedValue" class="slider-control_slider"></circular-slider>
    </div>
</template>

<script lang="ts">

    import {Component, Model, Prop} from "vue-property-decorator";
    import {Inject} from "../ioc";
    import {AppEvent, PubSub} from "../event-bus";
    import Debounce from "debounce-decorator";
    import Vue from "vue";
    import CircularSlider from "./circular-slider.vue";
    import SwipeListener from "swipe-listener";
    import {Capability, SystemInfo} from "@app/tizen/system-info";

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

        private clearModifiedTimeoutId: number;
        private modifiedValue: number = null;
        private swipeListener: any = null;
        private previousSwipePosition: number = 0;

        private get touchSource(): Element {
            return this.$refs.touchSource as Element;
        }

        get normalizedValue(): number {
            const value = this.modifiedValue || this.value;
            return 100 * (value - this.minValue) / (this.maxValue - this.minValue);
        }

        get renderValue(): number {
            return this.modifiedValue || this.value;
        }

        mounted() {
            this.pubsub.$on(AppEvent.BEZEL_ROTATION, this.bezelRotation);
            if (!SystemInfo.instance.has(Capability.BEZEL_SUPPORT)) {
                this.swipeListener = new SwipeListener(this.touchSource, {lockAxis: true});
                this.touchSource.addEventListener("swiping", this.onSwiping as EventListener);
                this.touchSource.addEventListener("swiperelease", this.onSwipeRelease);
            }
        }

        beforeDestroy() {
            this.pubsub.$off(AppEvent.BEZEL_ROTATION, this.bezelRotation);
            if (this.swipeListener) {
                this.touchSource.removeEventListener("swiping", this.onSwiping as EventListener);
                this.touchSource.removeEventListener("swiperelease", this.onSwipeRelease);
                this.swipeListener.off();
                this.swipeListener = null;
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
            let value = this.modifiedValue || this.value;
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
            this.clearModified();
            this.emitChange(value);
        }

        @Debounce(200)
        private emitChange(value: number) {
            this.$emit("change", value);
        }

        private clearModified() {
            // Don't want the slider to jump around while adjusting the value
            // but it should settle on the new value eventually
            global.clearTimeout(this.clearModifiedTimeoutId);
            this.clearModifiedTimeoutId = global.setTimeout(() => {
                this.modifiedValue = null;
            }, 2000);
        }
    }

</script>

<style lang="scss" scoped>
    .slider-control {
        position: relative;

        &_slider {
            position: absolute;
            width: 100%;
            height: 100%;
        }
    }

    .touch-source {
        user-select: none;
        position: absolute;
        width: 100%;
        height: 100%;
    }

</style>

