import {expect} from "chai";
import {parseLabel} from "@app/ui/openhab/widgets/label-parser";

describe("label-parser tests", () => {
    describe("parseLabel", () => {
        it("should parse label", () => {
            const result = parseLabel("Simple Label");
            expect(result.label).to.equal("Simple Label");
            expect(result.state).to.be.undefined;
        });

        it("should parse label with data", () => {
            const result = parseLabel("Temperature [23 °C]");
            expect(result.label).to.equal("Temperature");
            expect(result.state).to.equal("23 °C");
        });

    });
});
