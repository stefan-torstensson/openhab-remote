import {expect} from "test-env";
import {PersistentSettings} from "@app/configuration/persistent-settings";
import {Configuration} from "@app/configuration";
import {StubbedInstance, stubInterface} from "ts-sinon";

describe("PersistentSettings tests", () => {
    let storage: StubbedInstance<Configuration>;
    let secureStorage: StubbedInstance<Configuration>;
    let settings: PersistentSettings;

    beforeEach(() => {
        storage = stubInterface<Configuration>();
        secureStorage = stubInterface<Configuration>();
        settings = new PersistentSettings(storage, secureStorage);
    });

    describe("remoteUrl", () => {
        it("should call set", () => {
            settings.remoteUrl = "pwd";
            expect(storage.set).to.have.been.calledWith("remoteUrl", "pwd");
        });

        it("should call get", () => {
            storage.get.withArgs("remoteUrl").returns("pwd");
            expect(settings.remoteUrl).to.equal("pwd");
        });
    });

    describe("sitemapName", () => {
        it("should call set", () => {
            settings.sitemapName = "pwd";
            expect(storage.set).to.have.been.calledWith("sitemapName", "pwd");
        });

        it("should call get", () => {
            storage.get.withArgs("sitemapName").returns("pwd");
            expect(settings.sitemapName).to.equal("pwd");
        });
    });

    describe("username", () => {
        it("should call set", () => {
            settings.username = "pwd";
            expect(secureStorage.set).to.have.been.calledWith("username", "pwd");
        });

        it("should call get", () => {
            secureStorage.get.withArgs("username").returns("pwd");
            expect(settings.username).to.equal("pwd");
        });
    });

    describe("password", () => {
        it("should call set", () => {
            settings.password = "pwd";
            expect(secureStorage.set).to.have.been.calledWith("password", "pwd");
        });

        it("should call get", () => {
            secureStorage.get.withArgs("password").returns("pwd");
            expect(settings.password).to.equal("pwd");
        });
    });

});
