import Vue from "vue";
import DebugView from "./debug.vue";
import "./tizen-stub";

Vue.config.productionTip = false;

document.addEventListener("DOMContentLoaded", () => {
    new DebugView({el: "#debug"});
});
