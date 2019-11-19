import {expect} from "test-env";
import {shallowMount, Wrapper} from "@vue/test-utils";
import Vue from "vue";
import SliderControl from "@app/ui/components/slider-control.vue";
import CircularSlider from "@app/ui/components/circular-slider.vue";
import {AppEvent, PubSub} from "@app/ui/event-bus";
import {sleep} from "../../utils";

describe("SliderControl tests", () => {

    let component: Wrapper<SliderControl>;

    before(() => {
        Vue.config.warnHandler = (msg: string, vm: Vue, trace: string) => {
            if (msg.includes('The computed property "pubsub" is already defined in data.')) {
                return;
            }
            console.warn(`Vue warn: ${msg}`);
        };
    });

    after(() => {
        delete Vue.config.warnHandler;
    });

    describe("When default props are used", () => {
        beforeEach(() => {
            component = shallowMount(SliderControl, {propsData: {value: 20}});
        });

        it("should set default props data", () => {
            expect(component.props()).to.deep.equal({
                value: 20,
                maxValue: 100,
                minValue: 0,
                stepSize: 10
            });
        });

        it("should contain a circular slider", () => {
            expect(component.contains(CircularSlider)).to.be.true;
        });

        it("should render value text", () => {
            expect(component.text()).to.equal("20");
        });

        it("should set value on CircularSlider", () => {
            const slider = component.find(CircularSlider);
            expect(slider.props().value).to.equal(20);
        });
    });

    describe("when custom props are set", () => {
        let pubsub: PubSub;
        const propsData = {
            value: 15,
            minValue: 10,
            maxValue: 20,
            stepSize: 1,
        };

        beforeEach(() => {
            pubsub = new PubSub();
            const data = () => ({pubsub});
            component = shallowMount(SliderControl, {propsData, data});
        });

        it("should set supplied props", () => {
            expect(component.props()).to.deep.equal(propsData);
        });

        it("should render value text", () => {
            expect(component.text()).to.equal("15");
        });

        it("should set normalized value on CircularSlider", () => {
            const slider = component.find(CircularSlider);
            expect(slider.props().value).to.equal(50);
        });

        describe("when bezel has been rotated clockwise", () => {
            beforeEach(async () => {
                pubsub.$emit(AppEvent.BEZEL_ROTATION, "CW");
                await sleep(205);
            });

            it("should emit change event with new value", async () => {
                expect(component.emitted().change).to.be.instanceOf(Array);
                expect(component.emitted().change[0]).to.deep.equal([16]);
            });

            it("should set update normalized value on CircularSlider", () => {
                const slider = component.find(CircularSlider);
                expect(slider.props().value).to.equal(60);
            });

            it("should render updated value text", () => {
                expect(component.text()).to.equal("16");
            });
        });

        describe("when bezel has been rotated counter clockwise", () => {
            beforeEach(async () => {
                pubsub.$emit(AppEvent.BEZEL_ROTATION, "CCW");
                await sleep(205);
            });

            it("should emit change event with new value", () => {
                expect(component.emitted().change).to.be.instanceOf(Array);
                expect(component.emitted().change[0]).to.deep.equal([14]);
            });

            it("should set updated normalized value on CircularSlider", () => {
                const slider = component.find(CircularSlider);
                expect(slider.props().value).to.equal(40);
            });

            it("should render updated value text", () => {
                expect(component.text()).to.equal("14");
            });
        });
    });

    describe("when value is at min", () => {
        let pubsub: PubSub;
        const propsData = {
            value: 15,
            minValue: 10,
            maxValue: 20,
            stepSize: 8,
        };

        beforeEach(() => {
            pubsub = new PubSub();
            const data = () => ({pubsub});
            component = shallowMount(SliderControl, {propsData, data});
        });

        it("should render value text", () => {
            expect(component.text()).to.equal("15");
        });

        it("should not decrease below min value", () => {
            pubsub.$emit(AppEvent.BEZEL_ROTATION, "CCW");
            expect(component.text()).to.equal("10");
        });

        it("should not increase above max value", () => {
            pubsub.$emit(AppEvent.BEZEL_ROTATION, "CW");
            expect(component.text()).to.equal("20");
        });
    });
});
