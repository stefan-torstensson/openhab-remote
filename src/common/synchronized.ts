class CallEntry {
    private readonly context: object;
    private readonly method: () => Promise<any>;
    private readonly args: [];
    private readonly deferred: Promise<any>;
    private resolve: () => void;
    private reject: () => void;

    constructor(context: object, method: () => any, args: []) {
        this.context = context;
        this.method = method;
        this.args = args;
        const self = this;
        this.deferred = new Promise<any>((resolve, reject) => {
            self.resolve = resolve;
            self.reject = reject;
        });
    }

    get promise(): Promise<any> {
        return this.deferred;
    }

    execute(): Promise<void> {
        return new Promise(resolve => {
            this.method.apply(this.context, this.args)
                .then(this.resolve, this.reject)
                .finally(resolve);
        });
    }
}

export function synchronized() {
    return (target: any,
            propertyName: string,
            descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>) => {

        const wrapped = descriptor.value;
        const callQueue: CallEntry[] = [];
        let inFlight = false;

        const execute = () => {
            if (inFlight || callQueue.length === 0) {
                return;
            }
            inFlight = true;
            const entry = callQueue.splice(0, 1)[0];
            entry.execute().then(() => {
                inFlight = false;
                execute();
            });
        };

        descriptor.value = function(...args: []) {
            const entry = new CallEntry(this, wrapped, args);
            callQueue.push(entry);
            execute();
            return entry.promise;
        };
    };
}
