import {assign} from "@app/api/util";
import {expect} from "chai";

describe("util tests", () => {
    describe("assign", () => {
        it("Should do it", () => {

            const target = {
                a: 2,
                b: {
                    c: false
                },
                d: "val"
            };
            const source = {
                a: 3,
                b: {
                    c: true,
                    f: 5
                },
                g: {
                    g: 3
                }
            };
            const expected = {
                a: 3,
                b: {
                    c: true,
                    f: 5
                },
                d: "val",
                g: {g: 3}
            };

            const result = assign(target, source);
            expect(result).to.deep.equal(expected);

        });

        it("Should do array", () => {
            const source = {
                a: ["one"],
                b: ["two"],
                c: [{d: "d"}]
            };
            const target = {
                a: ["three"]
            };
            assign(target, source);
            expect(target).to.deep.equal(source);

        });
    });
});
