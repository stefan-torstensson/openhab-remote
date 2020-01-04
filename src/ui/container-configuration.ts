import {container} from "@app/ui/ioc";
import {OpenhabSitemapState, OpenhabSitemapSubscriber, SitemapState, SitemapSubscriber} from "@app/api";
import {AppSettings} from "@app/configuration/app-settings";
import {PersistentSettings} from "@app/configuration/persistent-settings";

container.makeGlobal();
container.registerInstance("fetch", fetch.bind(global));
container.registerSingleton(AppSettings, PersistentSettings);
container.registerSingleton(SitemapSubscriber, OpenhabSitemapSubscriber);
container.registerSingleton(SitemapState, OpenhabSitemapState);
