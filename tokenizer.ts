import { Rule } from "./rule.ts";
import { Token } from "./token.ts";

export class Tokenizer implements Iterator<Token> {
    private _index: number = 0;

    public readonly source: string;
    public readonly rules: Rule[];

    public get index(): number {
        return this._index;
    }

    public get done(): boolean {
        return !(this.index < this.source.length);
    }

    constructor(source: string, rules: Rule[]) {
        this.source = source;
        this.rules = rules;
    }

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

        throw `Unexpected character: "${this.source[this.index]}" at index ${
            this.index
        }`;
    }

    private scan(): Token {
        if (this.done) {
            return;
        } else {
            for (const rule of this.rules) {
                const match = this.match(
                    this.source.substring(this.index),
                    rule.pattern
                );

                if (match) {
                    if (rule.ignore || rule.name === "") {
                        return this.scan();
                    } else {
                        return {
                            name: rule.name,
                            value: match
                        };
                    }
                }
            }
        }
    }

    private match(text: string, pattern: RegExp | string): string {
        let match: string;
        
        if (typeof pattern === "string") {
            match = text.startsWith(pattern) ? pattern : undefined;
            if (!match) return;
        } else {
            const matchArray = text.match(pattern);
            if (!matchArray) return;
            if (matchArray.index !== 0) return;

            match = matchArray[0];
        }

        this._index += match.length;
        return match;
    }
}
