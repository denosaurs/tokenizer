import { Pattern } from "./pattern.ts";

export interface Rule {
    name: string;
    pattern: Pattern;
    ignore?: boolean;
}
