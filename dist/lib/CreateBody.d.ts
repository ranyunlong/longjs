/**
 * @class BodyParser
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-23 19:07
 */
import { Core } from '..';
export declare class CreateBody {
    ctx: Core.Context;
    readonly jsonLimit: string;
    readonly formLimit: string;
    readonly textLimit: number;
    readonly encoding: CreateBody.Encoding;
    readonly multipart: boolean;
    readonly urlencoded: boolean;
    readonly text: boolean;
    readonly json: boolean;
    readonly jsonStrict: boolean;
    readonly formidable: CreateBody.FormidableOptions;
    readonly strict: boolean;
    /**
     * constructor
     * @param ctx Context
     * @param opts Options
     */
    constructor(ctx: Core.Context, opts?: CreateBody.Options);
    /**
     * parse
     * Parser body request and file request
     *
     * Not allow GET DELETE HEAD COPY PURGE UNLOCK request
     */
    create(): Promise<void>;
    /**
     * parseBody
     * Parser body request data
     */
    private parseBody;
    /**
     * parseBody
     * Parser file request data
     */
    private parseFile;
}
/**
 * @namespace BodyParse
 * @interface BodyParse
 * @export { BodyParse }
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-23 22:49
 */
export declare namespace CreateBody {
    interface RequestFile {
        fields: any;
        files: any;
    }
    interface Options {
        jsonLimit?: number;
        formLimit?: number;
        textLimit?: number;
        encoding?: Encoding;
        multipart?: boolean;
        urlencoded?: boolean;
        text?: boolean;
        json?: boolean;
        jsonStrict?: boolean;
        formidable?: FormidableOptions;
        strict?: boolean;
    }
    interface FormidableOptions {
        maxFields?: number;
        maxFieldsSize?: number;
        uploadDir?: string;
        keepExtensions?: boolean;
        hash?: string | boolean;
        multiples?: boolean;
    }
    type Encoding = 'utf-8' | string;
}