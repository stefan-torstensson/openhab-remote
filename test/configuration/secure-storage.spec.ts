import {SecureStorage} from "@app/configuration/secure-storage";
import {StubbedInstance, stubInterface} from "ts-sinon";
import {JsonSerializer} from "@app/configuration/json-serializer";
import {expect} from "test-env";

describe("SecureStorage tests", () => {
    let storage: SecureStorage;
    let mockKeyManager: StubbedInstance<org.tizen.KeyManager>;
    beforeEach(() => {
        mockKeyManager = stubInterface<org.tizen.KeyManager>();
        storage = new SecureStorage(mockKeyManager, new JsonSerializer());
    });

    describe("when keyManager is empty", () => {
        beforeEach(() => {
            mockKeyManager.getDataAliasList.returns([]);
            mockKeyManager.getData.throws(new Error("Key does not exist"));
        });

        it("should save serialized data in key manager", () => {
            storage.set("key", "value");
            expect(mockKeyManager.saveData).to.have.been.calledWith("key", '"value"');
        });

        it("should return null when no data exists", () => {
            const result = storage.get("key");
            expect(result).to.be.null;
            expect(mockKeyManager.getDataAliasList).to.have.been.called;
        });

        it("should not remove non-existing data", () => {
            storage.remove("key");
            expect(mockKeyManager.removeData).to.not.have.been.called;
        });

        describe("when value is cached", () => {
            beforeEach(() => {
                storage.get("key");
                mockKeyManager.getDataAliasList.resetHistory();
            });

            it("should not query key manager", () => {
                expect(storage.get("key")).to.be.null;
                expect(mockKeyManager.getDataAliasList).to.not.have.been.called;
            });
        });
    });

    describe("when key exists in key manager", () => {
        beforeEach(() => {
            mockKeyManager.getDataAliasList.returns([{name: "key"}]);
            mockKeyManager.getData.returns('"value"');
        });

        it("should return deserialized value", () => {
            expect(storage.get("key")).to.equal("value");
        });

        it("should remove existing value from key manager", () => {
            storage.remove("key");
            expect(mockKeyManager.removeData).to.have.been.calledWith({name: "key"});
        });

        it("should remove and set new value in key manager", () => {
            storage.set("key", "foo");
            expect(mockKeyManager.removeData).to.have.been.calledWith({name: "key"});
            expect(mockKeyManager.saveData).to.have.been.calledWith("key", '"foo"')
                .and.calledAfter(mockKeyManager.removeData);
        });

    });

    describe("when value exists in cache", () => {
        beforeEach(() => {
            mockKeyManager.getDataAliasList.returns([{name: "key"}]);
            mockKeyManager.getData.returns(JSON.stringify(1));
            storage.get("key");
            mockKeyManager.getData.resetHistory();
        });

        it("should not get value from key manager", () => {
            expect(storage.get("key")).to.equal(1);
            expect(mockKeyManager.getData).to.not.have.been.called;
        });

        it("should remove data from cache", () => {
            storage.remove("key");
            expect(storage.get("key")).to.equal(1);
            expect(mockKeyManager.getData).to.have.been.calledOnceWith({name: "key"});
        });
    });
});
