/// <reference types="node" />
import { ExifParser } from "./ExifParser";
export declare class ExifParserFactory {
    static create(buffer: Buffer | ArrayBuffer, global?: any): ExifParser;
}
