<template>
        <div class="player-control">
            <div class="player-control_icons">
                <toggle-icon type="play" class="player-icon ripple-effect" :active="isPlaying"  @click="setState(playerState.Play)"></toggle-icon>
                <toggle-icon type="pause" class="player-icon ripple-effect" :active="isPaused" @click="setState(playerState.Pause)"></toggle-icon>
            </div>
            <div class="player-control_label">
                <div class="label_text">{{label}}</div>
            </div>
            <div class="player-control_icons">
                <icon type="previous" class="player-icon ripple-effect" @click="setState(playerState.Previous)"></icon>
                <icon type="next" class="player-icon ripple-effect" @click="setState(playerState.Next)"></icon>
            </div>
        </div>
</template>

<script lang="ts">
    import {Component} from "vue-property-decorator";
    import {Icon, ToggleIcon} from "@app/svg";
    import WidgetControl from "@app/ui/openhab/widgets/widget-control";

    enum PlayerState {
        Play = "PLAY",
        Pause = "PAUSE",
        Next = "NEXT",
        Previous = "PREVIOUS"
    }

    @Component({
        components: {Icon, ToggleIcon}
    })
    export default class PlayerControl extends WidgetControl {
        playerState = PlayerState;

        get isPlaying(): boolean {
            return this.state === PlayerState.Play;
        }

        get isPaused(): boolean {
            return this.state === PlayerState.Pause;
        }
    }
</script>


<style lang="scss" scoped>
    @import "@app/style/application";

    .player-control {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

        &_label, &_icons {
            flex: 1;
            text-align: center;
        }

        &_icons {

            &:first-child {
                padding-top: 40px;
            }

            &:last-child {
                padding-bottom: 40px;
            }
        }

        &_label {
            display: flex;
            align-items: center;
        }
    }

    .label_text {
        margin:auto;
        padding: 0 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .player-icon {
        vertical-align: bottom;
        margin: 0 20px;
        width: 28%;
        stroke: $color-primary;
        stroke-linejoin: round;
        stroke-linecap: round;
    }
</style>
