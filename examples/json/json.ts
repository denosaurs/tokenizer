const { readFileSync, writeFileSync } = Deno;

import { Tokenizer } from "../../mod.ts";

const source = new TextDecoder().decode(
  readFileSync("examples/json/sample.json"),
);

const tokenizer = new Tokenizer([
  { type: "WHITESPACE", pattern: /[ \n\r\t]+/, ignore: true },
  { type: "LBRACE", pattern: "{" },
  { type: "RBRACE", pattern: "}" },
  { type: "LBRACK", pattern: "[" },
  { type: "RBRACK", pattern: "]" },
  { type: "COMMA", pattern: "," },
  { type: "COLON", pattern: ":" },
  {
    type: "NUMBER",
    pattern: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
    // deno-lint-ignore no-explicit-any
    value: (m: any) => Number.parseFloat(m.match),
  },
  {
    type: "STRING",
    pattern: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,
    // deno-lint-ignore no-explicit-any
    value: (m: any) => m.match.slice(1, -1),
  },
  { type: "TRUE", pattern: "true", value: true },
  { type: "FALSE", pattern: "false", value: false },
  { type: "NULL", pattern: "null", value: null },
]);

const result = tokenizer.tokenize(source);

const json = JSON.stringify(result, null, 4);

writeFileSync("examples/json/result.json", new TextEncoder().encode(json));
console.log("Done: result.json");
