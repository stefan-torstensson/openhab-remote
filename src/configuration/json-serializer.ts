export class JsonSerializer {
    serialize(data: any): string {
        return JSON.stringify(data);
    }

    deserialize<T>(text: string, type?: new (...args: any[]) => T): T | any {
        if (text) {
            const data = JSON.parse(text);
            if (type) {
                const instance = Object.create(type.prototype);
                return Object.assign(instance, data);
            }
            return data;
        }
        return null;
    }

}
