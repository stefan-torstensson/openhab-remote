<script lang="ts">
    import {RenderMode, WidgetMapper} from "./widget-mapper";
    import {Inject} from "../ioc";
    import Vue from "vue";
    import {Component, Prop} from "vue-property-decorator";
    import {Widget} from "@app/api/openhab-types";

    @Component
    export default class WidgetRenderer extends Vue {
        @Inject(WidgetMapper)
        private controlMapper: WidgetMapper;

        @Prop(Object)
        private widget: Widget;

        get componentType(): new () => Vue {
            return this.controlMapper.getControl(this.widget, RenderMode.single);
        }
    }
</script>

<template>
    <div class="fill-available-space">
        <div v-if="!widget" class="center-vertically center-text">
            <div class="startup-logo"></div>
        </div>
        <component v-if="widget" :is="componentType" :widget="widget"/>
    </div>
</template>
