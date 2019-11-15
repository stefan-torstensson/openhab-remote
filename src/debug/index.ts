import Vue from "vue";
import DebugView from "./debug.vue";

Vue.config.productionTip = false;

document.addEventListener("DOMContentLoaded", () => {
    new DebugView({el: "#debug"});
});
