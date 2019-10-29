<template>
    <div class="flex-area">
        <div class="header kb-hidden">
            <slot name="header"></slot>
        </div>
        <div class="content" :class="{'content--footer-hidden': !hasFooter}">
            <slot></slot>
        </div>
        <div class="footer kb-hidden" v-if="hasFooter">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component} from "vue-property-decorator";
    import Vue from "vue";

    @Component()
    export default class Page extends Vue {
        get hasFooter(): boolean {
            return !!this.$slots.footer;
        }
    }
</script>

<style lang="scss" scoped>
    @import "~settings";
    @import "@app/style/media";

    .flex-area {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    .header {
        flex-basis: 20%;
        min-height: 20%;
    }

    .content {
        flex-grow: 1;
        overflow-y: scroll;
        text-align: center;
        padding: 30px 10%;

        &::after {
            @include kb-hidden;
            content: '';
            width: 100%;
            height: 60%;
            position: absolute;
            pointer-events: none;
            left: 0;
            top: 20%;
            background: linear-gradient($color-background 0%, transparent 15%, transparent 85%, $color-background 100%);
        }

        &--footer-hidden {
            padding-bottom: 60px;

            &::after {
                height: 80%;
            }
        }
    }

    .footer {
        flex-basis: 20%;
        min-height: 20%;
    }
</style>
