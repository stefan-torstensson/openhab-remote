import {logger} from "@app/common/logging";
import {inject} from "aurelia-dependency-injection";

export interface EventSourceFactory {
    create(url: string, initDict?: EventSourceInit): EventSource;
}

class DefaultEventSourceFactory implements EventSourceFactory {
    create(url: string, initDict?: EventSourceInit): EventSource {
        return new EventSource(url, initDict);
    }
}

@inject(DefaultEventSourceFactory)
export class EventSourceListener {
    private readonly log = logger.get(EventSourceListener);
    private listener: (e: any) => void;
    private eventSource: EventSource;
    private errorListener: (e: any) => void;
    private eventSourceFactory: EventSourceFactory;

    constructor(eventSourceFactory: EventSourceFactory) {
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
        this.eventSource = this.eventSourceFactory.create(url);
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
        if (this.listener) {
            this.listener(e);
        }
    }
}
