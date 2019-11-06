import Vue from "vue";

export enum AppEvent {
    QUIT = "quit",
    ERROR = "error",
    BEZEL_ROTATION = "bezelRotation",
    NAVIGATE_BACK = "navigateBack",
    HIDE = "hide",
    ONLINE_CHANGE = "onlineChange",
    LOADING_CHANGE = "loadingChange"
}

export class PubSub extends Vue {}

