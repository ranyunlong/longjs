/**
 * Decorators
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-08 14:35
 * @export Decorators
 */

import 'reflect-metadata'
import { Server } from '..';
import * as pathToRegExp from 'path-to-regexp'

interface Options<T = any> {
    target?: Controller;
    propertyKey?: string | symbol;
    descriptor?: TypedPropertyDescriptor<T>
    parameterIndex?: number;
}

interface Parameters {
    [key: string]: Array<{
        handler?: Function;
        arg?: any;
    }>;
}

interface Propertys {
    [key: string]: {
        handler?: Function;
        arg?: any;
    }
}

interface Methods {
    [key: string]: {
        handler?: Function;
        options?: {
            target?: any;
            propertyKey?: string | symbol;
            descriptor?: TypedPropertyDescriptor<any>,
            arg?: any;
        }
    }
}

interface ControllerOptions {
    route?: string;
    metadatas?: Array<{ new(...args: any[]): any }>;
    parameters?: Parameters;
    propertys?: Propertys;
    methods?: Methods;
    target?: Controller;
    routes?: {
        [key: string]: Array<{
            routePath?: string;
            propertyKey?: string;
            keys?: pathToRegExp.Key[];
            RegExp?: RegExp;
        }>
    }
}

export interface Controller {
    readonly prototype: {
        $options: ControllerOptions;
    };
    [key: string]: any;
}

type ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex?: number) => void;
type ClassDecoratorCallback = (options: ControllerOptions) => void;
type RequestMethodType = 'ALL' | 'DELETE' | 'GET' | 'POST' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'PUT';
type ParameterDecoratorCallback = (ctx: Server.Context, arg: any) => any;
type PropertyDecoratorCallback = (ctx: Server.Context, arg?: any) => any;
type MethodDecoratorCallback = (ctx: Server.Context, options: Methods) => void;
/**
 * createClassDecorator
 * 创建类装饰器方法
 */
export function createClassDecorator(callback: ClassDecoratorCallback): ClassDecorator {
    return <C extends Controller>(target: C): C | void => {
        // Get options
        let options = target.prototype.$options || {}
        // Check options target is defined
        if (!options.target) options.target = target

        // Run callback
        callback(options)
        // Set controller route
        const { route, metadatas } = options
        if (route) options.route = route
        // Set metadata
        if (metadatas) options.metadatas = metadatas

        // Set options
        target.prototype.$options = options
    }
}

/**
 * 创建http请求装饰器方法
 * @param type
 */
