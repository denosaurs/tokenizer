const { cwd } = Deno;

import { readFileStrSync, writeJsonSync } from "https://deno.land/std/fs/mod.ts";
import { Tokenizer } from "../../mod.ts";

const source = readFileStrSync("./sample.json");

const tokenizer = new Tokenizer(source, [
    { type: "WHITESPACE", pattern: /[ \n\r\t]+/ },
    { type: "LBRACE", pattern: "{"},
    { type: "RBRACE", pattern: "}"},
    { type: "LBRACK", pattern: "["},
    { type: "RBRACK", pattern: "]"},
    { type: "COMMA", pattern: ","},
    { type: "COLON", pattern: ":"},
    { type: "NUMBER", pattern: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/},
    { type: "STRING", pattern: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/},
    { type: "TRUE", pattern: "true"},
    { type: "FALSE", pattern: "false"},
    { type: "NULL", pattern: "null"}
]);

const result = tokenizer.tokenize();

writeJsonSync("./result.json", result, { spaces: 4 });
console.log("Done: result.json");
