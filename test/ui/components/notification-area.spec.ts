import {expect} from "test-env";
import {shallowMount, Wrapper} from "@vue/test-utils";
import Vue from "vue";
import SliderControl from "@app/ui/components/slider-control.vue";
import {AppEvent, PubSub} from "@app/ui/event-bus";
import {vuePropWarnFilter} from "../../utils";
import {NotificationArea} from "@app/ui/components";
import {OfflineIcon, ReloadIcon} from "@app/svg";

describe("NotificationArea tests", () => {
    let component: Wrapper<SliderControl>;
    let pubSub: PubSub;

    before(() => {
        Vue.config.warnHandler = vuePropWarnFilter(["pubSub"]);
    });

    after(() => {
        delete Vue.config.warnHandler;
    });

    describe("When default props are used", () => {
        beforeEach(() => {
            pubSub = new PubSub();
            component = shallowMount(NotificationArea, {data: () => ({pubSub})});
        });

        it("should not show any notifications when loaded", () => {
            expect(component.isEmpty()).to.be.true;
        });

        it("should show offline icon when ONLINE is false", () => {
            pubSub.$emit(AppEvent.ONLINE_CHANGE, false);

            expect(component.contains(OfflineIcon)).to.be.true;
            expect(component.contains(ReloadIcon)).to.be.false;
        });

        it("should reload icon when SUBSCRIPTION_ACTIVE is false", () => {
            pubSub.$emit(AppEvent.SUBSCRIPTION_ACTIVE_CHANGE, false);

            expect(component.contains(OfflineIcon)).to.be.false;
            expect(component.contains(ReloadIcon)).to.be.true;
        });

        it("should only show offline icon when offline with no subscription", () => {
            pubSub.$emit(AppEvent.ONLINE_CHANGE, false);
            pubSub.$emit(AppEvent.SUBSCRIPTION_ACTIVE_CHANGE, false);

            expect(component.contains(OfflineIcon)).to.be.true;
            expect(component.contains(ReloadIcon)).to.be.false;
        });
    });
});
