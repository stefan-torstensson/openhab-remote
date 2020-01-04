<template>
    <div :class="['arc-button', `arc-button--${position}`]">
        <div class="arc-button_arc">
        </div>
        <button class="arc-button_content arc-button_button" @click="$emit('click')">
            <slot></slot>
        </button>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component, Prop} from "vue-property-decorator";

    @Component({})
    export default class ArcButton extends Vue {
        @Prop({type: String, default: "bottom"})
        position: string;
    }
</script>

<style lang="scss">
    @import "~settings";
    @import "~theming";

    .arc-button {
        position: relative;
        width: 100%;
        height: $screen-height/5;
        overflow: hidden;

        &_arc {
            position: absolute;
            width: $screen-width;
            height: $screen-height;
            border-radius: 50%;
            border-style: solid;
            border-width: 100px;
            @include theme-color-active("border-color");
        }

        &_content {
            position: absolute;
            text-align: center;
            width: 100%;
        }

        &_button {
            background: none;
            border: none;
            font-weight: bold;
            font-size: inherit;
            color: $color-primary;
        }

        &--top {
            top: 0;

            .arc-button {
                &_arc {
                    bottom: 0;
                }

                &_content {
                    bottom: 0;
                    margin-bottom: 15px;
                }
            }

        }

        &--bottom {
            bottom: 0;

            .arc-button_arc {
                top: 0;
            }

            .arc-button_content {
                top: 0;
                margin-top: 15px;
            }

        }

    }
</style>
