import { Pattern } from "./pattern.ts";

/** Represents a Rule to be scanned for in the Tokenizer */
export interface Rule {
    type: string;
    pattern: Pattern;
    value?: ((match: { match: string; groups: string[] }) => any) | any;
    ignore?: boolean;
}
