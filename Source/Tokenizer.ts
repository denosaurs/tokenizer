import { Pattern , PatternTester } from './Pattern.ts';
import { Token } from './Token.ts';
import { Match } from './Match.ts';
import { Rule } from './Rule.ts';


type TokenConsumer = 
    ( token : Token ) => void;
    
type Tokens =
    Token [];


/** Tokenizes given source string into tokens */

export class Tokenizer implements IterableIterator<Token> {

    private _index = 0;

    /** The string that will be scanned */
    
    public readonly source : string;
    
    /** The rules that tells the Tokenizer what patterns to look for */
    
    public readonly rules : Rule[];

    public unexpectedCharacterError: () => never = () => {
        
        const { index , source } = this;
        
        throw `Unexpected character: "${ source[index] }" at index ${ index }`;
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
    
    public tokenize( source : string, callback : TokenConsumer ) : Tokens;
    public tokenize( callback : TokenConsumer ) : Tokens;
    public tokenize( source : string ) : Tokens;
    public tokenize() : Tokens;
    
    public tokenize(
        sourceOrCallback ?: TokenConsumer | string,
        callbackOrNothing ?: TokenConsumer
    ) : Tokens {
    
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
            
            const { source , index : start } = this;
            
            const result = this.match(source.substring(start),rule.pattern);

            if(!result)
                continue;

            const { ignore , type } = rule;

            if(ignore)
                return this.scan();
                
            if(type === '')
                return this.scan();
            
            const { groups , match } = result;
            
            let value = rule.value ?? match;
            
            if(typeof value === 'function')
                value = value(result);
            
            const { index : end } = this;

            return {
                groups , match , type , value ,
                position: { start , end }
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
        case type === 'function' : {
            
            const match = (pattern as PatternTester)(text);
        
            if(match)
                result = { match , groups : [] };
        
            break;
        }
        case type === 'string' :
            
            if(text.startsWith(pattern as string))
                result = { match : pattern , groups : [] } as Match;
        
            break;
        case pattern instanceof RegExp : {
            
            const matched = text.match(pattern as RegExp);

            if(matched?.index !== 0)
                break;
            
            const [ match ] = matched;
            
            let groups : string[] = [];
            
            if(matched.length > 1)
                groups = matched.slice(1) 
            
            result = { groups , match };
            
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
