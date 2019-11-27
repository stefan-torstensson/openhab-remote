import Vue from "vue";

export function sleep(delay: number): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(resolve, delay);
    });
}

export function vuePropWarnFilter(injectedProps: string[]) {
    return (msg: string, _vm: Vue, _trace: string) => {
        for (const prop of injectedProps) {
            if (msg.includes(`The computed property "${prop}" is already defined in data.`)) {
                return;
            }
        }
        console.warn(`Vue warn: ${msg}`);
    };
}
