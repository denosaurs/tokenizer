export interface Rule {
    regex: RegExp;
    name: string;
    ignore?: boolean;
}