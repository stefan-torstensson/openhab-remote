export class Subscription {
    private readonly _url: string;

    constructor(url: string) {
        this._url = url;
    }

    get url(): string {
        return this._url;
    }

    get subscriptionId(): string {
        const segments = this.url.split("/");
        return segments[segments.length - 1];
    }
}
