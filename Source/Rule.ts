import { Pattern } from './Pattern.ts';
import { Match } from './Match.ts';


type MatchProcessor = 
    ( match : Match ) => any;


/**
 *  Tokenizer Rule
 */

export interface Rule {
    
    pattern : Pattern;

    ignore ?: boolean;
    
    value ?: MatchProcessor | any;

    type : string | number;
    
}
