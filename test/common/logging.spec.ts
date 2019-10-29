import {expect, sinon} from "test-env";
import {Logger, LoggerFactory, LogLevel} from "@app/common/logging";

describe("Logging tests", () => {

    beforeEach(() => {
        sinon.stub(console, "debug");
        sinon.stub(console, "info");
        sinon.stub(console, "warn");
        sinon.stub(console, "error");

    });

    afterEach(() => {
        sinon.restore();
    });

    it("should use class name as prefix", () => {
        class MockClass {}
        const mockLogger = LoggerFactory.get(MockClass);
        mockLogger.error("message");
        expect(console.error).calledOnceWith("MockClass: ", "message");
    });

    it("should use string as prefix", () => {
        const mockLogger = LoggerFactory.get("logger name");
        mockLogger.error("message");
        expect(console.error).calledOnceWith("logger name: ", "message");
    });

    describe("LogLevels", () => {
        let logger: Logger;

        beforeEach(() => {
            logger = LoggerFactory.get("foo");
        });

        describe("When log level is DEBUG", () => {
            beforeEach(() => {
                LoggerFactory.logLevel = LogLevel.DEBUG;
            });

            it("should debug log", () => {
                logger.debug("bar");
                expect(console.debug).calledOnceWith("foo: ", "bar");
            });

            it("should info log", () => {
                logger.info("bar");
                expect(console.info).calledOnceWith("foo: ", "bar");
            });

            it("should warn log", () => {
                logger.warn("bar");
                expect(console.warn).calledOnceWith("foo: ", "bar");
            });

            it("should error log", () => {
                logger.error("bar");
                expect(console.error).calledOnceWith("foo: ", "bar");
            });
        });

        describe("When log level is INFO", () => {
            beforeEach(() => {
                LoggerFactory.logLevel = LogLevel.INFO;
            });

            it("should not debug log", () => {
                logger.debug("bar");
                expect(console.debug).not.called;
            });

            it("should info log", () => {
                logger.info("bar");
                expect(console.info).calledOnceWith("foo: ", "bar");
            });

            it("should warn log", () => {
                logger.warn("bar");
                expect(console.warn).calledOnceWith("foo: ", "bar");
            });

            it("should error log", () => {
                logger.error("bar");
                expect(console.error).calledOnceWith("foo: ", "bar");
            });
        });

        describe("When log level is WARN", () => {
            beforeEach(() => {
                LoggerFactory.logLevel = LogLevel.WARN;
            });

            it("should not debug log", () => {
                logger.debug("bar");
                expect(console.debug).not.called;
            });

            it("should not info log", () => {
                logger.info("bar");
                expect(console.info).not.called;
            });

            it("should warn log", () => {
                logger.warn("bar");
                expect(console.warn).calledOnceWith("foo: ", "bar");
            });

            it("should error log", () => {
                logger.error("bar");
                expect(console.error).calledOnceWith("foo: ", "bar");
            });
        });

        describe("When log level is ERROR", () => {
            beforeEach(() => {
                LoggerFactory.logLevel = LogLevel.ERROR;
            });

            it("should not debug log", () => {
                logger.debug("bar");
                expect(console.debug).not.called;
            });

            it("should not info log", () => {
                logger.info("bar");
                expect(console.info).not.called;
            });

            it("should not warn log", () => {
                logger.warn("bar");
                expect(console.warn).not.called;
            });

            it("should error log", () => {
                logger.error("bar");
                expect(console.error).calledOnceWith("foo: ", "bar");
            });
        });

    });
});
