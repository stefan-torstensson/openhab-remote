<template>
    <page>
        <template v-slot:header>
            <div class="center-text page_heading">
                OpenHAB Url
            </div>
        </template>

        <div class="url-content">
            <input type="url" class="url-content_input" v-model="url"
                   placeholder="https://example.com" required>
            <span class="validity"></span>
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
    messageMap[VerificationResult.NETWORK_ERROR] = "Network Error";
    messageMap[VerificationResult.BAD_RESPONSE] = "Unknown response from server";
    messageMap[VerificationResult.NOT_OPENHAB] = "Remote does not look like OpenHAB";
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

    input:invalid + span:after {
        position: absolute;
        padding-left: 10px;
        content: '✖';
        color: $color-alert;
        background: linear-gradient(90deg, transparent 0%, $color-background 30%);
        right: 2px;
        top: 4px;
    }

    .url-content {
        position: relative;
        margin-top: 40px;

        &_error {
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
