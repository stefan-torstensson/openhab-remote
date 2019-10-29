import "@app/style/index.scss";
import "reflect-metadata";
import Vue from "vue";
import VueRouter from "vue-router";
import {container} from "@app/ui/ioc";
import {logger} from "@app/common/logging";
import Playground from "./playground.vue";

declare var global: any;
global.logger = logger;

container.makeGlobal();
Vue.use(VueRouter);

global.document.addEventListener("DOMContentLoaded", () => {
    new Playground({el: "#app"});
});

