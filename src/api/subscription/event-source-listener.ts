import {logger} from "@app/common/logging";
import {transient} from "aurelia-dependency-injection";

@transient()
export class EventSourceListener {
    private listener: (e: any) => void;
    private eventSource: EventSource;

    onEvent(listener: (e: any) => void) {
        this.listener = listener;
    }

    get started(): boolean {
        return !!this.eventSource;
    }

    start(url: string): Promise<void> {
        if (this.started) {
            throw new Error("Event source listener already started");
        }
        return new Promise((resolve, reject) => {
            let onerror: EventListener;
            this.eventSource = new EventSource(url);
            this.eventSource.addEventListener("event", this.eventReceived);
            this.eventSource.addEventListener("error", this.onError);
            this.eventSource.addEventListener("error", onerror = (_e: Event) => {
                this.stop();
                reject(new Error("Failed opening event source"));
            }, {once: true});
            this.eventSource.addEventListener("open", (_e: Event) => {
                log.info("Event source open", url);
                this.eventSource.removeEventListener("error", onerror);
                resolve();
            }, {once: true});
        });
    }

    stop(): void {
        if (this.eventSource) {
            log.info("Stopping event listener");
            this.eventSource.removeEventListener("event", this.eventReceived);
            this.eventSource.removeEventListener("error", this.onError);
            this.eventSource.close();
            this.eventSource = null;
        }
    }

    private onError = (e: Event) => {
        log.error("Event source error", e);
    }

    private eventReceived = (e: any) => {
        if (this.listener) {
            this.listener(e);
        }
    }
}

const log = logger.get(EventSourceListener);
