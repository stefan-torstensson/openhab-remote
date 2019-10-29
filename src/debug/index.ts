import Vue from "vue";
import DebugView from "./debug.vue";
import {logger} from "@app/common/logging";

Vue.config.productionTip = false;

declare var global: any;
global.logger = logger;

document.addEventListener("DOMContentLoaded", () => {
    new DebugView({el: "#debug"});
});
