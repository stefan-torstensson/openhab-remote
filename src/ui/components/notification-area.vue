<template>
    <div :class="{hidden: isOnline}">
        <offline-icon class="notification-icon" :class="{hidden: isOnline}"></offline-icon>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {Component} from "vue-property-decorator";
    import OfflineIcon from "@app/svg/offline.svg";
    import {Inject} from "@app/ui/ioc";
    import {AppEvent, PubSub} from "@app/ui/event-bus";


    @Component({components: {OfflineIcon}})
    export default class NotificationArea extends Vue {
        @Inject(PubSub)
        private pubSub: PubSub;

        private isOnline: boolean = true;

        mounted() {
            this.pubSub.$on(AppEvent.ONLINE_CHANGE, this.onlineChanged);
        }

        destroyed() {
            this.pubSub.$off(AppEvent.ONLINE_CHANGE, this.onlineChanged);
        }

        private onlineChanged(online: boolean) {
            this.isOnline = online;
        }
    }
</script>

<style lang="scss" scoped>
    .notification-icon {
        background-size: 100%;
        width:50px;
        height:50px;
    }
</style>
