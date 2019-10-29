import {expect} from "test-env";
import {RenderMode, WidgetMapper} from "@app/ui/openhab/widget-mapper";
import Vue from "vue";
import {Widget} from "@app/api/openhab-types";

class SingleControl extends Vue {
}

class ListControl extends Vue {
}

describe("WidgetMapper tests", () => {
    let mapper: WidgetMapper;
    describe("getControl", () => {
        describe("when config is empty", () => {

            beforeEach(() => {
                mapper = new WidgetMapper({});
            });

            it("should return null", () => {
                expect(mapper.getControl(null)).to.be.null;
            });
        });

        describe("when config ", () => {
            beforeEach(() => {
                mapper = new WidgetMapper({"Foo": {single: SingleControl, list: ListControl}});
            });

            it("should return null when no mapping matches", () => {
                expect(mapper.getControl({type: "Bar"} as Widget)).to.be.null;
            });

            it("should return ListControl when mapping matches", () => {
                const control = mapper.getControl({type: "Foo"} as Widget);
                expect(control).to.equal(ListControl);
            });

            it("should return SingleControl when mapping matches", () => {
                const control = mapper.getControl({type: "Foo"} as Widget, RenderMode.single);
                expect(control).to.equal(SingleControl);
            });

        });

        describe("when config has conditional rendering", () => {
            beforeEach(() => {
                mapper = new WidgetMapper({
                    "Foo": {
                        single: SingleControl,
                        list: ListControl,
                        shouldRender: (widget) => !!widget.label
                    }
                });
            });

            it("should return null when label is empty", () => {
                const control = mapper.getControl({type: "Foo", label: ""} as Widget);
                expect(control).to.be.null;
            });

            it("should return control when label exists", () => {
                const control = mapper.getControl({type: "Foo", label: "a label"} as Widget);
                expect(control).to.equal(ListControl);
            });
        });
    });
});
