import Navigation from "./navigation.vue";
import RemoteUrl from "./remote-url.vue";
import SitemapName from "./sitemap-name.vue";
import AppInfo from "./appinfo.vue";

export const routes = [
    {name: "settings", path: "", component: Navigation},
    {path: "url", component: RemoteUrl},
    {path: "sitemap", component: SitemapName},
    {path: "appinfo", component: AppInfo }
];
