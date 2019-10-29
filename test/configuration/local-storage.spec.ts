import {expect, sinon} from "test-env";
import {LocalStorage} from "@app/configuration";

describe("LocalStorage tests", () => {
    let localStorage: Storage;
    let storage: LocalStorage;

    beforeEach(() => {
        localStorage = {
            getItem: sinon.fake(),
            setItem: sinon.fake(),
            removeItem: sinon.fake()
        } as unknown as Storage;
        storage = new LocalStorage(localStorage);
    });

    describe("get", () => {

        it("should call getItem", () => {
            storage.get("key");

            expect(localStorage.getItem).to.have.been.calledWith("key");
        });

    });

});
