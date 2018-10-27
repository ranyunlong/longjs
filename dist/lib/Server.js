"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class Server
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-08 14:35
 * @export Server
 */
const core_1 = require("@longjs/core");
const StaticServe_1 = require("./StaticServe");
const https = require("https");
class Server {
    constructor(options) {
        this.options = options;
        if (!Array.isArray(options.controllers))
            return;
        this.controllers = options.controllers;
        const configs = options.configs = options.configs || {};
        // Create static serve
        if (configs.staticServeOpts)
            this.staticServe = new StaticServe_1.StaticServe(configs.staticServeOpts);
        let { handleResponse } = this;
        // Init Core
        this.app = new core_1.default({ configs: options.configs });
        const { app } = this;
        app.handleResponse(handleResponse.bind(this));
        // Assert is port
        if (options.port) {
            this.listen(options.port);
        }
        // Assert is env
        if (options.env) {
            this.env = options.env;
        }
        // Assert is keys
        if (options.keys) {
            this.keys = options.keys;
        }
        // Assert is proxy
        if (options.proxy) {
            this.proxy = options.proxy;
        }
    }
    // Get core env
    get env() {
        return this.app.env;
    }
    // Set core env
    set env(env) {
        this.app.env = env;
    }
    // Set core subdomainOffset
    set subdomainOffset(offset) {
        this.app.subdomainOffset = offset;
    }
    // Get core subdomainOffset
    get subdomainOffset() {
        return this.app.subdomainOffset;
    }
    // Get core proxy state
    get proxy() {
        return this.app.proxy;
    }
    // Set core proxy state
    set proxy(proxy) {
        this.app.proxy = proxy;
    }
    // Get core keys
    get keys() {
        return this.app.keys;
    }
    // Set core keys
    set keys(keys) {
        this.app.keys = keys;
    }
    /**
     * http/https listen port
     * @param { Number } port
     */
    listen(port) {
        if (this.listend)
            return;
        // listen https
        if (this.options.https) {
            https
                .createServer(this.options.https, this.app.callback())
                .listen(port || 3000);
            this.listend = true;
        }
        else { // http
            this.app.listen(port || 3000);
            this.listend = true;
        }
    }
    /**
     * handleResponse
     * @param { Server.Context } ctx
     */
    async handleResponse(ctx) {
        // Static responses
        if (this.staticServe) {
            await this.staticServe.handler(ctx);
        }
        if (!ctx.finished) {
            ctx.routes = [];
            // Handler routes
            this.controllers.forEach((Controller) => {
                Controller.$options.match(ctx);
            });
            // New Controller
            for (let item of ctx.controllers) {
                // Register services
                const { injectServices, injectPropertys, injectDatabases } = item.target.$options;
                const { configs } = this.options;
                injectDatabases(configs.database);
                const services = injectServices(ctx, configs);
                injectPropertys(ctx);
                item.controller = new item.target(...services);
                for (let handler of item.handlers) {
                    const { injectParameters } = item.target.$options;
                    const parameters = injectParameters(ctx, handler.propertyKey);
                    let data = await item.controller[handler.propertyKey](...parameters);
                    if (data) {
                        ctx.status = 200;
                        ctx.body = data;
                    }
                }
            }
        }
        // Static responses
        if (!ctx.finished) {
            if (this.staticServe) {
                await this.staticServe.deferHandler(ctx);
            }
        }
    }
}
exports.Server = Server;
