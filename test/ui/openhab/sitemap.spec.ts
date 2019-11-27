import {assert, expect, sinon} from "test-env";
import Sitemap from "@app/ui/openhab/sitemap.vue";
import {shallowMount, Wrapper} from "@vue/test-utils";
import Vue from "vue";
import {SitemapState} from "@app/api/sitemap-state";
import {Widget} from "@app/api/openhab-types";
import WidgetList from "@app/ui/openhab/widget-list.vue";
import WidgetRenderer from "@app/ui/openhab/widget-renderer.vue";
import {AppEvent, PubSub} from "@app/ui/event-bus";
import {vuePropWarnFilter} from "../../utils";

describe("Sitemap tests", () => {
    let mockData: {
        state: SitemapState,
        pubsub: PubSub
    };

    before(() => {
        Vue.config.warnHandler = vuePropWarnFilter(["state", "pubsub"]);
    });

    after(() => {
        delete Vue.config.warnHandler;
    });

    beforeEach(() => {
        mockData = {
            state: {
                pageTitle: "",
                postUpdate: sinon.spy(),
                stop: sinon.spy(),
                widgets: [],
                setActivePage: sinon.spy()
            },
            pubsub: new PubSub()
        };
    });

    describe("when loaded without parameters", () => {
        let sitemap: Wrapper<Sitemap>;
        beforeEach(() => {
            sitemap = shallowMount(Sitemap, {
                data: () => mockData
            });
        });

        it("should render startup logo", () => {
            assert(sitemap.contains("div.startup-logo"));
            assert(!sitemap.contains(WidgetList));
            assert(!sitemap.contains(WidgetRenderer));
        });

        it("should not call setActivePage", () => {
            expect(mockData.state.setActivePage).to.not.have.been.called;
        });
    });

    describe("when loaded with sitemap and pageId", () => {
        let sitemap: Wrapper<Sitemap>;

        beforeEach(() => {
            sitemap = shallowMount(Sitemap, {
                data: () => mockData,
                propsData: {
                    sitemap: "sitemap name",
                    pageId: "01"
                }
            });
        });

        it("should initially render startup logo", () => {
            assert(sitemap.contains("div.startup-logo"));
        });

        it("should setActivePage", () => {
            expect(mockData.state.setActivePage).to.have.been.calledOnceWith("sitemap name", "01");
        });

        it("should render widget list", () => {
            mockData.state.widgets.push({} as Widget);
            assert(!sitemap.contains("div.startup-logo"));
            assert(sitemap.contains(WidgetList));
            assert(!sitemap.contains(WidgetRenderer));
        });

        it("should set props on widget list", () => {
            mockData.state.widgets.push({} as Widget);
            mockData.state.pageTitle = "tt";

            const widgetList = sitemap.find(WidgetList);
            expect(widgetList.props().widgets).to.deep.equal(mockData.state.widgets);
            expect(widgetList.props().title).to.equal("tt");
        });

        describe("when pubsub events are emitted", () => {
            beforeEach(() => {
                mockData.state.setActivePage.resetHistory();
            });

            it("should not", () => {
                expect(mockData.state.setActivePage).to.not.have.been.called;
            });

            it("should call setActivePage when app comes online", () => {
                mockData.pubsub.$emit(AppEvent.ONLINE_CHANGE, false);
                expect(mockData.state.setActivePage).to.not.have.been.called;
            });

            it("should call setActivePage when app comes online", () => {
                mockData.pubsub.$emit(AppEvent.ONLINE_CHANGE, true);
                expect(mockData.state.setActivePage).to.have.been.calledOnceWith("sitemap name", "01");
            });

            it("should call setActivePage when app comes online", () => {
                mockData.pubsub.$emit(AppEvent.REFRESH_PAGE);
                expect(mockData.state.setActivePage).to.have.been.calledOnceWith("sitemap name", "01");
            });
        });

    });

    describe("when loaded with sitemap, pageId and widgetId", () => {
        let sitemap: Wrapper<Sitemap>;

        beforeEach(() => {
            sitemap = shallowMount(Sitemap, {
                data: () => mockData,
                propsData: {
                    sitemap: "sitemap name",
                    pageId: "01",
                    widgetId: "wId"
                }
            });
        });

        it("should initially render startup logo", () => {
            assert(sitemap.contains("div.startup-logo"));
        });

        it("should ", () => {
            mockData.state.widgets.push({widgetId: "wId"} as Widget);
            assert(sitemap.contains(WidgetRenderer));
            assert(!sitemap.contains("div.startup-logo"));
            assert(!sitemap.contains(WidgetList));
        });

        it("should ", () => {
            mockData.state.widgets.push({widgetId: "foo"} as Widget);
            mockData.state.widgets.push({widgetId: "wId"} as Widget);
            const widgetRenderer = sitemap.find(WidgetRenderer);

            expect(widgetRenderer.props().widget).to.equal(mockData.state.widgets[1]);
        });
    });
});
