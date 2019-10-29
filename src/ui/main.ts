import "../style/index.scss";
import "core-js/stable";
import "regenerator-runtime/runtime";
import "reflect-metadata";
import "./register-hooks";
import "./container-configuration";
import "./directives";
import Vue from "vue";
import VueRouter from "vue-router";
import {Application} from "./Application";
import {container} from "./ioc";
import {PubSub} from "@app/ui/event-bus";
import {ApplicationError} from "@app/common/application-error";

Vue.config.productionTip = false;
Vue.use(VueRouter);

const pubsub: PubSub = container.get(PubSub);
Vue.config.errorHandler = (err: Error, vm: Vue, info: string) => {
    pubsub.$emit(ApplicationError.eventName,
        new ApplicationError("Vue Error", `${err.message} ${info}`, err));
};

global.document.addEventListener("DOMContentLoaded", () => {
    const application: Application = container.get(Application);
    application.start("#app");
});

