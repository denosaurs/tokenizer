# Tokenizer
[![Actions Status](https://github.com/eliassjogreen/deno_tokenizer/workflows/Tests/badge.svg)](https://github.com/eliassjogreen/deno_tokenizer/actions)
[![GitHub license](https://img.shields.io/github/license/eliassjogreen/deno_tokenizer)](https://github.com/eliassjogreen/deno_tokenizer)

A simple tokenizer for deno.

## Example
```TypeScript
import { Tokenizer } from "https://denopkg.com/eliassjogreen/deno_tokenizer/mod.ts";

const tokenizer = new Tokenizer("abc 123 HELLO", [
    { name: "HELLO",  pattern: "HELLO" },
    { name: "WORD",   pattern: /[a-zA-Z]+/ },
    { name: "DIGITS", pattern: /\d+/ },
    { name: "SPACE",  pattern: / /, ignore: true } // Or leave name blank and remove "ignore: true"
]);

// The first option:
// console.log([...tokenizer]);
// The second option:
// while (!tokenizer.done) {
//     console.log(tokenizer.next().value);
// }

// If you used the first option:
// => [ { name: "WORD", value: "abc", position: { start: 0, end: 3 } },
//      { name: "DIGITS", value: "123", position: { start: 4, end: 7 } },
//      { name: "HELLO", value: "HELLO", position: { start: 8, end: 13 } } ]

// If you use the second option:
// => { name: "WORD", value: "abc", position: { start: 0, end: 3 } }
// => { name: "DIGITS", value: "123", position: { start: 4, end: 7 } }
// => { name: "HELLO", value: "HELLO", position: { start: 8, end: 13 } }
```

## TODO
- [ ] Custom patterns using functions
- [x] Add position information to Token
- [ ] Better error handling
