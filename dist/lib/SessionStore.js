"use strict";
/**
 * @class SessionStorage
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-10-13 11:15
 */
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
class SessionStorage {
    constructor() {
        this.sessions = new Map();
        this.__timer = new Map();
    }
    getID(length) {
        return crypto_1.randomBytes(length).toString('hex');
    }
    async get(sid) {
        if (!this.sessions.has(sid))
            return undefined;
        // We are decoding data coming from our Store, so, we assume it was sanitized before storing
        return {
            sid,
            ...JSON.parse(this.sessions.get(sid))
        };
    }
    async set(session, { sid = this.getID(24), maxAge } = {}) {
        // Just a demo how to use maxAge and some cleanup
        if (this.sessions.has(sid) && this.__timer.has(sid)) {
            const __timeout = this.__timer.get(sid);
            if (__timeout)
                clearTimeout(__timeout);
        }
        if (maxAge) {
            this.__timer.set(sid, setTimeout(() => this.destroy(sid), maxAge));
        }
        try {
            this.sessions.set(sid, JSON.stringify(session));
        }
        catch (err) {
            console.log('Set session error:', err);
        }
        return sid;
    }
    async destroy(sid) {
        this.sessions.delete(sid);
        this.__timer.delete(sid);
    }
}
exports.SessionStorage = SessionStorage;