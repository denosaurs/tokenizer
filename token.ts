/** Represents the Token that will be return on a match when scanning in the Tokenizer */
export interface Token {
  type: string | number;
  match: string;
  groups: string[];
  // deno-lint-ignore no-explicit-any
  value: any;
  position: {
    start: number;
    end: number;
  };
}
