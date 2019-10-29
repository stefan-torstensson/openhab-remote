<template>
    <progress-indicator :class="{hidden: !running}" :width="1" :start="progressStart" :end="progressEnd"
                        :show-bg="false"></progress-indicator>
</template>

<script lang="ts">
    import ProgressIndicator from "./progress-indicator.vue";
    import {Component, Prop, Watch} from "vue-property-decorator";
    import Vue from "vue";

    @Component({components: {ProgressIndicator}})
    export default class LoadingIndicator extends Vue {
        @Prop({type: Boolean, default: false})
        running: boolean;

        private startPos: number = 0;
        private endPos: number = 0;

        private get progressStart() {
            return (this.startPos % 100) / 100;
        }

        private get progressEnd() {
            return (this.endPos % 100) / 100;
        }

        mounted() {
            if (this.running) {
                this.animate();
            }
        }

        @Watch("running")
        toggleRunning(running: boolean) {
            if (running) {
                this.animate();
            } else {
                this.startPos = this.endPos = 0;
            }
        }

        private animate() {
            requestAnimationFrame(this.updateAnimation.bind(this));
        }

        private updateAnimation(): void {
            this.endPos += 2;
            this.startPos = this.endPos - 10;
            if (this.running) {
                requestAnimationFrame(this.animate.bind(this));
            }
        }
    }
</script>
