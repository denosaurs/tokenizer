export interface Rule {
    name: string;
    pattern: RegExp | string;
    ignore?: boolean;
}
