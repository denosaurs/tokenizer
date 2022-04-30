# Tokenizer [![Badge License]][License]

*A simple **Deno** library*

---

<div align = center>

[![Badge Status]][Actions]

</div>

---

<br>

## Examples

```js
import { Tokenizer } from 'https://deno.land/x/tokenizer/mod.ts';

const input = 'abc 123 HELLO [a cool](link)';

const rules = [{ 
    type : 'HELLO' ,
    pattern : 'HELLO' 
},{ 
    type : 'WORD' ,
    pattern : /[a-zA-Z]+/ 
},{ 
    type : 'DIGITS' ,
    pattern : /\d+/ ,
    value : m => Number.parseInt(m.match)
},{ 
    type : 'LINK' ,
    pattern : /\[([^\[]+)\]\(([^\)]+)\)/
},{ 
    type : 'SPACE' , 
    pattern : / / ,
    ignore: true // Or leave type blank and remove "ignore: true"
}];

const tokenizer = new Tokenizer(input,rules);
```

<br>

### Option A

```js
console.log(...tokenizer);
```

```
{ type: "WORD", match: "abc", value: "abc", groups: [], position: { start: 0, end: 3 } },
{ type: "DIGITS", match: "123", value: 123, groups: [], position: { start: 4, end: 7 } },
{ type: "HELLO", match: "HELLO", value: "HELLO", groups: [], position: { start: 8, end: 13 } },
{ type: "LINK", match: "[a cool](link)", value: "[a cool](link)", groups: [ "a cool", "link" ], position: { start: 14, end: 28 } }
```

<br>

### Option B

```js
while(!tokenizer.done)
    console.log(tokenizer.next().value);
```

```
{ type: "WORD", match: "abc", value: "abc", groups: [], position: { start: 0, end: 3 } }
```
```
{ type: "DIGITS", match: "123", value: 123, groups: [], position: { start: 4, end: 7 } }
```
```
{ type: "HELLO", match: "HELLO", value: "HELLO", groups: [], position: { start: 8, end: 13 } }
```
```
{ type: "LINK", match: "[a cool](link)", value: "[a cool](link)", groups: [ "a cool", "link" ], position: { start: 14, end: 28 } }
```

<br>

### Option C

```js
// Add a parameter to the tokenize method to override the source string
console.log(tokenizer.tokenize());
```

```
[{ type: "WORD", match: "abc", value: "abc", groups: [], position: { start: 0, end: 3 } },
 { type: "DIGITS", match: "123", value: 123, groups: [], position: { start: 4, end: 7 } },
 { type: "HELLO", match: "HELLO", value: "HELLO", groups: [], position: { start: 8, end: 13 } },
 { type: "LINK", match: "[a cool](link)", value: "[a cool](link)", groups: [ "a cool", "link" ], position: { start: 14, end: 28 } } ]
```

<br>
<br>

## Testing

*You can execute the unit tests with:*

```sh
Tools/Test.ts
```

<br>
<br>

## TODO
- [x] Custom patterns using functions
- [x] Add position information to Token
- [x] Array patterns (Multiple patterns for the same rule)
- [x] Documentation
- [x] Better error handling
- [x] Group matching
- [x] Value transform
- [ ] More and better tests for everything
- [ ] Examples
- [ ] Line and column information? Or just a helper function to get line and column from index
- [ ] BNF / EBNF ?
- [ ] Generate a tokenizer


<!----------------------------------------------------------------------------->

[Badge License]: https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge
[Badge Status]: https://github.com/eliassjogreen/deno_tokenizer/workflows/Tests/badge.svg


[Actions]: https://github.com/eliassjogreen/deno_tokenizer/actions
[License]: LICENSE
