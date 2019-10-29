interface Label {
    label: string;
    state: string;
}

const labelRegEx = /^(.*)\[(.*)\]$/;

export function parseLabel(label: string): Label {
    const match = labelRegEx.exec(label);
    if (match) {
        return {
            label: match[1].trim(),
            state: match[2].trim()
        } as Label;
    }
    return {label} as Label;
}
