import {Sitemap} from "@app/ui/openhab";
import {Location, Route, RouteConfig} from "vue-router";
import {inject} from "aurelia-dependency-injection";
import {AppSettings} from "@app/configuration";
import SettingsControl from "../settings/settings.vue";
import {routes} from "../settings/routes";
import SetupWizard from "../settings/setup-wizard.vue";

@inject(AppSettings)
export class RouteMapper {
    private appSettings: AppSettings;

    constructor(appSettings: AppSettings) {
        this.appSettings = appSettings;
    }

    get routes(): RouteConfig[] {
        return [
            {name: "page", path: "/page/:sitemap/:pageId/:widgetId?", component: Sitemap, props: true},
            {path: "/settings", component: SettingsControl, children: routes, meta: {navDepth: 1}},
            {name: "setup", path: "/setup", component: SetupWizard},
            {path: "*", redirect: this.defaultRoute.bind(this)}
        ];
    }

    private defaultRoute(route: Route): Location {
        const sitemap = this.appSettings.sitemapName;
        return sitemap ? {name: "page", params: {sitemap, pageId: sitemap}} : {name: "setup"};
    }
}
