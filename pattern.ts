export type Pattern =
    | ((text: string) => string | undefined)
    | ((text: string) => string | undefined)[]
    | RegExp
    | RegExp[]
    | string
    | string[];
