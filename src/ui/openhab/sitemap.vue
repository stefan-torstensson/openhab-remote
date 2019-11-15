<template>
    <div class="fill-available-space">
        <div v-if="!widgets.length" class="center-text center-vertically">
            <div class="startup-logo"></div>
        </div>
        <widget-list v-if="widgets" :widgets="widgets" :title="state.pageTitle"></widget-list>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component, Prop, Watch} from "vue-property-decorator";
    import {Inject} from "../ioc";
    import WidgetList from "./widget-list";
    import {SitemapState} from "@app/api";
    import {Widget} from "@app/api/openhab-types";
    import {AppEvent, PubSub} from "@app/ui/event-bus";

    @Component({
        components: {
            WidgetList
        }
    })
    export default class Sitemap extends Vue {
        @Inject(SitemapState)
        private state: SitemapState;

        @Inject(PubSub)
        private pubsub: PubSub;

        @Prop(String)
        private sitemap: string;

        @Prop(String)
        private pageId: string;

        private widgets: Widget[] = [];

        created() {
            this.widgets = this.state.widgets;
            this.pubsub.$on(AppEvent.ONLINE_CHANGE, this.onOnlineChange);
            this.pubsub.$on(AppEvent.REFRESH_PAGE, this.setActivePage);
        }

        mounted() {
            this.setActivePage();
        }

        destroyed() {
            this.pubsub.$off(AppEvent.ONLINE_CHANGE, this.onOnlineChange);
            this.pubsub.$off(AppEvent.REFRESH_PAGE, this.setActivePage);
        }

        @Watch("pageId")
        private setActivePage() {
            this.state.setActivePage(this.sitemap, this.pageId);
        }

        private onOnlineChange(online: boolean) {
            if (online) {
                this.setActivePage();
            }
        }
    }

</script>
