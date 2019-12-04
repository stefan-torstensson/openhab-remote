export enum WaitState {
    Waiting = -1,
    Failed = 0,
    Success = 1,
}

export function waitFor(predicate: () => WaitState, maxWait: number): Promise<boolean> {
    return new Promise(resolve => {
        let count = 0;
        const delay = 50;
        const waitCount = Math.floor(maxWait / delay);
        const waitForStart = () => {
            count++;
            const result = predicate();
            if (result !== WaitState.Waiting) {
                resolve(result === WaitState.Success);
            } else if (count > waitCount) {
                resolve(false);
            } else {
                setTimeout(waitForStart, delay);
            }
        };
        setTimeout(waitForStart, 0);
    });
}
