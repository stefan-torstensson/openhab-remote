<template>
    <scaling-list heading="Components">
        <scaling-list-item v-for="route in availableRoutes" :key="route.name">
            <router-link :to="route" append class="list-control">
                <list-label :label="route.name">
                    <icon type="arrow"></icon>
                </list-label>
            </router-link>
        </scaling-list-item>
    </scaling-list>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component} from "vue-property-decorator";
    import {routes} from "./routes";
    import {Location} from "vue-router";
    import {ScalingList, ScalingListItem, ListLabel} from "@app/ui/components";
    import {Icon} from "@app/svg";

    @Component({components: {ScalingList, ScalingListItem, ListLabel, Icon}})
    export default class Default extends Vue {
        get availableRoutes(): Location[] {
            return routes
                .filter(r => !!r.name)
                .map(r => ({
                    name: r.name,
                } as Location));
        }
    }
</script>
