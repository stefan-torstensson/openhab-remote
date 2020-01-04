import Vue from "vue";

export enum AppEvent {
    QUIT = "quit",
    ERROR = "error",
    BEZEL_ROTATION = "bezelRotation",
    NAVIGATE_BACK = "navigateBack",
    HIDE = "hide",
    REFRESH_PAGE = "refreshPage",
    ONLINE_CHANGE = "onlineChange",
    LOADING_CHANGE = "loadingChange",
    SUBSCRIPTION_ACTIVE_CHANGE = "subscriptionChange",
    THEME_CHANGE = "themeChanged"
}

export class PubSub extends Vue {}

