export function sleep(delay: number): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(resolve, delay);
    });
}
