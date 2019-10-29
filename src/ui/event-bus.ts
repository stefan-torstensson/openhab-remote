import Vue from "vue";

export enum AppEvent {
    QUIT = "quit",
    ERROR = "error",
    VISIBILITY_CHANGE = "visibilityChange",
    BEZEL_ROTATION = "bezelRotation",
    NAVIGATE_BACK = "navigateBack",
    HIDE = "hide",
    LOADING_CHANGE = "loadingChange"
}

export class PubSub extends Vue {}

