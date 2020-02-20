import {shallowMount, Wrapper} from "@vue/test-utils";
import {Item, Widget} from "@app/api/openhab-types";
import {expect} from "test-env";
import OptionControl from "@app/ui/openhab/widgets/option-control";

describe("WidgetControl tests", () => {
    let optionControl: Wrapper<OptionControl>;
    let itemStub: Item;
    let widgetStub: Widget;

    beforeEach(() => {
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
    });

    describe("when item doesn't have command options", () => {
        beforeEach(() => {
            optionControl = shallowMount(OptionControl, {
                propsData: {widget: widgetStub}
            });
        });

        it("should not return any options", () => {
            expect(optionControl.vm.commandOptions).to.be.undefined;
        });

        it("should not indicate that options exists", () => {
            expect(optionControl.vm.hasCommands).to.be.false;
        });

        it("should use value from label", () => {
            expect(optionControl.vm.stateLabel).to.equal("value");
        });
    });

    describe("when widget item has command options", () => {
        beforeEach(() => {
            itemStub.state = "ON";
            itemStub.commandDescription = {
                commandOptions: [
                    {label: "Active", command: "ON"},
                    {label: "Passive", command: "OFF"}
                ]
            };
            optionControl = shallowMount(OptionControl, {
                propsData: {widget: widgetStub}
            });
        });

        it("should indicate that options exists", () => {
            expect(optionControl.vm.hasCommands).to.be.true;
        });
        it("should return command options from item", () => {
            expect(optionControl.vm.commandOptions).to.equal(itemStub.commandDescription.commandOptions);
        });
        it("should map label value to command label", () => {
            expect(optionControl.vm.stateLabel).to.equal("Active");
        });

        describe("when widget has mappings", () => {
            beforeEach(() => {
                itemStub.state = "ON";
                widgetStub.mappings = [
                    {label: "Mapped Active", command: "ON"},
                    {label: "Mapped Passive", command: "OFF"},
                    {label: "Another", command: "UNKNOWN"}
                ];
                optionControl = shallowMount(OptionControl, {
                    propsData: {widget: widgetStub}
                });
            });

            it("should indicate that command options exists", () => {
                expect(optionControl.vm.hasCommands).to.be.true;
            });
            it("should use mappings instead of command options", () => {
                expect(optionControl.vm.commandOptions).to.equal(widgetStub.mappings);
            });
            it("should map label value to mapping label", () => {
                expect(optionControl.vm.stateLabel).to.equal("Mapped Active");
            });
        });
    });
});
