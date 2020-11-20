<template>
    <option-list :options="sitemapOptions" v-model="value" heading="Sitemaps"></option-list>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component, Watch} from "vue-property-decorator";
    import {SitemapClient} from "@app/api";
    import {Inject} from "@app/ui/ioc";
    import {OptionList, ScalingList, ScalingListItem, SelectOption} from "@app/ui/components";
    import {AppSettings} from "@app/configuration";
    import {AppEvent, PubSub} from "@app/ui/event-bus";
    import {ApplicationError} from "@app/common/application-error";

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
            if (this.appSettings.remoteUrl) {
                this.value = this.appSettings.sitemapName;
                this.loadSitemaps();
            } else {
                this.$router.replace({name: "setup"});
                this.pubSub.$emit(ApplicationError.eventName, new ApplicationError(
                    "openHAB url must be configured before selecting a sitemap",
                    "openHAB url not configured"
                ));
            }
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
            try {
                const sitemaps = await this.sitemapClient.getSitemaps();
                this.sitemapOptions = sitemaps.map(sitemap => new SelectOption(sitemap.name, sitemap.label));
            } catch (e) {
                this.pubSub.$emit(ApplicationError.eventName, e);
            }
        }

    }
</script>
