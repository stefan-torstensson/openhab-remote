import {container} from "@app/ui/ioc";
import {IS_OFFLINE} from "@app/ui/globals";
import {Configuration, LocalStorage} from "@app/configuration";
import {DummySitemapSubscriber, OpenhabSitemapSubscriber, SitemapSubscriber} from "@app/api";
import {AppSettings} from "@app/configuration/app-settings";
import {PersistentSettings} from "@app/configuration/persistent-settings";

container.makeGlobal();
container.registerInstance("fetch", fetch.bind(global));
container.registerSingleton(Configuration, LocalStorage);
container.registerSingleton(AppSettings, PersistentSettings);

if (IS_OFFLINE) {
    container.registerSingleton(SitemapSubscriber, DummySitemapSubscriber);
} else {
    container.registerSingleton(SitemapSubscriber, OpenhabSitemapSubscriber);
}
