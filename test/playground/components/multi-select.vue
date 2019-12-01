<template>
    <multi-select :options="options" v-model="selected" single-select></multi-select>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component} from "vue-property-decorator";
    import {default as MultiSelect, SelectOption} from "@app/ui/components/option-list.vue";

    @Component({components: {MultiSelect}})
    export default class MultiSelectSample extends Vue {

        selected: string = "2";

        get options() {
            return [
                new SelectOption("1", "One"),
                new SelectOption("2", "Two"),
                new SelectOption("3", "Three"),
                new SelectOption("4", "Four"),
                new SelectOption("5", "Five"),
            ];
        }
    }
</script>
