<template>
    <slider-control v-model="value">
        <div class="controls">
            <up-icon class="svg-icon controls_item ripple-effect" @click="sendCommand('UP')"></up-icon>
            <stop-icon class="svg-icon controls_item ripple-effect" @click="sendCommand('STOP')"></stop-icon>
            <down-icon class="svg-icon controls_item ripple-effect" @click="sendCommand('DOWN')"></down-icon>
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

    .svg-icon {
        stroke-linecap: round;
        stroke-linejoin: round;
    }
    .controls{
        padding: 40px 0;
        text-align: center;
        height: 100%;
        display: flex;
        flex-direction: column;

        &_item {
            flex: 1;
            margin:0 auto;
            width: 250px;
            padding: 0 60px;
        }
    }
</style>
