<script lang="ts">
    import {WidgetMapper, RenderMode} from "./widget-mapper";
    import {Inject} from "../ioc";
    import {SitemapState} from "@app/api";
    import Vue from "vue";
    import {Component, Prop} from "vue-property-decorator";

    @Component
    export default class WidgetRenderer extends Vue {
        @Inject(SitemapState)
        private state: SitemapState;

        @Inject(WidgetMapper)
        private controlMapper: WidgetMapper;

        @Prop(String)
        private widgetId: string;

        get widget() {
            const widget = this.state.getWidget(this.widgetId);
            const componentType = this.controlMapper.getControl(widget, RenderMode.single);
            return {
                componentType,
                widget
            };
        }
    }
</script>

<template>
    <div class="fill-available-space">
        <div v-if="!widget" class="center-vertically center-text">
            <div class="startup-logo"></div>
        </div>
        <component v-if="widget" :is="widget.componentType" :widget="widget.widget"/>
    </div>
</template>
