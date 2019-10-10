const { cwd } = Deno;

import {
    readFileStrSync,
    writeJsonSync
} from "https://deno.land/std/fs/mod.ts";
import { Tokenizer } from "../../mod.ts";

const source = readFileStrSync("./sample.json");

const tokenizer = new Tokenizer(source, [
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
        value: (m) => Number.parseFloat(m.match)
    },
    {
        type: "STRING",
        pattern: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,
        value: (m) => m.match.slice(1, -1)
    },
    { type: "TRUE", pattern: "true", value: true },
    { type: "FALSE", pattern: "false", value: false },
    { type: "NULL", pattern: "null", value: null }
]);

const result = tokenizer.tokenize();

writeJsonSync("./result.json", result, { spaces: 4 });
console.log("Done: result.json");
