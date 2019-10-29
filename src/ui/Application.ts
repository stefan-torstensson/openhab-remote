import VueRouter from "vue-router";
import {inject} from "aurelia-dependency-injection";
import RootView from "./root.vue";
import {AppEvent, PubSub} from "./event-bus";
import {SitemapState} from "@app/api";
import {Router} from "@app/ui/routing/router";

declare var tizen: any;

@inject(global.document, PubSub, SitemapState, Router)
export class Application {
    private static hide() {
        try {
            tizen.application.getCurrentApplication().hide();
        } catch (e) {
            console.error(e);
        }
    }

    private static quit() {
        try {
            tizen.application.getCurrentApplication().exit();
        } catch (e) {
            console.error(e);
        }
    }

    private readonly _doc: Document;
    private readonly _router: VueRouter;
    private readonly _pubsub: PubSub;
    private readonly _state: SitemapState;

    constructor(doc: Document, pubsub: PubSub, state: SitemapState, router: Router) {
        this._doc = doc;
        this._pubsub = pubsub;
        this._state = state;
        this._router = router;
    }

    start(rootId: string) {
        new RootView({
            el: rootId,
            router: this._router
        });
        this._on("tizenhwkey", this._onHWKey);
        this._on("visibilitychange", this._onVisibilityChange);
        this._on("rotarydetent", this._onBezelRotation);
        this._on("online", this._online, global);
        this._on("offline", this._online, global);

        this._pubsub.$on(AppEvent.HIDE, Application.hide);
        this._pubsub.$on(AppEvent.QUIT, Application.quit);
    }

    private _on(eventName: string, handler: (e: any) => void, target: EventTarget = this._doc) {
        target.addEventListener(eventName, handler.bind(this));
    }

    private _online(e: Event) {
    }

    private _onHWKey(e: any) {
        if (e.keyName === "back") {
            this._onBackKey();
        }
    }

    private _onBackKey() {
        this._pubsub.$emit(AppEvent.NAVIGATE_BACK);
    }

    private _onBezelRotation(e: any) {
        this._pubsub.$emit(AppEvent.BEZEL_ROTATION, e.detail.direction);
    }

    private _onVisibilityChange() {
        this._pubsub.$emit(AppEvent.VISIBILITY_CHANGE, this._doc.visibilityState);
    }
}
