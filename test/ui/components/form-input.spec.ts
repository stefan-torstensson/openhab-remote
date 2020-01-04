import {FormInput} from "@app/ui/components";
import {mount, Wrapper} from "@vue/test-utils";
import {expect} from "test-env";
import Vue from "vue";

function getInputElement(wrapper: Wrapper<FormInput>): HTMLInputElement {
    const input = wrapper.find("input");
    return input.element as HTMLInputElement;
}


describe("FormInput tests", () => {
    let component: Wrapper<FormInput>;

    beforeEach(() => {
        component = mount(FormInput, {
            propsData: {
                placeholder: "ph",
                value: "val",
                label: "lbl"
            }
        });
    });

    it("should set properties on input element", () => {
        const input = getInputElement(component);
        expect(input.value).to.equal("val");
        expect(input.placeholder).to.equal("ph");
    });

    it("should set label text", () => {
        const label = component.find("label");
        expect(label.text()).to.equal("lbl");
    });

    describe("when value is updated", () => {
        beforeEach(async () => {
            component.find("input").setValue("bar");
            await Vue.nextTick();
        });

        it("should emit change event", () => {
            const emitted = component.emitted();
            expect(emitted.change).to.exist;
            expect(emitted.change[0][0]).to.equal("bar");
        });
    });
});
