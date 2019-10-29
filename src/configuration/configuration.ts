export abstract class Configuration {
    public abstract get<T>(key: string, defaultValue?: T): T;

    public abstract set<T>(key: string, value: T): void;

    public abstract remove(key: string): void;
}

