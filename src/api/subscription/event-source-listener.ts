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
            this.eventSource = new EventSource(url);
            this.eventSource.addEventListener("event", this.eventReceived);
            this.eventSource.addEventListener("error", e => {
                log.info("Error opening event source", e);
                this.stop();
                reject(e);
            });
            this.eventSource.addEventListener("open", e => {
                log.info("Event source open", e);
                resolve();
            });
        });
    }

    stop(): void {
        if (this.eventSource) {
            log.info("Stopping event listener");
            this.eventSource.removeEventListener("event", this.eventReceived);
            this.eventSource.close();
            this.eventSource = null;
        }
    }

    private eventReceived = (e: any) => {
        if (this.listener) {
            this.listener(e);
        }
    }
}

const log = logger.get(EventSourceListener);
