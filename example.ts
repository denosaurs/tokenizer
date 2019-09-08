import { Tokenizer } from "./mod.ts";

const tokenizer = new Tokenizer("0123456789", [
    { name: "DIGITS", pattern: "0123456789" }
]);

console.log(tokenizer.next());
console.log(tokenizer.next());
console.log(tokenizer.next());
console.log(tokenizer.next());
