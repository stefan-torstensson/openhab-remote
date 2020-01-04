import {equalsIgnoreCase, isNullOrEmpty} from "@app/common/string-utils";
import {expect} from "test-env";

describe("string-utils tests", () => {
    describe("equalsIgnoreCase", () => {

        it("Should return true for equal strings", () => {
            expect(equalsIgnoreCase("aaa", "aaa")).to.be.true;
        });

        it("Should return true when strings only differs in casing", () => {
            expect(equalsIgnoreCase("Aab", "aaB")).to.be.true;
        });

        it("Should return false when strings differ", () => {
            expect(equalsIgnoreCase("one", "two")).to.be.false;
        });

        it("Should return false when one string is null", () => {
            expect(equalsIgnoreCase(null, "two")).to.be.false;
        });

        it("Should return true when both arguments are null", () => {
            expect(equalsIgnoreCase(null, null)).to.be.true;
        });
    });

    describe("isNullOrEmpty", () => {
        it("should return true for null", () => {
            expect(isNullOrEmpty(null)).to.be.true;
        });

        it("should return true for undefined", () => {
            expect(isNullOrEmpty(undefined)).to.be.true;
        });

        it("should return true for empty string", () => {
            expect(isNullOrEmpty("")).to.be.true;
        });

        it("should return false for valid string", () => {
            expect(isNullOrEmpty("a")).to.be.false;
        });
    });
});
