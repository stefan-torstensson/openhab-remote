<template>
    <div class="fill-available-space">
        <div v-if="!widgets.length" class="center-text center-vertically">
            <div class="startup-logo"></div>
        </div>
        <widget-renderer v-else-if="widgetId" :widget="selectedWidget"></widget-renderer>
        <widget-list v-else :widgets="widgets" :title="state.pageTitle"></widget-list>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component, Prop, Watch} from "vue-property-decorator";
    import {Inject} from "../ioc";
    import WidgetList from "./widget-list.vue";
    import {SitemapState, findWidgetById} from "@app/api";
    import {Widget} from "@app/api/openhab-types";
    import {AppEvent, PubSub} from "@app/ui/event-bus";
    import WidgetRenderer from "./widget-renderer.vue";

    @Component({
        components: {
            WidgetList,
            WidgetRenderer
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

        @Prop(String)
        private widgetId: string;

        private selectedWidget: Widget = null;

        private widgets: Widget[] = [];

        created() {
            this.widgets = this.state.widgets;
            this.pubsub.$on(AppEvent.ONLINE_CHANGE, this.onOnlineChange);
            this.pubsub.$on(AppEvent.REFRESH_PAGE, this.setActivePage);
        }

        mounted() {
            this.setActivePage();
        }

        beforeDestroy() {
            this.pubsub.$off(AppEvent.ONLINE_CHANGE, this.onOnlineChange);
            this.pubsub.$off(AppEvent.REFRESH_PAGE, this.setActivePage);
        }

        @Watch("pageId")
        private setActivePage() {
            if (this.sitemap && this.pageId) {
                this.state.setActivePage(this.sitemap, this.pageId);
            }
        }

        @Watch("widgetId")
        @Watch("widgets")
        private setSelectedWidget() {
            if (this.widgetId) {
                this.selectedWidget = findWidgetById(this.widgets, this.widgetId);
            } else {
                this.selectedWidget = null;
            }
        }

        private onOnlineChange(online: boolean) {
            if (online) {
                this.setActivePage();
            }
        }
    }

</script>
