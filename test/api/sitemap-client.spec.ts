import {expect, sinon} from "test-env";
import {SitemapClient} from "@app/api";
import {VerificationResult} from "@app/api/sitemap-client";
import {JsonResponseParser} from "@app/api/response-parser";
import {AppSettings} from "@app/configuration/app-settings";
import {PubSub} from "@app/ui/event-bus";
import {SinonStub} from "sinon";
import {Sitemap} from "@app/api/openhab-types";
import {NetworkError, ResponseError} from "@app/common/application-error";
import {LogLevel} from "@app/common/logging";

describe("SitemapClient tests", () => {
    let fetchMock: SinonStub;
    let logLevel: LogLevel;
    let client: SitemapClient;

    before(() => {
        logLevel = global.__logLevel;
        global.__logLevel = LogLevel.NONE;
    });

    after(() => {
        global.__logLevel = logLevel;
    });

    beforeEach(() => {
        fetchMock = sinon.stub();
        const appSettings: AppSettings = {
            remoteUrl: "http://foo.bar",
            sitemapName: "dev",
            username: "",
            password: ""
        };

        client = new SitemapClient(fetchMock, new JsonResponseParser(JSON), new PubSub(), appSettings);

    });

    describe("verifyUrl", () => {

        beforeEach(() => {
            client = new SitemapClient(fetchMock, new JsonResponseParser(JSON), null, null);
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

        it("should return OK for openHAB response", async () => {
            const body = JSON.stringify({
                version: "1",
                links: [{}]
            });
            fetchMock
                .withArgs("http://foobar/rest/")
                .returns(Promise.resolve(new Response(body)));
            const result = await client.verifyUrl("http://foobar");
            expect(result).to.equal(VerificationResult.OK);
        });

        it("should return NOT_OPENHAB for unknown response", async () => {
            fetchMock
                .withArgs("http://foobar/rest/")
                .returns(Promise.resolve(new Response("<html></html>")));
            const result = await client.verifyUrl("http://foobar");
            expect(result).to.equal(VerificationResult.NOT_OPENHAB);
        });
    });

    describe("get/post", () => {

        describe("when fetch throws exception", () => {
            beforeEach(() => {
                fetchMock.throws(new TypeError("Failed to fetch"));
            });

            it("get should throw NetworkError", () => {
                expect(client.get("/anypath")).to.be.rejectedWith(NetworkError);
            });
            it("get should throw NetworkError", () => {
                expect(client.post("/anypath", null)).to.be.rejectedWith(NetworkError);
            });
            it("getSitemaps should throw NetworkError", () => {
                expect(client.getSitemaps()).to.be.rejectedWith(NetworkError);
            });
            it("getSitemap should throw NetworkError", () => {
                expect(client.getSitemap("any sitemap")).to.be.rejectedWith(NetworkError);
            });
            it("getSitemap should throw NetworkError", () => {
                expect(client.getPage("any sitemap", "any page")).to.be.rejectedWith(NetworkError);
            });
        });

        describe("when response is not ok", () => {
            beforeEach(() => {
                const body = {error: {message: "what?"}};
                fetchMock.returns(new Response(JSON.stringify(body), {status: 400}));
            });

            it("get should throw ResponseError", async () => {
                await expect(client.get("path")).to.be.rejectedWith(ResponseError, "what?");
            });
            it("post should throw ResponseError", async () => {
                await expect(client.post("path", null)).to.be.rejectedWith(ResponseError, "what?");
            });
            it("getSitemaps should throw ResponseError", async () => {
                await expect(client.getSitemaps()).to.be.rejectedWith(ResponseError, "what?");
            });
            it("getSitemap should throw ResponseError", async () => {
                await expect(client.getSitemap("name")).to.be.rejectedWith(ResponseError, "what?");
            });
            it("getPage should throw ResponseError", async () => {
                await expect(client.getPage("sitemap", "page")).to.be.rejectedWith(ResponseError, "what?");
            });
        });

        describe("post", () => {
            beforeEach(() => {
                fetchMock.returns(Promise.resolve(new Response(JSON.stringify({foo: "bar"}))));
            });
            it("should post", async () => {
                await client.post("path", "post data");
                const request = fetchMock.firstCall.args[0] as Request;
                expect(request.url).to.equal("http://foo.bar/rest/path");
                expect(request.method).to.equal("POST");
                expect(request.headers.get("content-type")).to.contain("text/plain");
            });
            it("should post", async () => {
                const response = await client.post("path", "post data");
                expect(response).to.deep.equal({foo: "bar"});
            });
        });
        describe("getSitemaps", () => {
            let sitemaps: Sitemap[];
            beforeEach(() => {
                sitemaps = [
                    {name: "one", label: "", link: "", homepage: null},
                    {name: "two", label: "", link: "", homepage: null}
                ];
                fetchMock.returns(new Response(JSON.stringify(sitemaps)));
            });

            it("should make get request to rest api", async () => {
                await client.getSitemaps();
                const request = fetchMock.firstCall.args[0] as Request;
                expect(request.url).to.equal("http://foo.bar/rest/sitemaps");
                expect(request.method).to.equal("GET");
            });

            it("should return parsed sitemaps", async () => {
                const result = await client.getSitemaps();
                expect(result).to.deep.equal(sitemaps);
            });
        });

        describe("getSitemap", () => {
            let sitemap: Sitemap;
            beforeEach(() => {
                sitemap = {name: "one", label: "", link: "", homepage: null};
                fetchMock.returns(new Response(JSON.stringify(sitemap)));
            });

            it("should return parsed sitemap", async () => {
                const result = await client.getSitemap("any sitemap");
                expect(result).to.deep.equal(sitemap);
            });

            it("should return parsed sitemap", async () => {
                await client.getSitemap("home");
                const request = fetchMock.firstCall.args[0] as Request;
                expect(request.url).to.equal("http://foo.bar/rest/sitemaps/home");
                expect(request.method).to.equal("GET");
            });

        });

        describe("getPage", () => {
            let page: any;
            beforeEach(() => {
                page = {title: "title"};
                fetchMock.returns(new Response(JSON.stringify(page)));
            });

            it("should return parsed sitemap", async () => {
                const result = await client.getPage("sitemapName", "pageName");
                expect(result).to.deep.equal(page);
            });

            it("should return parsed sitemap", async () => {
                await client.getPage("home", "default", "123");
                const request = fetchMock.firstCall.args[0] as Request;
                expect(request.url).to.equal("http://foo.bar/rest/sitemaps/home/default?subscriptionid=123");
                expect(request.method).to.equal("GET");
            });

        });
    });
});
