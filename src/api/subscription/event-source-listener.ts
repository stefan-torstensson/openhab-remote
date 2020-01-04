import {logger} from "@app/common/logging";
import {inject} from "aurelia-dependency-injection";
import {EventSourcePolyfill as EventSource, ExtendedEventSourceInit} from "event-source-polyfill";
import {AuthenticationProvider, BasicAuthentication} from "@app/api/authentication/basic-authentication";

export interface EventSourceFactory {
    create(url: string, initDict?: ExtendedEventSourceInit): EventSource;
}

class DefaultEventSourceFactory implements EventSourceFactory {
    create(url: string, initDict?: ExtendedEventSourceInit): EventSource {
        return new EventSource(url, initDict);
    }
}

@inject(DefaultEventSourceFactory, BasicAuthentication)
export class EventSourceListener {
    private static HEARTBEAT_TIMEOUT = 6 * 60 * 1000; // 6 minutes, OH sends a beat every 5 minutes.
    private readonly log = logger.get(EventSourceListener);
    private readonly eventSourceFactory: EventSourceFactory;
    private readonly authProvider: AuthenticationProvider;
    private eventSource: EventSource;
    private listener: (e: any) => void;
    private errorListener: (e: any) => void;

    constructor(eventSourceFactory: EventSourceFactory, authProvider: AuthenticationProvider) {
        this.authProvider = authProvider;
        this.eventSourceFactory = eventSourceFactory;
    }

    onEvent(listener: (e: any) => void) {
        this.listener = listener;
    }

    onError(listener: (e: any) => void) {
        this.errorListener = listener;
    }

    get started(): boolean {
        return !!this.eventSource;
    }

    start(url: string): void {
        if (this.started) {
            throw new Error("Event source listener already started");
        }
        this.log.info("Opening event source");
        this.eventSource = this.eventSourceFactory.create(url, {
            heartbeatTimeout: EventSourceListener.HEARTBEAT_TIMEOUT,
            headers: Object.fromEntries(this.authProvider.setHeader())
        });
        this.eventSource.addEventListener("event", this.eventReceived);
        this.eventSource.addEventListener("error", this.onEventSourceError);
    }

    stop(): void {
        if (this.eventSource) {
            this.log.info("Stopping event listener");
            this.eventSource.close();
            this.eventSource.removeEventListener("event", this.eventReceived);
            this.eventSource.removeEventListener("error", this.onEventSourceError);
            this.eventSource = null;
        }
    }

    private onEventSourceError = (e: Event) => {
        this.log.error("Event source error", e);
        this.stop();
        if (this.errorListener) {
            this.errorListener(e);
        }
    }

    private eventReceived = (e: any) => {
        this.log.info("Event received", e);
        if (this.listener) {
            this.listener(e);
        }
    }
}
