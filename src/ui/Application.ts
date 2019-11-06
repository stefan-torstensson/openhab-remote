import VueRouter from "vue-router";
import {inject} from "aurelia-dependency-injection";
import RootView from "./root.vue";
import {AppEvent, PubSub} from "./event-bus";
import {SitemapState} from "@app/api";
import {Router} from "@app/ui/routing/router";

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
        this.on("tizenhwkey", this.onHWKey);
        this.on("rotarydetent", this.onBezelRotation);
        this.on("visibilitychange", this._onVisibilityChange);
        this.on("online", this.onOnlineChanged, global);
        this.on("offline", this.onOnlineChanged, global);

        this._pubsub.$on(AppEvent.HIDE, Application.hide);
        this._pubsub.$on(AppEvent.QUIT, Application.quit);

        this.emitOnline(global.navigator.onLine);

        new RootView({
            el: rootId,
            router: this._router
        });
    }

    private on(eventName: string, handler: (e: any) => void, target: EventTarget = this._doc) {
        target.addEventListener(eventName, handler.bind(this));
    }

    private onHWKey(e: any) {
        if (e.keyName === "back") {
            this.onBackKey();
        }
    }

    private onBackKey() {
        this._pubsub.$emit(AppEvent.NAVIGATE_BACK);
    }

    private onBezelRotation(e: any) {
        this._pubsub.$emit(AppEvent.BEZEL_ROTATION, e.detail.direction);
    }

    private emitOnline(online: boolean) {
        this._pubsub.$emit(AppEvent.ONLINE_CHANGE, online);
    }

    private onOnlineChanged(e: Event) {
        this.emitOnline((e.type === "online"));
    }

    private _onVisibilityChange() {
        this.emitOnline(this._doc.visibilityState === "visible" && global.navigator.onLine);
    }
}
