import { Pattern , PatternTester } from './Pattern.ts';
import { Token } from './Token.ts';
import { Match } from './Match.ts';
import { Rule } from './Rule.ts';


/** Tokenizes given source string into tokens */

export class Tokenizer implements IterableIterator<Token> {

    private _index = 0;

    /** The string that will be scanned */
    
    public readonly source: string;
    
    /** The rules that tells the Tokenizer what patterns to look for */
    
    public readonly rules: Rule[];

    public unexpectedCharacterError: () => never = () => {
        throw `Unexpected character: "${ this.source[this.index] }" at index ${ this.index }`;
    };

    /** The current index of the Tokenizer in the source string */
    
    public get index() : number {
        return this._index;
    }

    /** Checks if the Tokenizer is done scanning the source string */
    
    public get done() : boolean {
        return this.index >= this.source.length;
    }

    /** Constructs a new Tokenizer */
    
    constructor( source : string , rules : Rule[] );
    constructor( rules : Rule[] );
    
    constructor( sourceOrRules : string | Rule[] , rulesOrNothing ?: Rule[] ){
    
        switch(typeof sourceOrRules){
        case 'string':
            
            this.source = sourceOrRules;
            this.rules = rulesOrNothing ?? [];
                
            return;
        default:
        
            this.source = '';
            this.rules = sourceOrRules;
        }
    }

    /** Tokenizes given string (default is the lexer input) to a Token array */
    
    public tokenize( source : string, callback : ( token : Token ) => void) : Token[];
    public tokenize( callback : ( token : Token ) => void ) : Token[];
    public tokenize( source : string ) : Token[];
    public tokenize() : Token[];
    
    public tokenize(
        sourceOrCallback ?: (( token : Token ) => void ) | string,
        callbackOrNothing ?: ( token : Token ) => void ) : Token[] {
    
        let callback = undefined;
        let { source } = this;

        switch(typeof sourceOrCallback){
        case 'function':
            callback = sourceOrCallback;
            break;
        case 'string':
            source = sourceOrCallback;
            break;
        }

        if(callbackOrNothing)
            callback = callbackOrNothing;

        const tokenizer = new Tokenizer(source,this.rules);
        const tokens : Token[] = [];

        while(!tokenizer.done){
            const { value } = tokenizer.next();

            callback?.(value);

            if(tokenizer.done)
                continue;
            
            tokens.push(value);
        }

        return tokens;
    }


    /** Resets the index of the Tokenizer */
    
    public reset() : void {
        this._index = 0;
    }

    
    /** Returns the next scanned Token */
    
    public next() : IteratorResult<Token> {
        
        if(this.done)
            return {
                value : undefined ,
                done : true
            }

        const token = this.scan();

        if(token)
            return {
                value : token ,
                done : false 
            }

        if(this.done)
            return {
                value : undefined ,
                done : true ,
            }

        this.unexpectedCharacterError();
    }


    private scan() : Token | undefined {
        
        if(this.done)
            return;
            
        for(const rule of this.rules){
            
            const start = this.index;
            const result = this.match(
                this.source.substring(this.index),
                rule.pattern
            );
            
            const end = this.index;

            if (result) {

                if(rule.ignore)
                    return this.scan();
                    
                if(rule.type === '')
                    return this.scan();
                
                return {
                    type: rule.type,
                    match: result.match,
                    value: rule.value
                        ? typeof rule.value === "function"
                        ? rule.value(result)
                        : rule.value
                        : result.match,
                    groups: result.groups,
                    position: {
                        start: start,
                        end: end,
                    }
                }
            }
        }
    }

    private match(
        text : string,
        pattern : Pattern,
        increment = true,
    ) : Match | undefined {
        
        let result : Match | undefined;

        const type = typeof pattern;
        
        switch(true){
        case type === 'function' :
            
        const matched = (pattern as PatternTester)(text);

            result = matched 
                ? { match: matched, groups: [] } 
                : undefined;
        
            break;
        case type === 'string' :
            
            result = text.startsWith(pattern as string)
                ? { match: pattern, groups: [] } as Match
                : undefined;
        
            break;
        case pattern instanceof RegExp : {
            
            const matched = text.match(pattern as RegExp);

            if(matched?.index === 0)
                result = {
                    match : matched[0] ,
                    groups : matched.length > 1 
                        ? matched.slice(1) 
                        : []
                }
            
            break;
        }
        case pattern instanceof Array :
        
            for(const p of pattern as any[]){
            
                result = this.match(text,p,false);

                if(result)
                    break;
            }
            
            break;
        }

        if(result && increment)
            this._index += result.match.length;
    
        return result;
    }

    [Symbol.iterator]() : IterableIterator<Token> {
        return this;
    }
}
