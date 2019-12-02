import "@app/style/index.scss";
import "reflect-metadata";
import Vue from "vue";
import VueRouter from "vue-router";
import {container} from "@app/ui/ioc";
import Playground from "./playground.vue";
import {routes} from "./routes";
import {SitemapState} from "@app/api";
import {FakeSitemapState} from "./fakes/fake-sitemap-state";

container.makeGlobal();
container.registerSingleton(SitemapState, FakeSitemapState);

Vue.use(VueRouter);

global.document.addEventListener("DOMContentLoaded", () => {
    new Playground({
        el: "#app",
        router: new VueRouter({routes})
    });
});
