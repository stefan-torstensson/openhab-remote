import {Page} from "@app/ui/components";
import {mount, shallowMount, Wrapper} from "@vue/test-utils";
import {expect, sinon} from "test-env";
import Vue from "vue";
import {AppEvent, PubSub} from "@app/ui/event-bus";
import {vuePropWarnFilter} from "../../utils";
import {SinonSpy} from "sinon";

describe("Page tests", () => {
    let component: Wrapper<Page>;
    let pubSub: PubSub;

    before(() => {
        Vue.config.warnHandler = vuePropWarnFilter(["pubsub"]);
    });

    after(() => {
        delete Vue.config.warnHandler;
    });

    describe("event binding", () => {
        beforeEach(() => {
            pubSub = new PubSub();
            sinon.spy(pubSub, "$off");
            sinon.spy(pubSub, "$on");

            component = mount(Page, {
                data: () => ({pubsub: pubSub}),
            });
        });

        it("should bind", () => {
            expect(pubSub.$on).to.have.been.calledOnceWith(AppEvent.BEZEL_ROTATION);
        });

        it("should unbind", () => {
            component.destroy();
            const onArgs = (pubSub.$on as SinonSpy).firstCall.args;
            expect(pubSub.$off).to.have.been.calledWith(...(onArgs));
        });
    });

    describe("slots", () => {
        describe("when only content is supplied", () => {
            beforeEach(() => {
                component = shallowMount(Page, {
                    slots: {
                        default: "Default content"
                    }
                })
            });

            it("should not have any header", () => {
                expect(component.contains("div.header")).to.be.false;
            });

            it("should not have any footer", () => {
                expect(component.contains("div.footer")).to.be.false;
            });

            it("should render content", () => {
                const content =component.find("div.content");
                expect(content.text()).to.equal("Default content");
            });

            it("should render content", () => {
                const content =component.find("div.content");
                expect(content.element.className).to.include("content");
                expect(content.element.className).to.include("content--footer-hidden");
                expect(content.element.className).to.include("content--header-hidden");
            });
        });

        describe("when header is supplied", () => {
            beforeEach(() => {
                component = shallowMount(Page, {
                    slots: {
                        header: "Header",
                        default: "Content"
                    }
                })
            });

            it("should render header", () => {
                const header = component.find("div.header");
                expect(header.text()).to.equal("Header");
            });

            it("should not have any footer", () => {
                expect(component.contains("div.footer")).to.be.false;
            });

            it("should render content", () => {
                const content =component.find("div.content");
                expect(content.element.className).to.not.include("content--header-hidden");
                expect(content.element.className).to.include("content--footer-hidden");
            });
        });

        describe("when footer is supplied", () => {
            beforeEach(() => {
                component = shallowMount(Page, {
                    slots: {
                        default: "Content",
                        footer: "Footer"
                    }
                })
            });

            it("should not render header", () => {
                expect(component.contains("div.header")).to.be.false;
            });

            it("should render footer", () => {
                const footer = component.find("div.footer");
                expect(footer.text()).to.equal("Footer");
            });

            it("should render content", () => {
                const content =component.find("div.content");
                expect(content.element.className).to.include("content--header-hidden");
                expect(content.element.className).to.not.include("content--footer-hidden");
            });
        });

    });
});
