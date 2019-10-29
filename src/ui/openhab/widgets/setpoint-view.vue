<script lang="ts">
    import {Component} from "vue-property-decorator";
    import WidgetControl from "./widget-control";
    import {ListLabel} from "@app/ui/components";
    import {Icon} from "@app/svg";

    @Component({
        components: {ListLabel, Icon}
    })
    export default class SetpointView extends WidgetControl {

        get link(): any {
            return {
                name: "widget",
                params: {
                    widgetId: this.widget.widgetId
                }
            };
        }

        get stateLabel(): string {
            return super.stateLabel || this.item.state;
        }
    }

</script>

<template>
    <router-link :to="link" class="list-control" v-ripple>
        <list-label :label="label" :state="stateLabel">
            <icon type="volume"></icon>
        </list-label>
    </router-link>
</template>
