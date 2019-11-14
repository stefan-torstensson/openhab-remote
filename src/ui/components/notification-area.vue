<template>
    <div :class="{hidden: !notificationActive}">
        <offline-icon class="notification-icon" :class="{hidden: isOnline}"></offline-icon>
        <subscription-offline-icon class="notification-icon"
                                   :class="{hidden: isSubscriptionActive}"
                                   @click="refreshPage()"></subscription-offline-icon>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component} from "vue-property-decorator";
    import OfflineIcon from "@app/svg/offline.svg";
    import SubscriptionOfflineIcon from "@app/svg/reload.svg";
    import {Inject} from "@app/ui/ioc";
    import {AppEvent, PubSub} from "@app/ui/event-bus";


    @Component({components: {OfflineIcon, SubscriptionOfflineIcon}})
    export default class NotificationArea extends Vue {
        @Inject(PubSub)
        private pubSub: PubSub;

        private get notificationActive(): boolean {
            return [this.isOnline, this.isSubscriptionActive].some((status: boolean) => !status);
        }

        private isOnline: boolean = true;
        private isSubscriptionActive: boolean = true;

        mounted() {
            this.pubSub.$on(AppEvent.ONLINE_CHANGE, this.onlineChanged);
            this.pubSub.$on(AppEvent.SUBSCRIPTION_ACTIVE_CHANGE, this.subscriptionActiveChanged);
        }

        destroyed() {
            this.pubSub.$off(AppEvent.ONLINE_CHANGE, this.onlineChanged);
            this.pubSub.$off(AppEvent.SUBSCRIPTION_ACTIVE_CHANGE, this.subscriptionActiveChanged);
        }

        private onlineChanged(online: boolean) {
            this.isOnline = online;
        }

        private subscriptionActiveChanged(active: boolean) {
            this.isSubscriptionActive = active;
        }

        private refreshPage(): void {
            this.pubSub.$emit(AppEvent.REFRESH_PAGE);
        }


    }
</script>

<style lang="scss" scoped>
    .notification-icon {
        background-size: 100%;
        width: 50px;
        height: 50px;
    }
</style>
