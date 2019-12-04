import {expect, sinon} from "test-env";
import {waitFor, WaitState} from "@app/common/wait-for";
import {SinonStub} from "sinon";

describe("waitFor tests", () => {
    let predicate: SinonStub;
    beforeEach(() => {
        predicate = sinon.stub();
    });

    it("should immediately return true on Success", async () => {
        predicate.returns(WaitState.Success);
        const result = await waitFor(predicate, 50);
        expect(result).to.be.true;
        expect(predicate).to.have.been.calledOnce;
    });

    it("should immediately false after on Failure", async () => {
        predicate.returns(WaitState.Failed);
        const result = await waitFor(predicate, 110);
        expect(result).to.be.false;
        expect(predicate).to.have.been.calledOnce;
    });

    it("should return true after three attempts", async () => {
        predicate.returns(WaitState.Waiting);
        predicate.onThirdCall().returns(WaitState.Success);
        const result = await waitFor(predicate, 180);
        expect(result).to.be.true;
        expect(predicate).to.have.been.calledThrice;
    });
});
