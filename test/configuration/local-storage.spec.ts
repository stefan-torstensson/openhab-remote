import {expect, sinon} from "test-env";
import {LocalStorage} from "@app/configuration";

describe("LocalStorage tests", () => {
    let localStorage: any;
    let storage: LocalStorage;

    beforeEach(() => {
        localStorage = {
            getItem: sinon.stub(),
            setItem: sinon.stub(),
            removeItem: sinon.stub()
        };
        storage = new LocalStorage(localStorage as Storage);
    });

    describe("get", () => {

        it("should return deserialized data from backing storage", () => {
            const data = {key: "value", key2: 3};
            localStorage.getItem.withArgs("key").returns(JSON.stringify(data));

            const result = storage.get("key");
            expect(result).to.deep.equal(data);
        });

        it("should deserialize to type", () => {
            const d = new DataObject(3, "text");
            localStorage.getItem.withArgs("key").returns(JSON.stringify(d));

            const result = storage.get("key", DataObject);
            expect(result).to.be.instanceOf(DataObject);
            expect(result.number).to.equal(3);
            expect(result.string).to.equal("text");
            expect(result.combined).to.equal("text3");
        });

    });

    describe("set", () => {
        it("should serialize data to backing storage", () => {
            const data = {key: "value", key2: 3};
            storage.set("key", data);
            expect(localStorage.setItem).to.have.been.calledOnceWith("key", JSON.stringify(data));
        });

        it("should serialize type to backing storage", () => {
            storage.set("key", new DataObject(3, "value"));
            expect(localStorage.setItem).to.have.been.calledOnceWith(
                "key", `{"_numberField":3,"_stringField":"value"}`);
        });

    });

    describe("remove", () => {
        it("should remove entry from backing storage", () => {
            storage.remove("key");
            expect(localStorage.removeItem).to.have.been.calledOnceWith("key");
        });
    });

});


class DataBase {
    private readonly _numberField: number;

    constructor(number: number) {
        if (!number) {
            throw new Error("Missing number");
        }
        this._numberField = number;
    }

    get number(): number {
        return this._numberField;
    }
}


class DataObject extends DataBase {
    private readonly _stringField: string;

    constructor(number: number, string: string) {
        super(number);
        this._stringField = string;
    }

    get string(): string {
        return this._stringField;
    }

    get combined(): string {
        return this.string + this.number;
    }
}
