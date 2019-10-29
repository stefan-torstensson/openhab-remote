import VueRouter, {Route} from "vue-router";
import {inject} from "aurelia-dependency-injection";
import {RouteMapper} from "@app/ui/routing/route-mapper";
import {AppEvent, PubSub} from "@app/ui/event-bus";
import {Logger, logger} from "@app/common/logging";

@inject(RouteMapper, PubSub, global)
export class Router extends VueRouter {
    private readonly log: Logger = logger.get(Router);
    private pubSub: PubSub;
    private navDepth: number = 0;

    constructor(routeMapper: RouteMapper, pubSub: PubSub, window: Window) {
        super({routes: routeMapper.routes});
        this.pubSub = pubSub;
        this.pubSub.$on(AppEvent.NAVIGATE_BACK, this._navigateBack.bind(this));
        window.addEventListener("popstate", this._pop.bind(this));
        this.afterEach(this._onAfterEach.bind(this));
    }

    private _navigateBack() {
        if (this.navDepth === 0) {
            this.pubSub.$emit(AppEvent.HIDE);
        } else {
            this.go(-1);
        }
    }

    private _onAfterEach(to: Route, from: Route) {
        if (to.redirectedFrom === "/" || from.path === "/") {
            this.navDepth = 0;
        } else if (!to.redirectedFrom) {
            this.navDepth++;
        }
        this.log.info("Navigation depth:", this.navDepth);
    }

    private _pop() {
        this.navDepth -= 2;
    }
}
