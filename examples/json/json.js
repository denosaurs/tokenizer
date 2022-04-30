#!/usr/bin/env -S deno run --allow-read --allow-write

import { join , dirname , fromFileUrl } from 'https://deno.land/std/path/mod.ts'
import { Tokenizer } from '../../mod.ts';

const { readTextFile , writeTextFile } = Deno;
const { stringify } = JSON;
const { log } = console;


const 
    regex_number = /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
    regex_string = /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,
    regex_space = /[ \n\r\t]+/;


const 
    sampleFile = join(cwd(),'sample.json'),
    resultFile = join(cwd(),'result.json');


const rules = [
    { type : 'WHITESPACE', pattern : regex_space  , ignore : true    },
    { type : 'LBRACE'    , pattern : '{'                             },
    { type : 'RBRACE'    , pattern : '}'                             },
    { type : 'LBRACK'    , pattern : '['                             },
    { type : 'RBRACK'    , pattern : ']'                             },
    { type : 'COMMA'     , pattern : ','                             },
    { type : 'COLON'     , pattern : ':'                             },
    { type : 'NUMBER'    , pattern : regex_number , value : toNumber },
    { type : 'STRING'    , pattern : regex_string , value : toString },
    { type : 'TRUE'      , pattern : 'true'       , value : true     },
    { type : 'FALSE'     , pattern : 'false'      , value : false    },
    { type : 'NULL'      , pattern : 'null'       , value : null     }
];


const sample = await readTextFile(sampleFile);

const 
    tokenizer = new Tokenizer(rules),
    tokens = tokenizer.tokenize(sample),
    json = stringify(tokens,null,4);

await writeTextFile(resultFile,json);


log('Done: result.json');



function toString({ match }){
    return match.slice(1,-1);
}

function toNumber({ match }){
    return Number.parseFloat(match);
}

function cwd(){
    return dirname(fromFileUrl(import.meta.url));
}
