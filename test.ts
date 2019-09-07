import { runTests, test } from "https://deno.land/x/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { Rule, Token, Tokenizer } from "./mod.ts";

test(function matchesSingleRegex() {
    const tokenizer = new Tokenizer("0123456789", [ { name: "DIGITS", regex: /\d+/ } ]);

    assertEquals(tokenizer.next(), { done: false, value: { name: "DIGITS", value: "0123456789" } });
    assertEquals(tokenizer.next(), { done: true, value: undefined });
});

test(function matchesMultipleRegex() {
    const tokenizer = new Tokenizer("0123456789 0123456789", [
        { name: "DIGITS", regex: /\d+/ },
        { name: "SPACE", regex: / / }
    ]);

    assertEquals(tokenizer.next(), { done: false, value: { name: "DIGITS", value: "0123456789" } });
    assertEquals(tokenizer.next(), { done: false, value: { name: "SPACE", value: " " } });
    assertEquals(tokenizer.next(), { done: false, value: { name: "DIGITS", value: "0123456789" } });
    assertEquals(tokenizer.next(), { done: true, value: undefined });
});

test(function ignoresSingleRegex() {
    const tokenizer = new Tokenizer("0123456789", [ { name: "", regex: /\d+/ } ]);

    assertEquals(tokenizer.next(), { done: true, value: undefined });
    assertEquals(tokenizer.next(), { done: true, value: undefined });
});

test(function ignoresMultipleRegex() {
    const tokenizer = new Tokenizer("0123456789 0123456789", [
        { name: "", regex: /\d+/ },
        { name: "", regex: / / }
    ]);
    
    assertEquals(tokenizer.next(), { done: true, value: undefined });
    assertEquals(tokenizer.next(), { done: true, value: undefined });
    assertEquals(tokenizer.next(), { done: true, value: undefined });
    assertEquals(tokenizer.next(), { done: true, value: undefined });
});

runTests();
