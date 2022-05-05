import type { Pattern } from "./pattern.ts";

/** Represents a Rule to be scanned for in the Tokenizer */
export interface Rule {
  type: string | number;
  pattern: Pattern;
  // deno-lint-ignore no-explicit-any
  value?: ((match: { match: string; groups: string[] }) => any) | any;
  ignore?: boolean;
}
