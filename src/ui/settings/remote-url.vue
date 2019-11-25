<template>
    <page>
        <template v-slot:header>
            <div class="center-text page_heading">
                openHAB Url
            </div>
        </template>

        <div class="url-content">
            <input type="url" class="url-content_input" v-model="url"
                   placeholder="https://example.com">
            <div class="url-content_error">{{errorMessage}}</div>
        </div>

        <template v-slot:footer>
            <arc-button position="bottom" @click="save()">
                Save
            </arc-button>
        </template>
    </page>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component, Watch} from "vue-property-decorator";
    import {ArcButton, Page} from "@app/ui/components";
    import {Inject} from "@app/ui/ioc";
    import {SitemapClient} from "@app/api";
    import {AppSettings} from "@app/configuration/app-settings";
    import {VerificationResult} from "@app/api/sitemap-client";
    import {AppEvent, PubSub} from "@app/ui/event-bus";

    const messageMap: { [k: number]: string } = {};
    messageMap[VerificationResult.NETWORK_ERROR] = "Network Error. Make sure you're online and the host is available on the current network.";
    messageMap[VerificationResult.BAD_RESPONSE] = "The server responded with an error";
    messageMap[VerificationResult.NOT_OPENHAB] = "Remote does not look like openHAB 2.3+";
    messageMap[VerificationResult.INVALID_URL] = "Invalid Url format";


    @Component({
        components: {Page, ArcButton}
    })
    export default class RemoteUrl extends Vue {
        @Inject(SitemapClient)
        private sitemapClient: SitemapClient;

        @Inject(AppSettings)
        private appSettings: AppSettings;

        @Inject(PubSub)
        private pubSub: PubSub;

        private url: string = "";

        private errorMessage: string = "";

        mounted() {
            this.url = this.appSettings.remoteUrl;
        }

        @Watch("url")
        private clearError() {
            this.errorMessage = "";
        }

        private async save() {
            if (!this.url) {
                return;
            }
            if (!this.url.includes("://")) {
                this.url = "http://" + this.url;
            }
            const result = await this.sitemapClient.verifyUrl(this.url);
            if (result === VerificationResult.OK) {
                if (this.appSettings.remoteUrl !== this.url) {
                    this.appSettings.sitemapName = null;
                }
                this.appSettings.remoteUrl = this.url;
                this.pubSub.$emit(AppEvent.NAVIGATE_BACK);
            } else {
                this.errorMessage = messageMap[result];
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '~settings';

    .url-content {
        position: relative;
        margin-top: 40px;

        &_error {
            font-size: .8em;
            color: $color-alert;
        }

        &_input {
            width: 100%;
            background: $color-background;
            color: $color-primary;
            font-size: inherit;
            border: none;
            border-bottom: 2px solid $color-primary;
        }
    }

</style>
