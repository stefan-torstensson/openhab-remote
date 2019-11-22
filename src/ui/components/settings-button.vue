<template>
    <router-link :to="{name:'settings'}" class="settings-link">
        <settings-icon class="icon"></settings-icon>
    </router-link>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component} from "vue-property-decorator";
    import SettingsIcon from "@app/svg/dots.svg";

    @Component({components: {SettingsIcon}})
    export default class SettingsButton extends Vue {
    }
</script>

<style lang="scss" scoped>
    @import "~settings";

    .icon {
        width: 15px;
        height: 60px;
        fill: $color-primary;
        stroke: $color-primary;
        stroke-width: 1;
    }

    .settings-link {
        display: block;
        width: 40px;
        text-align: right;
        padding-right: 10px;
        padding-top: 6px;
        padding-bottom: 5px;
        line-height: 0;
    }

</style>

