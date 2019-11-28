import {expect, sinon} from "test-env";
import {StubbedInstance, stubInterface} from "ts-sinon";

import {EventSourceFactory, EventSourceListener} from "@app/api/subscription/event-source-listener";
import {SinonSpy} from "sinon";

describe("EventSourceListener tests", () => {
    let eventSourceStub: StubbedInstance<EventSource>;
    let factoryStub: StubbedInstance<EventSourceFactory>;
    let listener: EventSourceListener;

    beforeEach(() => {
        eventSourceStub = stubInterface<EventSource>();
        factoryStub = stubInterface<EventSourceFactory>();
        factoryStub.create.returns(eventSourceStub);
        listener = new EventSourceListener(factoryStub);
    });

    describe("when listener is started", () => {
        beforeEach(() => {
            listener.start("some url");
        });

        it("should use factory to create event source", () => {
            expect(factoryStub.create).to.have.been.calledWith("some url");
        });

        it("should add event listeners to event source", () => {
            expect(eventSourceStub.addEventListener).to.have.been.calledTwice;
            expect(eventSourceStub.addEventListener).to.have.been.calledWith("event", sinon.match.func);
            expect(eventSourceStub.addEventListener).to.have.been.calledWith("error", sinon.match.func);
        });

        it("should indicate started state", () => {
            expect(listener.started).to.be.true;
        });

        it("should throw if start is called while already started", () => {
            expect(() => listener.start("")).to.throw(Error, "already started");
        });

        describe("when stopped", () => {
            beforeEach(() => {
                listener.stop();
            });

            it("should not indicate running", () => {
                expect(listener.started).to.be.false;
                expect(eventSourceStub.close).to.have.been.called;
            });

            it("should remove event listeners from EventSource", () => {
                const addArgs = eventSourceStub.addEventListener.args;
                expect(eventSourceStub.removeEventListener).to.have.been.calledTwice;
                expect(eventSourceStub.removeEventListener).to.have.been.calledWith(...(addArgs[0]));
                expect(eventSourceStub.removeEventListener).to.have.been.calledWith(...(addArgs[1]));
            });
        });

        describe("events", () => {
            let onError: SinonSpy;
            let onEvent: SinonSpy;

            beforeEach(() => {
                onError = sinon.spy();
                onEvent = sinon.spy();
                listener.onError(onError);
                listener.onEvent(onEvent);
            });

            it("should stop event listener on error", () => {
                const errorCb = eventSourceStub.addEventListener.args
                    .find(a => a[0] === "error")[1] as (e: any) => void;
                errorCb("failed");
                expect(listener.started).to.be.false;
                expect(onError).to.have.been.calledWith("failed");
            });

            it("should call onEvent listener when events are raised on EventSource", () => {
                const eventCb = eventSourceStub.addEventListener.args
                    .find(a => a[0] === "event")[1] as (e: any) => void;
                eventCb("something happened");
                expect(onEvent).to.have.been.calledWith("something happened");
            });
        });
    });
});
