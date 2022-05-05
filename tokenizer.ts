import { Rule } from "./rule.ts";
import { Token } from "./token.ts";
import { Pattern } from "./pattern.ts";

/** Tokenizes given source string into tokens */
export class Tokenizer implements IterableIterator<Token> {
  #index = 0;

  /** The string that will be scanned */
  readonly source: string;
  /** The rules that tells the Tokenizer what patterns to look for */
  readonly rules: Rule[];

  unexpectedCharacterError: () => never = () => {
    throw `Unexpected character: "${
      this.source[this.index]
    }" at index ${this.index}`;
  };

  /** The current index of the Tokenizer in the source string */
  get index(): number {
    return this.#index;
  }

  /** Checks if the Tokenizer is done scanning the source string */
  get done(): boolean {
    return !(this.index < this.source.length);
  }

  /** Constructs a new Tokenizer */
  constructor(rules: Rule[]);
  constructor(source: string, rules: Rule[]);
  constructor(sourceOrRules: string | Rule[], rulesOrNothing?: Rule[]) {
    if (typeof sourceOrRules === "string") {
      this.source = sourceOrRules;
      this.rules = rulesOrNothing || [];
    } else {
      this.source = "";
      this.rules = sourceOrRules;
    }
  }
  /** Add a rule to the Tokenizer */
  addRule(rule: Rule): void {
    this.rules.push(rule);
  }

  /** Tokenizes given string (default is the lexer input) to a Token array */
  tokenize(): Token[];
  tokenize(source: string): Token[];
  tokenize(source: string, callback: (token: Token) => void): Token[];
  tokenize(callback: (token: Token) => void): Token[];
  tokenize(
    sourceOrCallback?: ((token: Token) => void) | string,
    callbackOrNothing?: (token: Token) => void,
  ): Token[] {
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

      if (!tokenizer.done) {
        tokens.push(token.value);
      }
    }

    return tokens;
  }

  /** Resets the index of the Tokenizer */
  reset(): void {
    this.#index = 0;
  }
  /** Returns the next scanned Token */
  next(): IteratorResult<Token> {
    if (this.done) {
      return {
        done: true,
        value: undefined,
      };
    }

    const token = this.#scan();

    if (token) {
      return {
        done: false,
        value: token,
      };
    }

    if (this.done) {
      return {
        done: true,
        value: undefined,
      };
    }

    this.unexpectedCharacterError();
  }

  #scan(): Token | undefined {
    if (this.done) return;
    for (const rule of this.rules) {
      const start = this.index;
      const result = this.#match(
        this.source.substring(this.index),
        rule.pattern,
      );
      const end = this.index;
      if (result) {
        return rule.ignore || rule.type === "" ? this.#scan() : {
          type: rule.type,
          match: result.match,
          value: rule.value
            ? typeof rule.value === "function" ? rule.value(result) : rule.value
            : result.match,
          groups: result.groups,
          position: {
            start: start,
            end: end,
          },
        };
      }
    }
  }

  #match(
    text: string,
    pattern: Pattern,
    increment = true,
  ): { match: string; groups: string[] } | undefined {
    let result: { match: string; groups: string[] } | undefined;

    if (typeof pattern === "function") {
      const matched = pattern(text);

      result = matched ? { match: matched, groups: [] } : undefined;
    } else if (typeof pattern === "string") {
      result = text.startsWith(pattern)
        ? { match: pattern, groups: [] }
        : undefined;
    } else if (pattern instanceof RegExp) {
      const matched = text.match(pattern);

      if (matched && matched.index === 0) {
        result = {
          match: matched[0],
          groups: matched.length > 1 ? matched.slice(1) : [],
        };
      }
    } else if (pattern instanceof Array) {
      for (const p of pattern) {
        result = this.#match(text, p, false);

        if (result) break;
      }
    }

    if (result && increment) this.#index += result.match.length;
    return result;
  }

  [Symbol.iterator](): IterableIterator<Token> {
    return this;
  }
}
