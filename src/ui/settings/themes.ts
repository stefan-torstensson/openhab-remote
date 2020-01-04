export interface Theme {
    name: string;
    className: string;
}

export const AVAILABLE_THEMES: Theme[] = [
    {name: "Blue", className: "theme-blue"},
    {name: "Dark Blue", className: "theme-dark-blue"},
    {name: "Red", className: "theme-red"},
    {name: "Green", className: "theme-green"},
    {name: "Cyan", className: "theme-cyan"},
    {name: "Purple", className: "theme-purple"},
    {name: "Orange", className: "theme-orange"}
];

export function getNameFromClass(themes: Theme[], className: string) {
    const theme = themes.find(t => t.className === className);
    return theme ? theme.name : "";
}
