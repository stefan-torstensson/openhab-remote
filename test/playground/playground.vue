<template>
    <div class="application-root">
        <div class="fill-available-space">
            <!--<multi-select :options="options" v-model="selected" single-select></multi-select>-->
            <div class="center-text center-vertically" style="display: none;">
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
            <!--            <arc-button position="top">Save</arc-button>-->
            <!--            <arc-button position="bottom">Save</arc-button>-->
            <slider-control v-model="sliderValue"></slider-control>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component} from "vue-property-decorator";
    import {default as MultiSelect, SelectOption} from "@app/ui/components/option-list.vue";
    import {Icon, ToggleIcon} from "@app/svg";
    import {ArcButton, SliderControl} from "@app/ui/components";

    const values = ["2"];

    @Component({
        components: {ToggleIcon, MultiSelect, Icon, ArcButton, SliderControl}
    })
    export default class Playground extends Vue {

        sliderValue: number = 30;

        get options() {
            return [
                new SelectOption("1", "One"),
                new SelectOption("2", "Two"),
                new SelectOption("3", "Three"),
                new SelectOption("4", "Four"),
                new SelectOption("5", "Five"),
            ];
        }

        checked: boolean = false;

        selected: string = "2";

    }
</script>

<style lang="scss" scoped>
    .icon-container > * {
        width: 60px;
    }
</style>
