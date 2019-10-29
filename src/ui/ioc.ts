import {Container} from "aurelia-dependency-injection";

export const container = new Container();

export function Inject(key: any): PropertyDecorator {
    let value: any;
    return (target: any, propertyKey: string | symbol): void => {
        Reflect.defineProperty(target, propertyKey, {
            configurable: true,
            enumerable: true,
            get: () => {
                return value || (value = container.get(key));
            }
        });
    };
}
