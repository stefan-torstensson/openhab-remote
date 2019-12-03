<template>
    <div class="fill-available-space">
        <roller-shutter :widget="widget"></roller-shutter>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component} from "vue-property-decorator";
    import RollerShutter from "@app/ui/openhab/widgets/selection/roller-shutter.vue";
    import {Widget} from "@app/api/openhab-types";

    const mockWidget: Widget = {
        widgetId: "id",
        type: "Switch",
        label: "Roller shutter",
        item: {
            state: "15",
            link: "http://rollershutter"
        }
    } as Widget;

    @Component({components: {RollerShutter}})
    export default class RollerShutterSample extends Vue {
        widget = mockWidget;
    }
</script>
