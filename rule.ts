export interface Rule {
    pattern: RegExp | string;
    name: string;
    ignore?: boolean;
}
