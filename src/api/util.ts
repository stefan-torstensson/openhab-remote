export function assign(target: any, source: any): any {
    if (Array.isArray(source)) {
        target = assignArray(target, source);
    } else if (isObject(source)) {
        target = assignObject(target, source);
    } else if (source !== target) {
        target = source;
    }
    return target;
}

function assignObject(target: any, source: any): any {
    if (!isObject(target)) {
        target = {};
    }
    Object.keys(source).forEach((k: string) => {
        target[k] = assign(target[k], source[k]);
    });
    return target;
}

function assignArray(target: any[], source: any[]): any[] {
    if (!Array.isArray(target)) {
        target = [];
    }
    source.forEach((v, i) => {
        target[i] = assign(target[i], v);
    });
    return target;
}

function isObject(t: any): boolean {
    return (typeof t === "object");
}
