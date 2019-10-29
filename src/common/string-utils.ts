export function equalsIgnoreCase(s1: string, s2: string): boolean {
    if (!(s1 && s2)) {
        return s1 === s2;
    }
    return s1.localeCompare(s2, undefined, {sensitivity: "base"}) === 0;
}
