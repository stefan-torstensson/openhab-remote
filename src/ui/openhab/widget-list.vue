<template>
    <scaling-list :heading="title">
        <scaling-list-item v-for="item in mappedWidgets" :key="item.widget.widgetId">
            <component :is="item.type" :widget="item.widget"/>
        </scaling-list-item>
    </scaling-list>
</template>
<script lang="ts">
    import Vue from "vue";
    import {Component, Prop} from "vue-property-decorator";
    import {WidgetMapper} from "./widget-mapper";
    import ScalingList from "../components/scaling-list.vue";
    import ScalingListItem from "../components/scaling-list-item.vue";
    import {Widget} from "@app/api/openhab-types";
    import {Inject} from "@app/ui/ioc";

    @Component({
        components: {ScalingList, ScalingListItem}
    })
    export default class WidgetList extends Vue {
        @Prop([Array]) widgets: Widget[];

        @Prop(String) title: string;

        @Inject(WidgetMapper)
        private widgetMapper: WidgetMapper;

        get mappedWidgets() {
            return flatten(this.widgets)
                .map((widget: Widget) => ({
                    type: this.widgetMapper.getControl(widget),
                    widget
                }))
                .filter(w => !!w.type);
        }
    }

    function flatten(array: any[], target: any[] = []): any[] {
        return array.reduce((dest, entry) => {
            dest.push(entry);
            return flatten(entry.widgets, dest);
        }, target);
    }
</script>

