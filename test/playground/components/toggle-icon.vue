<template>
    <div class="center-text center-vertically">
        <div>
            Active: <input type="checkbox" v-model="checked">
        </div>
        <div class="icon-container">
            <toggle-icon type="arrow" :active="checked"></toggle-icon>
            <toggle-icon type="multiselect" :active="checked"></toggle-icon>
            <toggle-icon type="selected" :active="checked"></toggle-icon>
            <toggle-icon type="toggle" :active="checked"></toggle-icon>
        </div>
        <div class="icon-container">
            <icon type="arrow"></icon>
            <icon type="multiselect"></icon>
            <icon type="selected"></icon>
            <icon type="toggle"></icon>
        </div>
    </div>

</template>

<script lang="ts">
    import Vue from "vue";
    import {Component} from "vue-property-decorator";
    import {Icon, ToggleIcon} from "@app/svg";

    @Component({components: {ToggleIcon, Icon}})
    export default class ToggleIconSample extends Vue {
        checked: boolean = false;
    }
</script>

<style lang="scss" scoped>
    .icon-container > * {
        width: 60px;
    }
</style>
