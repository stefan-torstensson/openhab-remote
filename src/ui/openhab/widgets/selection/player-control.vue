<template>
    <div class="player-control">
        <div class="player-control_icons">
            <div class="player-icon">
                <div class="ripple-effect">
                    <toggle-icon type="play" :active="isPlaying" @click="setState(playerState.Play)"></toggle-icon>
                </div>
            </div>
            <div class="player-icon">
                <div class="ripple-effect">
                    <toggle-icon type="pause" :active="isPaused" @click="setState(playerState.Pause)"></toggle-icon>
                </div>
            </div>
        </div>
        <div class="player-control_label">
            <div class="label_text">{{label}}</div>
        </div>
        <div class="player-control_icons">
            <div class="player-icon">
                <div class="ripple-effect">
                    <icon type="previous" @click="setState(playerState.Previous)"></icon>
                </div>
            </div>
            <div class="player-icon">
                <div class="ripple-effect">
                    <icon type="next" @click="setState(playerState.Next)"></icon>
                </div>
            </div>
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
            text-align: center;
        }

        &_icons {
            line-height: 0;
            &:first-child {
                padding-top: 40px;
            }

            &:last-child {
                padding-bottom: 40px;
            }
        }

        &_label {
            flex-grow: 1;
            display: flex;
            align-items: center;
        }
    }

    .label_text {
        margin: auto;
        padding: 0 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .player-icon {
        display: inline-block;
        overflow: hidden;
        margin: 0 20px;
        width: 28%;
        border-radius: 50%;
        // Makes the ripple effect stay inside the border on older Chrome versions
        transform: scale3d(1, 1, 1);

        & svg {
            vertical-align: bottom;
            stroke: $color-primary;
            stroke-linejoin: round;
            stroke-linecap: round;
        }
    }
</style>
