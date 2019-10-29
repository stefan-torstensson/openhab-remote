import {expect, sinon} from "test-env";
import {PersistentSettings} from "@app/configuration/persistent-settings";
import {Configuration} from "@app/configuration";

describe("PersistentSettings tests", () => {
    let configuration: any;
    let settings: PersistentSettings;

    beforeEach(() => {
        configuration = {
            get: sinon.stub(),
            set: sinon.stub(),
            remove: sinon.stub()
        };
        settings = new PersistentSettings(configuration as Configuration);
    });

    describe("remoteUrl", () => {
        it("should call set", () => {
            settings.remoteUrl = "pwd";
            expect(configuration.set).to.have.been.calledWith("remoteUrl", "pwd");
        });

        it("should call get", () => {
            configuration.get.withArgs("remoteUrl").returns("pwd");
            expect(settings.remoteUrl).to.equal("pwd");
        });
    });

    describe("sitemapName", () => {
        it("should call set", () => {
            settings.sitemapName = "pwd";
            expect(configuration.set).to.have.been.calledWith("sitemapName", "pwd");
        });

        it("should call get", () => {
            configuration.get.withArgs("sitemapName").returns("pwd");
            expect(settings.sitemapName).to.equal("pwd");
        });
    });

    describe("username", () => {
        it("should call set", () => {
            settings.username = "pwd";
            expect(configuration.set).to.have.been.calledWith("username", "pwd");
        });

        it("should call get", () => {
            configuration.get.withArgs("username").returns("pwd");
            expect(settings.username).to.equal("pwd");
        });
    });

    describe("password", () => {
        it("should call set", () => {
            settings.password = "pwd";
            expect(configuration.set).to.have.been.calledWith("password", "pwd");
        });

        it("should call get", () => {
            configuration.get.withArgs("password").returns("pwd");
            expect(settings.password).to.equal("pwd");
        });
    });

});
