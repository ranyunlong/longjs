/**
 * Decorators
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-29 15:50
 * @export Decorators
 */

import {
    createClassDecorator,
    createMethodDecorator,
    createParameterDecorator,
    createPropertyDecorator,
    createRequestDecorator,
    createPropertyAndParameterDecorator,
    Core
} from '@longjs/Core'
import 'validator'
import 'reflect-metadata'
import validateParams, { ValidatorKeys, Messages } from './lib';

/**
 * Controller Decorator
 * @param path
 */
export function Controller(path: string): ClassDecorator {
    return createClassDecorator((options) => {
        const { target } = options
        // Set options metadata
        options.metadatas = Reflect.getMetadata('design:paramtypes', target) || []
        // Set options route root path
        options.route = (path + '/').replace(/[\/]{2,}/g, '/')
    })
}

/**
 * Parameter && Property Decorator
 * Header
 */
export interface Headers {
    [key: string]: any;
}
export const Headers = createPropertyAndParameterDecorator<string[]>((ctx: Core.Context, args: string[]) => {
    if (Array.isArray(args)) {
        const data: any = {}
        args.forEach((k: string) => {
            data[k] = ctx.headers[k]
        })
        return data
    }
    return ctx.headers
})

/**
 * Parameter && Property Decorator
 * Body
 */
export interface Body<T = any> {
    data: T;
    getError: () => { [K in keyof T]: Messages } | false
}
export const Body = createPropertyAndParameterDecorator<ValidatorKeys>('Body', (ctx: Core.Context, validateKeys: ValidatorKeys) => {
    const data: Body = {
        data: {},
        getError() {
            return false;
        }
    }
    if (!Array.isArray(validateKeys) && typeof validateKeys ===  'object') {
        Object.keys(validateKeys).forEach((k: string) => {
            data.data[k] = ctx.body[k] || validateKeys[k].defalut
        })
        const errors = validateParams(data, validateKeys)
        if (Object.keys(errors).length > 0) {
           data.getError = function() {
               return errors
           }
        }
        return data
    }

    data.data = ctx.body
    return data
})

/**
 * Parameter && Property Decorator
 * Query
 */
export interface Query<T = any> {
    data: T;
    getError: () => { [K in keyof T]: Messages } | false
}
export const Query = createPropertyAndParameterDecorator<ValidatorKeys>('Query', (ctx: Core.Context, validateKeys: ValidatorKeys) => {
    const data: Query = {
        data: {},
        getError() {
            return false;
        }
    }
    if (!Array.isArray(validateKeys) && typeof validateKeys ===  'object') {
        Object.keys(validateKeys).forEach((k: string) => {
            data.data[k] = ctx.query[k] || validateKeys[k].defalut
        })
        const errors = validateParams(data, validateKeys)
        if (Object.keys(errors).length > 0) {
           data.getError = function() {
               return errors
           }
        }
        return data
    }

    data.data = ctx.query
    return data
})

/**
 * Parameter && Property Decorator
 * Request
 */
export interface Params<T = any> {
    data: T;
    getError: () => { [K in keyof T]: Messages } | false
}
export const Params = createPropertyAndParameterDecorator<ValidatorKeys>('Params', (ctx: Core.Context, validateKeys: ValidatorKeys): Params => {
    const data: Params = {
        data: {},
        getError() {
            return false;
        }
    }
    if (!Array.isArray(validateKeys) && typeof validateKeys ===  'object') {
        Object.keys(validateKeys).forEach((k: string) => {
            data.data[k] = ctx.params[k] || validateKeys[k].defalut
        })
        const errors = validateParams(data, validateKeys)
        if (Object.keys(errors).length > 0) {
           data.getError = function() {
               return errors
           }
        }
        return data
    }

    data.data = ctx.params
    return data
})

/**
 * Parameter && Property Decorator
 * Session
 */
export interface Session {
    [key: string]: any;
}
export const Session = createPropertyAndParameterDecorator<string[]>((ctx: Core.Context, args: string[]) => {
    if (Array.isArray(args)) {
        const data: any = {}
        args.forEach((k: string) => {
            data[k] = ctx.session[k]
        })
        return data
    }
    return ctx.session
})

/**
 * Parameter && Property Decorator
 * Request
 */
export type Request = Core.Request
export const Request = createPropertyAndParameterDecorator<string[]>((ctx: Core.Context, args: string[]) => {
    if (Array.isArray(args)) {
        const data: any = {}
        args.forEach((k: string) => {
            data[k] = (ctx.request as any)[k]
        })
        return data
    }
    return ctx.request
})

/**
 * Parameter && Property Decorator
 * Request
 */
export type Response = Core.Response
export const Response = createPropertyAndParameterDecorator<string[]>((ctx: Core.Context, args: string[]) => {
    if (Array.isArray(args)) {
        const data: any = {}
        args.forEach((k: string) => {
            data[k] = (ctx.response as any)[k]
        })
        return data
    }
    return ctx.response
})

/**
 * Parameter && Property Decorator
 * Files
 */
export interface Files {
    [key: string]: any;
}
export const Files = createPropertyAndParameterDecorator<string[]>('Files', (ctx: Core.Context, args: string[]) => {
    if (Array.isArray(args)) {
        const data: any = {}
        args.forEach((k: string) => {
            data[k] = ctx.files[k]
        })
        return data
    }
    return ctx.files
})

/**
 * MethodDecorators
 * Type
 */
export const Type = createMethodDecorator<string>((ctx, options) => {
    const { value } = options.descriptor
    options.descriptor.value = async function(...args: any[]) {
        let data = await value.call(this, ...args)
        if (data) {
            ctx.type = options.arg
        }
        return data
    }
})

/**
 * MethodDecorators
 * Status
 */
export const Status = createMethodDecorator<string>((ctx, options) => {
    const { value } = options.descriptor
    options.descriptor.value = async function(...args: any[]) {
        let data = await value.call(this, ...args)
        if (data) {
            ctx.status = options.arg
        }
        return data
    }
})

/**
 * RequestMethodDecorators
 * Get
 */
export const Get = createRequestDecorator<string>('GET')

/**
 * RequestMethodDecorators
 * All
 */
export const All = createRequestDecorator<string>('ALL')

/**
 * RequestMethodDecorators
 * Delete
 */
export const Delete = createRequestDecorator<string>('DELETE')

/**
 * RequestMethodDecorators
 * Head
 */
export const Head = createRequestDecorator<string>('HEAD')

/**
 * RequestMethodDecorators
 * Options
 */
export const Options = createRequestDecorator<string>('OPTIONS')

/**
 * RequestMethodDecorators
 * Patch
 */
export const Patch = createRequestDecorator<string>('PATCH')

/**
 * RequestMethodDecorators
 * Post
 */
export const Post = createRequestDecorator<string>('POST')

/**
 * RequestMethodDecorators
 * Put
 */
export const Put = createRequestDecorator<string>('PUT')

export * from './lib'