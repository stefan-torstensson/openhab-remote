<template>
    <scaling-list heading="Settings">
        <scaling-list-item v-for="route in routes" :key="route.name">
            <router-link :to="route.path" append class="list-control">
                <list-label :label="route.label" :state="route.value">
                    <icon type="multiselect"></icon>
                </list-label>
            </router-link>
        </scaling-list-item>
        <scaling-list-item>
            <a @click="quit()" class="list-control">
                <list-label label="Quit" state="Close App">
                    <icon type="arrow"></icon>
                </list-label>
            </a>
        </scaling-list-item>
    </scaling-list>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component} from "vue-property-decorator";
    import {ScalingList, ScalingListItem, ListLabel} from "@app/ui/components";
    import {Inject} from "@app/ui/ioc";
    import {AppSettings} from "@app/configuration/app-settings";
    import {Icon} from "@app/svg";
    import {AppEvent, PubSub} from "@app/ui/event-bus";
    import {RawLocation, Route} from "vue-router";

    @Component({
        components: {ListLabel, ScalingList, ScalingListItem, Icon}
    })
    export default class Navigation extends Vue {
        @Inject(AppSettings)
        private appSettings: AppSettings;

        @Inject(PubSub)
        private pubSub: PubSub;

        private get routes() {
            return [
                {
                    path: "url",
                    label: "openHAB Url",
                    value: this.appSettings.remoteUrl
                },
                {
                    path: "sitemap",
                    label: "Sitemap",
                    value: this.appSettings.sitemapName
                },
                {
                    path: "appinfo",
                    label: "Information"
                }
            ];
        }

        beforeRouteLeave(to: Route, from: Route, next: (next?: RawLocation) => void) {
            if (to.path.startsWith("/settings") || to.redirectedFrom === "/") {
                next();
            } else {
                next({path: "/"});
            }
        }

        private quit(): void {
            this.pubSub.$emit(AppEvent.QUIT);
        }
    }
</script>

<style scoped lang="scss">
    .content {
        text-align: center;
        padding: 30px;
    }
</style>
