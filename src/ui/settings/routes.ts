import Navigation from "./navigation.vue";
import RemoteUrl from "./remote-url.vue";
import SitemapName from "./sitemap-name.vue";
import AppInfo from "./appinfo.vue";
import ThemeSelection from "./theme-selection.vue";

export const routes = [
    {name: "settings", path: "", component: Navigation},
    {path: "url", component: RemoteUrl},
    {path: "sitemap", component: SitemapName},
    {path: "theme", component: ThemeSelection},
    {path: "appinfo", component: AppInfo }
];
