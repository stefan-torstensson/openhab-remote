<template>
    <slider-control v-model="sliderValue"></slider-control>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component} from "vue-property-decorator";
    import {SliderControl} from "@app/ui/components";

    @Component({components: {SliderControl}})
    export default class Slider extends Vue {
        sliderValue: number = 30;
    }
</script>
