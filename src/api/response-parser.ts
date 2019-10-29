import { inject } from "aurelia-dependency-injection";

@inject(JSON)
export class ResponseParser {
    private static reviver(key: string, value: any): any {
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

    async parse(response: Response): Promise<any> {
        const text = await response.text();
        if (text) {
            return this.json.parse(text, ResponseParser.reviver);
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


