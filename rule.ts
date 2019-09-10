import { Pattern } from "./pattern.ts";

export interface Rule {
    type: string;
    pattern: Pattern;
    ignore?: boolean;
}
