<template>
    <option-list :options="options" v-model="selected" single-select></option-list>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component} from "vue-property-decorator";
    import {OptionList, SelectOption} from "@app/ui/components";

    @Component({components: {OptionList}})
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
