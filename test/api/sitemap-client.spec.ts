import {expect} from "../test-env";
import {SitemapClient} from "@app/api";
import {VerificationResult} from "@app/api/sitemap-client";
import {ResponseParser} from "@app/api/response-parser";

describe("SitemapClient tests", () => {
    describe("verifyUrl", () => {
        let fetchMock: Fetch;
        let client: SitemapClient;

        beforeEach(() => {
            fetchMock = (): Promise<Response> => Promise.resolve({ok: true} as Response);
            client = new SitemapClient(fetchMock, new ResponseParser(JSON), null, null);
        });

        it("null is not a valid url", async () => {
            const result = await client.verifyUrl(null);
            expect(result).to.equal(VerificationResult.INVALID_URL);
        });

        it("empty string is not valid", async () => {
            const result = await client.verifyUrl("");
            expect(result).to.equal(VerificationResult.INVALID_URL);
        });

        it("foo.bar is not valid", async () => {
            const result = await client.verifyUrl("foo.bar");
            expect(result).to.equal(VerificationResult.INVALID_URL);
        });

        it("test proper url", async () => {
            const result = await client.verifyUrl("http://foobar");
            expect(result).to.equal(VerificationResult.OK);
        });
    });
});
