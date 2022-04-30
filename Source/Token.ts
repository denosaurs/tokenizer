
/**
 *  Tokenizer Token
 */

interface Position {
    
    start : number ;
    
    end : number ;
    
}


export interface Token {
    
    position : Position ;
    
    groups : string [];
    
    match : string;
    
    value : any;
    
    type : string | number;

}
