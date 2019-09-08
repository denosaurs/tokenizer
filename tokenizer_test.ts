import { runTests, test } from "https://deno.land/x/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { Tokenizer } from "./mod.ts";

test(function matchesSingleRegex() {
    const tokenizer = new Tokenizer("0123456789", [
        { name: "DIGITS", pattern: /\d+/ }
    ]);

    assertEquals(tokenizer.next(), {
        done: false,
        value: { name: "DIGITS", value: "0123456789", position: { start: 0, end: 10 } }
    });
    assertEquals(tokenizer.next(), {
        done: true,
        value: undefined
    });
});

test(function matchesMultipleRegex() {
    const tokenizer = new Tokenizer("0123456789 0123456789", [
        { name: "DIGITS", pattern: /\d+/ },
        { name: "SPACE", pattern: / / }
    ]);

    assertEquals(tokenizer.next(), {
        done: false,
        value: { name: "DIGITS", value: "0123456789", position: { start: 0, end: 10 } }
    });
    assertEquals(tokenizer.next(), {
        done: false,
        value: { name: "SPACE", value: " ", position: { start: 10, end: 11 } }
    });
    assertEquals(tokenizer.next(), {
        done: false,
        value: { name: "DIGITS", value: "0123456789", position: { start: 11, end: 21 } }
    });
    assertEquals(tokenizer.next(), { done: true, value: undefined });
});

test(function matchesSingleString() {
    const tokenizer = new Tokenizer("0123456789", [
        { name: "DIGITS", pattern: "0123456789" }
    ]);

    assertEquals(tokenizer.next(), {
        done: false,
        value: { name: "DIGITS", value: "0123456789", position: { start: 0, end: 10 } }
    });
    assertEquals(tokenizer.next(), {
        done: true,
        value: undefined
    });
});

test(function matchesMultipleString() {
    const tokenizer = new Tokenizer("0123456789 0123456789", [
        { name: "DIGITS", pattern: "0123456789" },
        { name: "SPACE", pattern: " " }
    ]);

    assertEquals(tokenizer.next(), {
        done: false,
        value: { name: "DIGITS", value: "0123456789", position: { start: 0, end: 10 } }
    });
    assertEquals(tokenizer.next(), {
        done: false,
        value: { name: "SPACE", value: " ", position: { start: 10, end: 11 } }
    });
    assertEquals(tokenizer.next(), {
        done: false,
        value: { name: "DIGITS", value: "0123456789", position: { start: 11, end: 21 } }
    });
    assertEquals(tokenizer.next(), {
        done: true,
        value: undefined
    });
});

test(function matchesSingleFunctionPattern() {
    const tokenizer = new Tokenizer('"0123456789 abcdef"', [
        {
            name: "STRING",
            pattern: (text: string) => {
                if (text.startsWith('"')) {
                    let i = 1;
                    let out = '"';

                    while (i < text.length && text.charAt(i) !== '"') {
                        out += text.charAt(i);
                        i++;
                    }

                    out += '"';
                    return out;
                } else {
                    return undefined;
                }
            }
        }
    ]);

    assertEquals(tokenizer.next(), {
        done: false,
        value: {
            name: "STRING",
            value: "\"0123456789 abcdef\"",
            position: { start: 0, end: 19 }
        }
    });
    assertEquals(tokenizer.next(), {
        done: true,
        value: undefined
    });
});

test(function matchesMultipleFunctionPattern() {
    const tokenizer = new Tokenizer('"0123456789 abcdef" "0123456789 abcdef"', [
        {
            name: "STRING",
            pattern: (text: string) => {
                if (text.startsWith('"')) {
                    let i = 1;
                    let out = '"';

                    while (i < text.length && text.charAt(i) !== '"') {
                        out += text.charAt(i);
                        i++;
                    }

                    out += '"';
                    return out;
                } else {
                    return undefined;
                }
            }
        },
        {
            name: "SPACE",
            pattern: (text: string) => {
                let i = 0;
                let out = '';

                while (i < text.length && text.charAt(i) === ' ') {
                    out += text.charAt(i);
                    i++;
                }

                return out;
            }
        },
    ]);

    assertEquals(tokenizer.next(), {
        done: false,
        value: {
            name: "STRING",
            value: "\"0123456789 abcdef\"",
            position: { start: 0, end: 19 }
        }
    });
    assertEquals(tokenizer.next(), {
        done: false,
        value: {
            name: "SPACE",
            value: " ",
            position: { start: 19, end: 20 }
        }
    });
    assertEquals(tokenizer.next(), {
        done: false,
        value: {
            name: "STRING",
            value: "\"0123456789 abcdef\"",
            position: { start: 20, end: 39 }
        }
    });
    assertEquals(tokenizer.next(), {
        done: true,
        value: undefined
    });
});

