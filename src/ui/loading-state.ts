import {inject} from "aurelia-dependency-injection";
import {AppEvent, PubSub} from "@app/ui/event-bus";
import {container} from "./ioc";

@inject(PubSub)
export class LoadingState {
    private _handleCount = 0;
    private _handles: number[] = [];
    private _pubsub: PubSub;

    constructor(pubsub: PubSub) {
        this._pubsub = pubsub;
    }

    start(): number {
        const handleId = this._handleCount++;
        this._handles.push(handleId);
        if (this._handles.length === 1) {
            this._pubsub.$emit(AppEvent.LOADING_CHANGE, true);
        }
        return handleId;
    }

    stop(handleId: number) {
        this._handles = this._handles.filter(id => id !== handleId);
        if (this._handles.length === 0) {
            this._pubsub.$emit(AppEvent.LOADING_CHANGE, false);
        }
    }
}

export function loadingIndication() {
    const loadingState: LoadingState = container.get(LoadingState);
    return (target: any,
            propertyName: string,
            descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any> | any>) => {

        const wrapped = descriptor.value;

        descriptor.value = async function(...args: []) {
            const handleId = loadingState.start();
            return Promise.resolve(wrapped.apply(this, args))
                .finally(() => {
                    loadingState.stop(handleId);
                });
        };
    };
}
