import {Sitemap, WidgetControl} from "@app/ui/openhab";
import {Route, RouteConfig, Location} from "vue-router";
import {inject} from "aurelia-dependency-injection";
import {AppSettings} from "@app/configuration/app-settings";
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
            {name: "page", path: "/page/:sitemap/:pageId", component: Sitemap, props: true},
            {name: "widget", path: "/widget/:widgetId", component: WidgetControl, props: true},
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
