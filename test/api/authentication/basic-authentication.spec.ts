import {expect} from "test-env";
import {AuthenticationProvider, BasicAuthentication} from "@app/api/authentication/basic-authentication";
import {AppSettings} from "@app/configuration";
import {StubbedInstance, stubInterface} from "ts-sinon";

describe("BasicAuthentication tests", () => {
    let basicAuth: AuthenticationProvider;
    let appSettingsMock: StubbedInstance<AppSettings>;

    beforeEach(() => {
        appSettingsMock = stubInterface<AppSettings>();
        basicAuth = new BasicAuthentication(appSettingsMock);
    });

    describe("when no credentials exists in app settings", () => {

        describe("createAuthHeader", () => {
            it("should return auth header with encoded credentials", () => {
                const header = basicAuth.createAuthHeader("user", "pwd");
                expect(header.name).to.equal("Authorization");
                expect(header.value).to.equal(`Basic ${btoa("user:pwd")}`);
            });

            it("should should return empty for null credentials", () => {
                const header = basicAuth.createAuthHeader(null, null);
                expect(header.name).to.equal("Authorization");
                expect(header.value).to.equal(`Basic ${btoa(":")}`);
            });
        });

        describe("getAuthHeader", () => {
            it("should return null", () => {
                const header = basicAuth.getAuthHeader();
                expect(header).to.be.null;
            });
        });

        describe("setAuthHeader", () => {
            it("should not append any headers", () => {
                const headers = new Headers();
                expect(basicAuth.setHeader(headers)).to.be.equal(headers);
                expect(Array.from(headers)).to.deep.equal([]);
            });
        });
    });

    describe("when app settings has username and password", () => {
        beforeEach(() => {
            appSettingsMock.password = "pwd";
            appSettingsMock.username = "user";
        });

        describe("getAuthHeader", () => {
            it("should return auth header", () => {
                const header = basicAuth.getAuthHeader();
                expect(header.name).to.equal("Authorization");
                expect(header.value).to.equal(`Basic ${btoa("user:pwd")}`);
            });
        });

        describe("setAuthHeader", () => {
            it("should not append auth header", () => {
                const headers = new Headers();
                expect(basicAuth.setHeader(headers)).to.be.equal(headers);
                expect(headers.get("Authorization")).to.equal(`Basic ${btoa("user:pwd")}`);
            });
        });
    });
});
