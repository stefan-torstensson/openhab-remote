import Tizen = org.tizen.Tizen;

declare var global: AppGlobal;

interface AppGlobal extends Window {
    __logLevel: number;
    tizen: Tizen;
}

declare module "*.vue" {
    import Vue from 'vue';
    export default Vue;
}

declare module "*.svg" {
    const content: any;
    export default content;
}

declare module "url";
declare module "debounce-decorator";
declare module "swipe-listener";

declare module "event-source-polyfill" {
    interface KeyValueHeaders {
        [key: string]: string;
    }
    export interface ExtendedEventSourceInit extends EventSourceInit {
        headers: KeyValueHeaders;
        heartbeatTimeout: number;
    }
    export class EventSourcePolyfill extends EventSource{
        constructor(url: string, initDict?: ExtendedEventSourceInit);
    }
}

type Fetch = (input: string|RequestInfo|Request, init?: RequestInit) => Promise<Response>;
