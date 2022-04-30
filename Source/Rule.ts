import { Pattern } from './Pattern.ts';

/** Represents a Rule to be scanned for in the Tokenizer */
export interface Rule {
  type: string | number;
  pattern: Pattern;
  value?: ((match: { match: string; groups: string[] }) => any) | any;
  ignore?: boolean;
}
