import chai from "chai";
import sinonChai from "sinon-chai";
import sinon_ from "ts-sinon";
import chaiAsPromised from "chai-as-promised";

chai.use(sinonChai);
chai.use(chaiAsPromised);

export const expect = chai.expect;
export const assert = chai.assert;
export const sinon = sinon_;
