import { inject } from "aurelia-dependency-injection";

export interface ResponseParser {
    parse<T>(response: Response): Promise<T>;
    looksLikeOpenhab(response: Response): Promise<boolean>;
}

@inject(JSON)
export class JsonResponseParser implements ResponseParser {
    private static reviver(_key: string, value: any): any {
        if (typeof value === "string") {
            if (value === "NULL") {
                return null;
            }
            if (value === "UNDEF") {
                return undefined;
            }
        }
        return value;
    }

    private json: JSON;

    constructor(json: JSON) {
        this.json = json;
    }

    async parse<T>(response: Response): Promise<T> {
        const text = await response.text();
        if (text) {
            return this.json.parse(text, JsonResponseParser.reviver) as T;
        }
    }

    async looksLikeOpenhab(response: Response) {
        let data = null;
        try {
            data = await response.json();
        } catch (e) {
            return false;
        }
        return (data.version === "1" && data.links);
    }
}


