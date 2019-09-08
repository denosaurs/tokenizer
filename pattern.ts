export type Pattern = ((text: string) => string | undefined) | RegExp | string;
