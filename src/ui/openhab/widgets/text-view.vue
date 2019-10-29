<script lang="ts">
    import {Component} from "vue-property-decorator";
    import WidgetControl from "./widget-control";
    import {Icon} from "@app/svg";
    import {ListLabel} from "@app/ui/components";
    import {Location} from "vue-router";

    @Component({
        components: {Icon, ListLabel}
    })
    export default class TextView extends WidgetControl {
        get routerPath(): Location {
            const {linkedPage} = this.widget;
            return !linkedPage ? {} : {
                params: {
                    pageId: linkedPage.id
                }
            };
        }

        get iconName(): string {
            return this.widget.linkedPage ? "arrow" : "info";
        }
    }
</script>

<template>
    <router-link v-bind:to="routerPath" class="fill-available-space" v-ripple>
        <list-label :label="label" :state="stateLabel">
            <icon :type="iconName"></icon>
        </list-label>
    </router-link>
</template>
