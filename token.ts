export interface Token {
    type: string;
    value: string;
    position: { start: number, end: number }
}
