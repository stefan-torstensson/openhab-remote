import {shallowMount, Wrapper} from "@vue/test-utils";
import WidgetControl from "@app/ui/openhab/widgets/widget-control";
import {Item, Widget} from "@app/api/openhab-types";
import {expect} from "test-env";
import {StubbedInstance, stubInterface} from "ts-sinon";
import {SitemapState} from "@app/api";
import Vue from "vue";
import {vuePropWarnFilter} from "../../../utils";

describe("WidgetControl tests", () => {
    let widgetControl: Wrapper<WidgetControl>;
    let sitemapStateStub: StubbedInstance<SitemapState>;
    let itemStub: Item;
    let widgetStub: Widget;

    before(() => {
        Vue.config.warnHandler = vuePropWarnFilter(["sitemapState"]);
    });

    after(() => {
        delete Vue.config.warnHandler;
    });

    beforeEach(() => {
        sitemapStateStub = stubInterface(SitemapState);
        itemStub = {
            link: "",
            state: "FOO",
            type: ""
        };
        widgetStub = {
            type: "",
            widgetId: "123",
            label: "Description [value]",
            widgets: [],
            item: itemStub
        };
        widgetControl = shallowMount(WidgetControl, {
            propsData: {widget: widgetStub},
            data: () => ({sitemapState: sitemapStateStub})
        });
    });

    it("should expose item property from widget", () => {
        expect(widgetControl.vm.item).to.equal(itemStub);
    });

    it("should expose item state", () => {
        expect(widgetControl.vm.state).to.equal("FOO");
    });

    it("should parse static widget label part into label", () => {
        expect(widgetControl.vm.label).to.equal("Description");
    });

    it("should parse dynamic widget label part into stateLabel", () => {
        expect(widgetControl.vm.stateLabel).to.equal("value");
    });

    it("should post state updates to sitemapState", () => {
        widgetControl.vm.setState("OFF");
        expect(sitemapStateStub.postUpdate).to.have.been.calledOnceWith(itemStub, "OFF");
    });
});
