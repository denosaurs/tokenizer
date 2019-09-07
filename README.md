# Deno_Tokenizer
[![Actions Status](https://github.com/eliassjogreen/Deno_Tokenizer/workflows/Test/badge.svg)](https://github.com/eliassjogreen/Deno-Tokenizer/actions)
[![GitHub license](https://img.shields.io/github/license/eliassjogreen/deno-tokenizer)](https://github.com/eliassjogreen/deno-tokenizer)

A simple tokenizer for deno.

## Example
```TypeScript
import { Tokenizer } from "https://denopkg.com/eliassjogreen/deno_tokenizer/mod.ts";

const tokenizer = new Tokenizer("abc 123", [
    { name: "WORD",   regex: /[a-zA-Z]+/ },
    { name: "DIGITS", regex: /\d+/ },
    { name: "SPACE",  regex: / /, ignore: true }, // Or leave name blank and remove "ignore: true"
]);

while (!tokenizer.done) {
    console.log(tokenizer.next().value);
}

// => { name: "WORD", value: "abc" }
// => { name: "DIGITS", value: "123" }
```
