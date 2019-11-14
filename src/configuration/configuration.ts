export abstract class Configuration {
    public abstract get<T>(key: string, targetType?: new (...args: any[]) => T): T;

    public abstract set<T>(key: string, value: T): void;

    public abstract remove(key: string): void;
}

