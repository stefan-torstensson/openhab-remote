<template>
    <div class="application-root" :class="theme">
        <router-view/>
        <div class="settings-area center-vertically">
            <settings-button></settings-button>
        </div>
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

    .settings-area {
        position:absolute;
        right:0;
        top:50%;
    }
</style>


<script lang="ts">
    import Vue from "vue";
    import {Component, Ref, Watch} from "vue-property-decorator";
    import {SettingsButton, Modal} from "@app/ui/components";
    import {AppEvent, PubSub} from "../ui/event-bus";
    import {Inject} from "@app/ui/ioc";
    import {ApplicationError} from "@app/common/application-error";
    import {Route} from "vue-router";
    import LoadingIndicator from "@app/ui/components/loading-indicator.vue";
    import {AppSettings} from "@app/configuration/app-settings";

    @Component({
        components: {LoadingIndicator, SettingsButton, Modal}
    })
    export default class Root extends Vue {
        @Inject(PubSub)
        private pubsub: PubSub;

        @Inject(AppSettings)
        private appSettings: AppSettings;

        @Ref("modal")
        private modal: Modal;

        private loading: boolean = false;

        private theme: string = "";

        @Watch("$route")
        setTitle(route: Route) {
            document.title = `OpenHab - ${route.path}`;
        }

        setTheme() {
            this.theme = this.appSettings.theme || "theme-blue";
        }

        created() {
            this.pubsub.$on(ApplicationError.eventName, this.onAppError);
            this.pubsub.$on(AppEvent.LOADING_CHANGE, this.onLoadingChange);
            this.pubsub.$on(AppEvent.THEME_CHANGE, this.setTheme);
        }

        beforeDestroy() {
            this.pubsub.$off(ApplicationError.eventName, this.onAppError);
            this.pubsub.$off(AppEvent.LOADING_CHANGE, this.onLoadingChange);
            this.pubsub.$off(AppEvent.THEME_CHANGE, this.setTheme);
        }

        mounted() {
            this.setTitle(this.$route);
            this.setTheme();
        }

        onAppError(error: ApplicationError) {
            this.modal.show(error.heading, error.message);
        }

        private onLoadingChange(loading: boolean) {
            this.loading = loading;
        }
    }
</script>