test(function ignoresSingleRegex() {
    const tokenizer = new Tokenizer("0123456789", [
        { name: "", pattern: /\d+/ }
    ]);

    assertEquals(tokenizer.next(), {
        done: true,
        value: undefined
    });
    assertEquals(tokenizer.next(), {
        done: true,
        value: undefined
    });
});

test(function ignoresMultipleRegex() {
    const tokenizer = new Tokenizer("0123456789 0123456789", [
        { name: "", pattern: /\d+/ },
        { name: "", pattern: / / }
    ]);

    assertEquals(tokenizer.next(), {
        done: true,
        value: undefined
    });
    assertEquals(tokenizer.next(), {
        done: true,
        value: undefined
    });
    assertEquals(tokenizer.next(), {
        done: true,
        value: undefined
    });
    assertEquals(tokenizer.next(), {
        done: true,
        value: undefined
    });
});

test(function ignoresSingleString() {
    const tokenizer = new Tokenizer("0123456789", [
        { name: "", pattern: "0123456789" }
    ]);

    assertEquals(tokenizer.next(), {
        done: true,
        value: undefined
    });
    assertEquals(tokenizer.next(), {
        done: true,
        value: undefined
    });
});

test(function ignoresMultipleString() {
    const tokenizer = new Tokenizer("0123456789 0123456789", [
        { name: "", pattern: "0123456789" },
        { name: "", pattern: " " }
    ]);

    assertEquals(tokenizer.next(), {
        done: true,
        value: undefined
    });
    assertEquals(tokenizer.next(), {
        done: true,
        value: undefined
    });
    assertEquals(tokenizer.next(), {
        done: true,
        value: undefined
    });
    assertEquals(tokenizer.next(), {
        done: true,
        value: undefined
    });
});

test(function ignoresSingleFunctionPattern() {
    const tokenizer = new Tokenizer('"0123456789 abcdef"', [
        {
            name: "",
            pattern: (text: string) => {
                if (text.startsWith('"')) {
                    let i = 1;
                    let out = '"';

                    while (i < text.length && text.charAt(i) !== '"') {
                        out += text.charAt(i);
                        i++;
                    }

                    out += '"';
                    return out;
                } else {
                    return undefined;
                }
            }
        }
    ]);

    assertEquals(tokenizer.next(), {
        done: true,
        value: undefined
    });
    assertEquals(tokenizer.next(), {
        done: true,
        value: undefined
    });
});

test(function ignoresMultipleFunctionPattern() {
    const tokenizer = new Tokenizer('"0123456789 abcdef" "0123456789 abcdef"', [
        {
            name: "",
            pattern: (text: string) => {
                if (text.startsWith('"')) {
                    let i = 1;
                    let out = '"';

                    while (i < text.length && text.charAt(i) !== '"') {
                        out += text.charAt(i);
                        i++;
                    }

                    out += '"';
                    return out;
                } else {
                    return undefined;
                }
            }
        },
        {
            name: "",
            pattern: (text: string) => {
                let i = 0;
                let out = '';

                while (i < text.length && text.charAt(i) === ' ') {
                    out += text.charAt(i);
                    i++;
                }

                return out;
            }
        },
    ]);

    assertEquals(tokenizer.next(), {
        done: true,
        value: undefined
    });
    assertEquals(tokenizer.next(), {
        done: true,
        value: undefined
    });
    assertEquals(tokenizer.next(), {
        done: true,
        value: undefined
    });
    assertEquals(tokenizer.next(), {
        done: true,
        value: undefined
    });
});

test(function testIterable() {
    const tokenizer = new Tokenizer("0123456789 0123456789", [
        { name: "DIGITS", pattern: /\d+/ },
        { name: "SPACE", pattern: / / }
    ]);

    assertEquals(
        [...tokenizer],
        [
            { name: "DIGITS", value: "0123456789", position: { start: 0, end: 10 } },
            { name: "SPACE", value: " ", position: { start: 10, end: 11 } },
            { name: "DIGITS", value: "0123456789", position: { start: 11, end: 21 } }
        ]
    );
});