export function createRequestDecorator<T = any>(type: RequestMethodType) {
    function decorator(route: T): MethodDecorator;
    function decorator(target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void;
    function decorator(...args: any[]): MethodDecorator | TypedPropertyDescriptor<any> | void {
        if (args.length === 1) {
            const [ route ] = args
            return handler(route)
        } else {
            return handler(null, ...args)
        }
    }

    function handler(route: string | null, ...args: any[]) {
        if (route) {
            return (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void => {
                appendRoute(route, target, propertyKey, descriptor)
            }
        } else {
            appendRoute(route, ...args)
        }

        function appendRoute(route: string, ...args: any[]) {
            const [target, propertyKey, descriptor] = args
            if (!route) route = propertyKey;
            // If the path does not start with '/',insert '/' before route.
            if (!/^\//.test(route)) {
                route = `/${route}`
            }

            // If the path Contains double `//`, replace with '/'.
            route = route.replace(/[\/]{2,}/g, '/')
            const options: ControllerOptions = (target as Controller).$options || {}
            const { routes } = options
            options.routes = routes || {}

            // Check if the route is duplicated
            const theTypeRoutes = options.routes[type]
            if (Array.isArray(theTypeRoutes)) {
                const filters = theTypeRoutes.filter((k) => {
                   return k.routePath === route
                })

                // If not is duplicated
                if (!filters.length) {
                    theTypeRoutes.push({
                        routePath: route,
                        propertyKey: propertyKey
                    })
                    return
                }

                throw new Error(`In class ${target.constructor.name}, function ${propertyKey}(), route path '${route}' Repeat in request type '${type}'.`)
            } else {
                options.routes[type] = [{
                    routePath: route,
                    propertyKey: propertyKey
                }]
            }

            target.$options = options
        }
    }

    return decorator;
}

/**
 * createParameterDecorator
 * 创建参数装饰器方法
 * @param callback
 */
export function createParameterDecorator<T = any>(callback: ParameterDecoratorCallback) {
    function decorator(target: any, propertyKey: string, parameterIndex: number): void;
    function decorator(arg: T): ParameterDecorator;
    function decorator(...args: any[]): any {
        if (args.length === 1) {
            return (target: any, propertyKey: string, parameterIndex: number): void => {
                const options = target.$options || {}
                const parameters: Parameters = options.parameters = options.parameters || {}
                if (!Array.isArray(parameters[propertyKey])) {
                    parameters[propertyKey] = []
                }
                parameters[propertyKey][parameterIndex] = {
                    handler: callback,
                    arg: args[0]
                }
                target.$options = options
            }
        } else {
            const [target, propertyKey, parameterIndex] = args
            const options = target.$options || {}
            const parameters: Parameters = options.parameters = options.parameters || {}
            if (!Array.isArray(parameters[propertyKey])) {
                parameters[propertyKey] = []
            }
            parameters[propertyKey][parameterIndex] = {
                handler: callback
            }
            target.$options = options
        }
    }

    return decorator
}

/**
 * createPropertyDecorator
 * 创建属性装饰器方法
 * @param callback
 */
export function createPropertyDecorator<T = any>(callback: PropertyDecoratorCallback) {
    function decorator(target: any, propertyKey: string | symbol): void;
    function decorator(arg: T): PropertyDecorator;
    function decorator(...args: any[]): any {
        if (args.length === 1) {
            return (target: any, propertyKey: string | symbol): void => {
                const options: ControllerOptions = target.$options || {}
                if (!options.propertys) options.propertys = {}
                const { propertys } = options
                propertys[propertyKey as string] = {
                    handler: callback,
                    arg: args[0]
                }
                target.$options = options
            }
        } else {
            const [target, propertyKey] = args
            const options: ControllerOptions = target.$options || {}
            if (!options.propertys) options.propertys = {}
            const { propertys } = options
            propertys[propertyKey as string] = {
                handler: callback
            }
            target.$options = options
        }
    }
    return decorator
}

/**
 * createPropertyAndParameterDecorator
 * 创建同时能兼容参数装饰器和属性装饰器方法
 * @param callback
 */
export function createPropertyAndParameterDecorator<T = any>(callback: ParameterDecoratorCallback | PropertyDecoratorCallback) {
    function decorator(target: any, propertyKey: string, parameterIndex: number): void;
    function decorator(target: any, propertyKey: string | symbol): void;
    function decorator(arg: T): ParameterDecorator;
    function decorator(...args: any[]): any {
        if (args.length === 1) {
            function fn(target: any, propertyKey: string, parameterIndex: number): void;
            function fn(target: any, propertyKey: string | symbol): void;
            function fn(...ags: any[]): any {
                const [target, propertyKey, parameterIndex] = ags
                handler({
                    target,
                    propertyKey,
                    parameterIndex,
                    args: args[0]
                })
            }
            return fn
        } else {
            const [target, propertyKey, parameterIndex] = args
            handler({
                target,
                propertyKey,
                parameterIndex
            })
        }

        function handler(options: {
            target: any,
            propertyKey: string | symbol,
            parameterIndex: number
            args?: any
        }) {
            const { target, propertyKey, parameterIndex, args} = options
            // If the parameterIndex is an number, it is a parameter decorator, otherwise it is an property decorator.
            const opts: ControllerOptions = target.$options || {}
            if (typeof parameterIndex !== 'number' ) {
                if (!opts.propertys) {
                    opts.propertys = {}
                    opts.propertys[propertyKey as string] = {
                        arg: args,
                        handler: callback
                    }
                } else {
                    opts.propertys[propertyKey as string] = {
                        arg: args,
                        handler: callback
                    }
                }
            } else {
                if (!opts.parameters) {
                    opts.parameters = {}
                    opts.parameters[propertyKey as string] = []
                    opts.parameters[propertyKey as string][parameterIndex] = {
                        arg: args,
                        handler: callback
                    }
                } else {
                    if (Array.isArray(opts.parameters[propertyKey as string])) {
                        opts.parameters[propertyKey as string][parameterIndex] = {
                            arg: args,
                            handler: callback
                        }
                    } else {
                        opts.parameters[propertyKey as string] = []
                        opts.parameters[propertyKey as string][parameterIndex] = {
                            arg: args,
                            handler: callback
                        }
                    }
                }
            }
            target.$options = opts
        }
    }
    return decorator
}

/**
 * createMethodDecorator
 * 创建方法装饰器
 * @param callback
 */
export function createMethodDecorator<T = any>(callback: MethodDecoratorCallback) {
    function decorator(target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void;
    function decorator(arg: T): MethodDecorator;
    function decorator(...args: any[]): any {
        if (args.length === 1) {
            return (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> | void => {
                const options: ControllerOptions = target.$options || {}
                if (!options.methods) options.methods = {}
                options.methods[propertyKey as string] = {
                    handler: callback,
                    options: {
                        target,
                        propertyKey,
                        descriptor,
                        arg: args[0]
                    }
                }
                target.$options = options
            }
        } else {
            const [ target, propertyKey, descriptor ] = args;
            const options: ControllerOptions = target.$options || {}
                if (!options.methods) options.methods = {}
                options.methods[propertyKey] = {
                    handler: callback,
                    options: {
                        target,
                        propertyKey,
                        descriptor
                    }
                }
                target.$options = options
        }
    }
    return decorator
}