<template>
    <div class="application-root" :class="theme">
        <router-view/>
        <div class="settings-area center-vertically">
            <settings-button></settings-button>
        </div>
        <notification-area class="notification-area"></notification-area>
        <modal ref="modal"></modal>
        <loading-indicator class="loading-indicator" :running="loading"></loading-indicator>
    </div>
</template>

<style lang="scss">
    .loading-indicator {
        position: absolute;
        top:0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .notification-area {
        position: absolute;
        left: 50%;
        bottom: 20px;
        transform: translateX(-50%);
    }

    .settings-area {
        position:absolute;
        right:0;
        top:50%;
    }
</style>


<script lang="ts">
    import Vue from "vue";
    import {Component, Watch} from "vue-property-decorator";
    import {SettingsButton, Modal, NotificationArea} from "@app/ui/components";
    import {AppEvent, PubSub} from "../ui/event-bus";
    import {Inject} from "@app/ui/ioc";
    import {ApplicationError} from "@app/common/application-error";
    import {Route} from "vue-router";
    import LoadingIndicator from "@app/ui/components/loading-indicator.vue";
    import {AppSettings} from "@app/configuration/app-settings";

    @Component({
        components: {LoadingIndicator, SettingsButton, Modal, NotificationArea}
    })
    export default class Root extends Vue {
        @Inject(PubSub)
        private pubsub: PubSub;

        @Inject(AppSettings)
        private appSettings: AppSettings;

        private loading: boolean = false;

        private theme: string = "";

        get modal(): Modal {
            return this.$refs.modal as Modal;
        }

        @Watch("$route")
        setTitle(route: Route) {
            document.title = `OpenHab - ${route.path}`;
        }

        setTheme() {
            this.theme = this.appSettings.theme || "theme-blue";
        }

        mounted() {
            this.setTitle(this.$route);
            this.setTheme();
            this.pubsub.$on(ApplicationError.eventName, this.onAppError);
            this.pubsub.$on(AppEvent.LOADING_CHANGE, this.onLoadingChange);
            this.pubsub.$on(AppEvent.THEME_CHANGE, this.setTheme);
        }

        onAppError(error: ApplicationError) {
            this.modal.show(error.heading, error.message);
        }

        private onLoadingChange(loading: boolean) {
            this.loading = loading;
        }
    }
</script>
