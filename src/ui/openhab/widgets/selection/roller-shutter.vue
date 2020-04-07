<template>
    <slider-control v-model="value">
        <div class="controls">
            <div class="controls_item">
                <div class="ripple-effect">
                    <up-icon class="svg-icon" @click="sendCommand('UP')"></up-icon>
                </div>
            </div>
            <div class="controls_item controls_item--stop">
                <div class="ripple-effect">
                    <stop-icon class="svg-icon" @click="sendCommand('STOP')"></stop-icon>
                </div>
            </div>
            <div class="controls_item">
                <div class="ripple-effect">
                    <down-icon class="svg-icon" @click="sendCommand('DOWN')"></down-icon>
                </div>
            </div>
        </div>
    </slider-control>
</template>

<script lang="ts">
    import {Component} from "vue-property-decorator";
    import WidgetControl from "../widget-control";
    import {SliderControl} from "@app/ui/components";
    import UpIcon from "@app/svg/up.svg";
    import DownIcon from "@app/svg/down.svg";
    import StopIcon from "@app/svg/stop.svg";

    function parseValue(value: string): number {
        const result = parseFloat(value);
        return isNaN(result) ? 0 : result;
    }

    @Component({
        components: {SliderControl, UpIcon, DownIcon, StopIcon}
    })
    export default class RollerShutter extends WidgetControl {
        get value(): number {
            return parseValue(this.state);
        }

        set value(value: number) {
            this.setState("" + value);
        }

        sendCommand(command: string) {
            this.setState(command);
        }
    }
</script>

<style lang="scss" scoped>
    @import "@app/style/application";
    @import "~settings";

    .svg-icon {
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .controls {
        padding: 40px 0;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        transform: scale3d(1, 1, 1);

        &_item {
            line-height: 0;
            margin: 0 80px;
            border-radius: 20px;
            overflow: hidden;

            // Makes the ripple effect stay inside the border on older Chrome versions
            transform: scale3d(1, 1, 1);

            & .ripple-effect {
                padding: 0 40px;
            }

            &--stop .ripple-effect{
                padding: 0 50px;
            }
        }
    }
</style>
