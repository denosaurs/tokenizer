import { Rule } from "./rule.ts";
import { Token } from "./token.ts";
import { Pattern } from "./pattern.ts";

/** Tokenizes given source string into tokens */
export class Tokenizer implements IterableIterator<Token> {
    private _index = 0;

    /** The string that will be scanned */
    public readonly source: string;
    /** The rules that tells the Tokenizer what patterns to look for */
    public readonly rules: Rule[];

    public unexpectedCharacterError: () => void = () => {
        throw `Unexpected character: "${this.source[this.index]}" at index ${
            this.index
        }`;
    };

    /** The current index of the Tokenizer in the source string */
    public get index(): number {
        return this._index;
    }

    /** Checks if the Tokenizer is done scanning the source string */
    public get done(): boolean {
        return !(this.index < this.source.length);
    }

    /** Constructs a new Tokenizer */
    constructor(rules: Rule[]);
    constructor(source: string, rules: Rule[]);
    constructor(sourceOrRules: string | Rule[], rulesOrNothing?: Rule[]) {
        if (typeof sourceOrRules === "string") {
            this.source = sourceOrRules;
        } else {
            this.source = "";
            this.rules = sourceOrRules;
        }

        if (rulesOrNothing) {
            this.rules = rulesOrNothing;
        }
    }

    /** Tokenizes given string (default is the lexer input) to a Token array */
    public tokenize();
    public tokenize(source: string);
    public tokenize(source: string, callback: (token: Token) => void);
    public tokenize(callback: (token: Token) => void);
    public tokenize(sourceOrCallback?: ((token: Token) => void) | string, callbackOrNothing?: (token: Token) => void): Token[] {
        let source = this.source;
        let callback = undefined;

        if (typeof sourceOrCallback === "string") {
            source = sourceOrCallback;
        } else if (typeof sourceOrCallback === "function") {
            callback = sourceOrCallback;
        }

        if (callbackOrNothing) {
            callback = callbackOrNothing;
        }

        const tokenizer = new Tokenizer(source, this.rules);
        const tokens: Token[] = [];

        while (!tokenizer.done) {
            const token = tokenizer.next();

            if (callback) {
                callback(token.value);
            }

            tokens.push(token.value);
        }

        return tokens;
    }

    /** Resets the index of the Tokenizer */
    public reset(): void {
        this._index = 0;
    }

    /** Returns the next scanned Token */
    public next(): IteratorResult<Token> {
        if (this.done) {
            return {
                done: true,
                value: undefined
            };
        }

        const token = this.scan();

        if (token) {
            return {
                done: false,
                value: token
            };
        } else if (this.done) {
            return {
                done: true,
                value: undefined
            };
        }

        this.unexpectedCharacterError();
    }

    private scan(): Token | undefined {
        if (this.done) {
            return;
        } else {
            for (const rule of this.rules) {
                const start = this.index;
                const match = this.match(
                    this.source.substring(this.index),
                    rule.pattern
                );
                const end = this.index;

                if (match) {
                    if (rule.ignore || rule.type === "") {
                        return this.scan();
                    } else {
                        return {
                            type: rule.type,
                            value: match,
                            position: {
                                start: start,
                                end: end
                            }
                        };
                    }
                }
            }
        }
    }

    private match(text: string, pattern: Pattern): string | undefined {
        let match: string | undefined = undefined;

        if (typeof pattern === "function") {
            match = pattern(text);
        } else if (typeof pattern === "string") {
            match = text.startsWith(pattern) ? pattern : undefined;
        } else if (pattern instanceof RegExp) {
            const result = text.match(pattern);
            match = result && result.index === 0 ? result[0] : undefined;
        } else if (pattern instanceof Array) {
            for (const p of pattern) {
                if ((match = this.match(text, p))) break;
            }
        }

        if (match) this._index += match.length;
        return match;
    }

    [Symbol.iterator](): IterableIterator<Token> {
        return this;
    }
}
