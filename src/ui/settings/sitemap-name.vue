<template>
    <option-list :options="sitemapOptions" v-model="value"></option-list>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component, Watch} from "vue-property-decorator";
    import {SitemapClient} from "@app/api";
    import {Inject} from "@app/ui/ioc";
    import {OptionList, ScalingList, ScalingListItem} from "@app/ui/components";
    import {SelectOption} from "@app/ui/components/option-list.vue";
    import {AppSettings} from "@app/configuration/app-settings";
    import {AppEvent, PubSub} from "@app/ui/event-bus";

    @Component({
        components: {OptionList, ScalingList, ScalingListItem}
    })
    export default class SitemapName extends Vue {
        @Inject(SitemapClient)
        private sitemapClient: SitemapClient;

        @Inject(AppSettings)
        private appSettings: AppSettings;

        @Inject(PubSub)
        private pubSub: PubSub;

        private sitemapOptions: SelectOption[] = [];

        private value: string = "";

        mounted() {
            this.value = this.appSettings.sitemapName;
            this.loadSitemaps();
        }

        @Watch("value")
        private saveSelection() {
            const modified = this.appSettings.sitemapName !== this.value;
            this.appSettings.sitemapName = this.value;
            if (modified && this.appSettings.sitemapName) {
                this.pubSub.$emit(AppEvent.NAVIGATE_BACK);
            }
        }

        private async loadSitemaps() {
            const sitemaps = await this.sitemapClient.getSitemaps();
            this.sitemapOptions = sitemaps.map(sitemap => new SelectOption(sitemap.name, sitemap.label));
        }

    }
</script>
