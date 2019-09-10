/** Represents the Token that will be return on a match when scanning in the Tokenizer */
export interface Token {
    type: string;
    value: string;
    position: { start: number, end: number }
}
