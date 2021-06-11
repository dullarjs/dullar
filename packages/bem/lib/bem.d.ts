import { BemParserContext, ConfigOptions } from "../types";
declare class BEM {
    static blockPrefix: string;
    static modifierSeparator: string;
    static elementSeparator: string;
    static config(options: ConfigOptions): void;
    static BlockParser(name: BemParserContext): string;
    static ElementParser(b: BemParserContext, e: BemParserContext): string;
    static create(b: BemParserContext, e?: BemParserContext): string;
}
export default BEM;
export declare const createBem: (b: BemParserContext, e?: BemParserContext | undefined) => string;
