<template>
    <page>
        <form-input class="remote-url_input" v-model="url" label="openHAB URL"
                    placeholder="https://example.com"></form-input>
        <form-input class="remote-url_input" v-model="username" label="Username"></form-input>
        <form-input class="remote-url_input" v-model="password" label="Password"
                    :type="maskedPassword?'password':'text'"></form-input>
        <div class="remote-url_error" ref="errorMessage">{{errorMessage}}</div>

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
    import {ArcButton, Page, FormInput} from "@app/ui/components";
    import {Inject} from "@app/ui/ioc";
    import {SitemapClient} from "@app/api";
    import {AppSettings} from "@app/configuration";
    import {VerificationResult} from "@app/api/sitemap-client";
    import {AppEvent, PubSub} from "@app/ui/event-bus";
    import {isNullOrEmpty} from "@app/common/string-utils";

    const messageMap: { [k: number]: string } = {};
    messageMap[VerificationResult.NETWORK_ERROR] = "Could not connect. Make sure you entered correct url and that the watch has network access.";
    messageMap[VerificationResult.BAD_RESPONSE] = "Unexpected response from server. Make sure you entered correct url.";
    messageMap[VerificationResult.NOT_OPENHAB] = "Remote does not look like openHAB 2.3+";
    messageMap[VerificationResult.INVALID_URL] = "Invalid Url format";
    messageMap[VerificationResult.PERMISSION_DENIED] = "Permission denied. Invalid username or password";


    @Component({
        components: {Page, ArcButton, FormInput}
    })
    export default class RemoteUrl extends Vue {
        @Inject(SitemapClient)
        private sitemapClient: SitemapClient;

        @Inject(AppSettings)
        private appSettings: AppSettings;

        @Inject(PubSub)
        private pubSub: PubSub;

        private maskedPassword: boolean = true;
        private url: string = "";
        private username: string = "";
        private password: string = "";

        private errorMessage: string = "";

        mounted() {
            this.url = this.appSettings.remoteUrl;
            this.password = this.appSettings.password;
            this.username = this.appSettings.username;
            this.maskedPassword = !isNullOrEmpty(this.password);
        }

        @Watch("url")
        private clearError() {
            this.errorMessage = "";
        }

        @Watch("password")
        private unmaskPassword(password: string) {
            if (isNullOrEmpty(password)) {
                this.maskedPassword = false;
            }
        }

        private async save() {
            if (!this.url) {
                return;
            }
            const hasCredentials = !isNullOrEmpty(this.username) || !isNullOrEmpty(this.password);
            if (!this.url.includes("://")) {
                this.url = (hasCredentials ? "https://" : "http://") + this.url;
            }
            if (hasCredentials && !this.url.includes("https:")) {
                this.showErrorMessage("HTTPS is required when using credentials");
                return;
            }
            const result = await this.sitemapClient.verifyUrl(this.url, this.username, this.password);
            if (result === VerificationResult.OK) {
                if (this.appSettings.remoteUrl !== this.url) {
                    this.appSettings.sitemapName = null;
                }
                this.appSettings.remoteUrl = this.url;
                this.appSettings.username = this.username;
                this.appSettings.password = this.password;
                this.pubSub.$emit(AppEvent.NAVIGATE_BACK);
            } else {
                this.showErrorMessage(messageMap[result]);
            }
        }

        private showErrorMessage(message: string) {
            this.errorMessage = message;
            this.$nextTick(() => {
                const errorDiv = this.$refs.errorMessage as HTMLElement;
                errorDiv.parentElement.scrollTop = errorDiv.parentElement.scrollHeight;
            });
        }
    }
</script>

<style lang="scss" scoped>
    @import "~settings";

    .remote-url {
        &_error {
            font-size: .8em;
            color: $color-alert;
        }

        &_input {
            margin: 20px 0;
        }
    }

</style>
