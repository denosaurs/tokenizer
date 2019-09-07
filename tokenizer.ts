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
                    rule.regex
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

    private match(text: string, regex: RegExp): string {
        const match = text.match(regex);
        if (!match) return;
        if (match.index !== 0) return;

        this._index += match[0].length;
        return match[0];
    }
}
