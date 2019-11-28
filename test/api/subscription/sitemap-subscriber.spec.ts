import {expect} from "test-env";
import {StubbedInstance, stubConstructor} from "ts-sinon";
import {OpenhabSitemapSubscriber, SitemapClient} from "@app/api";
import {EventSourceListener} from "@app/api/subscription/event-source-listener";
import {Configuration, LocalStorage} from "@app/configuration";
import {AppEvent, PubSub} from "@app/ui/event-bus";
import {Subscription} from "@app/api/subscription/subscription";
import {SubscriptionResponse} from "@app/api/subscription/sitemap-subscriber";
import {sleep} from "../../utils";

describe("SitemapSubscriber tests", () => {
    let subscriber: OpenhabSitemapSubscriber;
    let eventSourceListenerStub: StubbedInstance<EventSourceListener>;
    let sitemapClientStub: StubbedInstance<SitemapClient>;
    let configurationStub: StubbedInstance<Configuration>;
    let pubsubStub: StubbedInstance<PubSub>;

    beforeEach(() => {
        eventSourceListenerStub = stubConstructor(EventSourceListener);
        sitemapClientStub = stubConstructor(SitemapClient);
        configurationStub = stubConstructor(LocalStorage);
        pubsubStub = stubConstructor(PubSub);
        subscriber = new OpenhabSitemapSubscriber(
            eventSourceListenerStub,
            sitemapClientStub,
            configurationStub,
            pubsubStub
        );
    });

    describe("when not started", () => {
        it("should not have any subscriptionId", () => {
            expect(subscriber.subscriptionId).to.be.undefined;
        });
    });

    describe("when subscription is successfully created", () => {
        beforeEach(() => {
            sitemapClientStub.post.returns(Promise.resolve({
                status: "CREATED",
                context: {headers: {Location: ["subscription-url/id"]}}
            } as SubscriptionResponse));
        });

        describe("when no subscription exists in config", () => {
            beforeEach(async () => {
                await subscriber.subscribeTo("foo", "bar");
            });

            it("should start EventSourceListener", async () => {
                expect(eventSourceListenerStub.start).to.have.been.calledWith("subscription-url/id?sitemap=foo&pageid=bar");
            });

            it("should store subscription url", () => {
                expect(configurationStub.set).to.have.been.calledWith("subscription", new Subscription("subscription-url/id"));
            });

            it("should publish active subscription state", async () => {
                await sleep(1);
                expect(pubsubStub.$emit).to.have.been.calledWith(AppEvent.SUBSCRIPTION_ACTIVE_CHANGE, true);
            });

            it("should have a valid subscriptionId", () => {
                expect(subscriber.subscriptionId).to.equal("id");
            });

        });

        describe("when subscription url exists in config", () => {
            beforeEach(async () => {
                configurationStub.get.withArgs("subscription").returns(new Subscription("stored-url/stored-id"));
                sitemapClientStub.onSameHost.returns(true);
                await subscriber.subscribeTo("foo", "bar");
            });

            it("should start EventSourceListener with stored url", () => {
                expect(eventSourceListenerStub.start).to.have.been.calledWith("stored-url/stored-id?sitemap=foo&pageid=bar");
            });

            it("should not request a new subscription", () => {
                expect(sitemapClientStub.post).to.not.have.been.called;
            });

            it("should not expose stored subscriptionId", () => {
                expect(subscriber.subscriptionId).to.equal("stored-id");
            });

            describe("when subscription is refreshed", () => {
                beforeEach(async () => {
                    await subscriber.refreshSubscription();
                });

                it("should start EventSourceListener with new url", async () => {
                    expect(eventSourceListenerStub.start).to.have.been.calledWith("subscription-url/id?sitemap=foo&pageid=bar");
                });

                it("should store new subscription url", () => {
                    expect(configurationStub.set).to.have.been.calledWith("subscription", new Subscription("subscription-url/id"));
                });

                it("should publish active subscription state", async () => {
                    await sleep(1);
                    expect(pubsubStub.$emit).to.have.been.calledWith(AppEvent.SUBSCRIPTION_ACTIVE_CHANGE, true);
                });

                it("should have a valid subscriptionId", () => {
                    expect(subscriber.subscriptionId).to.equal("id");
                });
            });
        });
    });
});
