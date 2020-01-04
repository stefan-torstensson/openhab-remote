export class SelectOption {
    private value: string;
    private label: string;
    private description: string;

    constructor(value: string, label: string, description: string = null) {
        this.value = value;
        this.label = label;
        this.description = description;
    }
}
