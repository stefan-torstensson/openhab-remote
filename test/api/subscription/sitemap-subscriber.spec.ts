import {expect, sinon} from "test-env";
import {StubbedInstance, stubConstructor, stubInterface} from "ts-sinon";
import {OpenhabSitemapSubscriber, SitemapClient} from "@app/api";
import {EventSourceListener} from "@app/api/subscription/event-source-listener";
import {AppEvent, PubSub} from "@app/ui/event-bus";
import {SubscriptionResponse} from "@app/api/subscription/sitemap-subscriber";
import {SinonFakeTimers} from "sinon";

describe("SitemapSubscriber tests", () => {
    let subscriber: OpenhabSitemapSubscriber;
    let eventSourceListenerStub: StubbedInstance<EventSourceListener>;
    let sitemapClientStub: StubbedInstance<SitemapClient>;
    let pubsubStub: StubbedInstance<PubSub>;
    let clock: SinonFakeTimers;
    before(() => {
        clock = sinon.useFakeTimers();
    });

    after(() => {
        clock.restore();
    });

    beforeEach(() => {
        eventSourceListenerStub = stubConstructor(EventSourceListener);
        sitemapClientStub = stubInterface(SitemapClient);
        pubsubStub = stubConstructor(PubSub);
        subscriber = new OpenhabSitemapSubscriber(
            eventSourceListenerStub,
            sitemapClientStub,
            pubsubStub
        );
    });

    describe("when subscription is successfully created", () => {
        beforeEach(() => {
            sitemapClientStub.post.returns(Promise.resolve({
                status: "CREATED",
                context: {headers: {Location: ["subscription-url/id"]}}
            } as SubscriptionResponse));
        });

        describe("getSubscriptionId()", () => {
            it("should create a new subscription and return the id", async () => {
                expect(await subscriber.getSubscriptionId()).to.equal("id");
            });
        });

        describe("start()", () => {
            describe("when getSubscription() hasn't been called", () => {
                beforeEach(() => {
                    subscriber.start();
                });

                it("should not start event source listener", () => {
                    expect(eventSourceListenerStub.start).to.not.have.been.called;
                });

                it("should emit subscription inactive", () => {
                    clock.tick(1000);
                    expect(pubsubStub.$emit).to.have.been.calledOnceWith(AppEvent.SUBSCRIPTION_ACTIVE_CHANGE, false);
                });
            });

            describe("when subscription has been created", () => {
                beforeEach(async () => {
                    await subscriber.getSubscriptionId();
                    subscriber.start();
                });

                it("should not start event source listener", () => {
                    expect(eventSourceListenerStub.start).to.have.been.calledWith("subscription-url/id");
                });

                it("should emit subscription inactive", () => {
                    clock.tick(1000);
                    expect(pubsubStub.$emit).to.have.been.calledWith(AppEvent.SUBSCRIPTION_ACTIVE_CHANGE, true);
                });
            });
        });
    });

    describe("when subscription can't be created", () => {
        beforeEach(() => {
            sitemapClientStub.post.throws("error");
        });

        describe("getSubscription()", () => {
            it("should return null", async () => {
                expect(await subscriber.getSubscriptionId()).to.be.null;
            });
        });

        describe("start()", () => {
            it("should not call start on event source listener", async () => {
                await subscriber.getSubscriptionId();
                subscriber.start();
                expect(eventSourceListenerStub.start).to.not.have.been.called;
            });
        });

    });
});
