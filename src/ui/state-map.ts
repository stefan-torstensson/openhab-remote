export class StateMap {
    _state: { [k: string]: any } = {};

    set(key: string, value: any) {
        this._state[key] = value;
    }

    get(key: string, defaultValue?: any) {
        return this._state[key] || defaultValue;
    }
}
