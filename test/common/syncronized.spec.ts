import {expect} from "test-env";
import {synchronized} from "@app/common/synchronized";
import {sleep} from "../utils";


describe("synchronized decorator tests", () => {

    let fake: Fake;
    beforeEach(() => {
        fake = new Fake();
    });

    it("should execute in call order", async () => {
        const result = await Promise.all([
            fake.addAndReturnValue(1, 10),
            fake.addAndReturnValue(2, 5),
            fake.addAndReturnValue(3)
        ]);
        expect(result).to.eql([1, 2, 3]);
        expect(fake.values).to.eql([1, 2, 3]);
    });

    it("should handle errors in order", async () => {
        const result: Error[] = await Promise.all([
            fake.callMethod(() => {
                throw Error("error 1");
            }, 10),
            fake.callMethod(() => {
                throw Error("error 2");
            }),
        ].map(p => p.catch(e => e)));

        expect(result[0].message).to.equal("error 1");
        expect(result[1].message).to.equal("error 2");
    });
});


class Fake {
    private _values: any[] = [];

    @synchronized()
    async addAndReturnValue(value: any, delay = 0) {
        await sleep(delay);
        this._values.push(value);
        return value;
    }

    @synchronized()
    async callMethod(method: (...[]) => any, delay = 0) {
        await sleep(delay);
        return method();
    }

    get values(): any[] {
        return this._values;
    }
}
