import {expect} from "test-env";
import {JsonResponseParser} from "@app/api/response-parser";

describe("ResponseParser tests", () => {
    let parser: JsonResponseParser;

    beforeEach(() => {
        parser = new JsonResponseParser(JSON);
    });

    describe("lookLikeOpenhab()", () => {

        it("should return true for openHAB rest api v1", async () => {
            const response = new Response(JSON.stringify({links: [], version: "1"}));
            expect(await parser.looksLikeOpenhab(response)).to.be.true;
        });

        it("should return true for openHAB rest api v4", async () => {
            const response = new Response(JSON.stringify({links: [], version: "4"}));
            expect(await parser.looksLikeOpenhab(response)).to.be.true;
        });

        it("should return false for openHAB rest api v0", async () => {
            const response = new Response(JSON.stringify({links: [], version: "0"}));
            expect(await parser.looksLikeOpenhab(response)).to.be.false;
        });

        it("should return false on invalid JSON", async () => {
            const response = new Response("foo");
            expect(await parser.looksLikeOpenhab(response)).to.be.false;
        });

        it("should return true for openHAB rest api with unknown version", async () => {
            const response = new Response(JSON.stringify({links: [], version: "foo"}));
            expect(await parser.looksLikeOpenhab(response)).to.be.false;
        });
    });

    describe("parse()", () => {

        it("should parse 'NULL' to null", async () => {
            const response = new Response('{"boolProp":"NULL"}');
            expect(await parser.parse(response)).to.deep.equal({boolProp: null});
        });

        it("should parse 'UNDEF' to undefined", async () => {
            const response = new Response('{"undefProp":"UNDEF"}');
            expect(await parser.parse(response)).to.deep.equal({});
        });

        it("should parse JSON", async () => {
            const data = {
                num: 1,
                str: "string",
                bool: true,
            };
            const response = new Response(JSON.stringify(data));
            expect(await parser.parse(response)).to.deep.equal(data);
        });
    });
});
