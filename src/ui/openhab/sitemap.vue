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

    @Component({
        components: {
            WidgetList
        }
    })
    export default class Sitemap extends Vue {
        @Inject(SitemapState)
        private state: SitemapState;

        @Prop(String)
        private sitemap: string;

        @Prop(String)
        private pageId: string;

        private widgets: Widget[] = [];

        created() {
            this.widgets = this.state.widgets;
        }

        mounted() {
            this.setActivePage();
        }

        @Watch("pageId")
        private setActivePage() {
            this.state.setActivePage(this.sitemap, this.pageId);
        }
    }

</script>
