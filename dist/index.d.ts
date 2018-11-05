/**
 * @class Server
 * @author ranyunlong<549510622@qq.com>
 * @license MIT
 * @copyright Ranyunlong 2018-09-21 0:07
 * @export Server
 */
/// <reference types="node" />
import * as httpAssert from 'http-assert';
import * as EventEmitter from 'events';
import * as Keygrip from 'keygrip';
import * as Cookies from 'cookies';
import { Socket } from 'net';
import { ListenOptions } from 'net';
import { IncomingMessage, ServerResponse, OutgoingHttpHeaders, IncomingHttpHeaders } from 'http';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';
import { Plugins } from './lib/Plugin';
export default class Server extends EventEmitter {
    options: Core.Options;
    proxy: boolean;
    subdomainOffset: number;
    env: Core.Env;
    silent: boolean;
    keys: Keygrip | string[];
    /**
     * constructor
     */
    constructor(options?: Core.Options);
    /**
     * callback
     * Handler custom http proccess
     */
    callback(): (request: IncomingMessage | Http2ServerRequest, response: ServerResponse | Http2ServerResponse) => void;
    /**
     * listen
     * Http listen method
     */
    listen(port?: number, hostname?: string, backlog?: number, listeningListener?: () => void): this;
    listen(port: number, hostname?: string, listeningListener?: () => void): this;
    listen(port: number, backlog?: number, listeningListener?: () => void): this;
    listen(port: number, listeningListener?: () => void): this;
    listen(path: string, backlog?: number, listeningListener?: () => void): this;
    listen(path: string, listeningListener?: () => void): this;
    listen(options: ListenOptions, listeningListener?: () => void): this;
    listen(handle: any, backlog?: number, listeningListener?: () => void): this;
    listen(handle: any, listeningListener?: () => void): this;
    private handleResponse;
    getPluginID(pluginConstructor: {
        new (...args: any[]): any;
    }): string;
    /**
     * start
     * Application start method
     */
    private start;
    /**
     * respond
     * Application respond
     */
    private respond;
    /**
     * exception
     * Exception handler method
     */
    private exception;
    /**
     * createContext
     * Server context create method
     */
    protected createContext(req: IncomingMessage | Http2ServerRequest, res: ServerResponse | Http2ServerResponse): Core.Context;
}
export * from './lib/Decorators';
export * from './lib/Plugin';
export * from './lib/HttpException';
export declare namespace Core {
    interface HttpException {
        statusCode?: number;
        message?: string;
        data?: any;
    }
    interface HttpExceptionConstructor extends HttpException {
        new (error: HttpException): HttpException;
    }
    interface HttpHandler {
        (ctx?: Context): Promise<any>;
    }
    interface Configs {
        [key: string]: any;
    }
    interface Options {
        port?: number;
        host?: string;
        configs?: Configs;
        pluginConfigs?: Configs;
        keys?: Keygrip | string[];
        env?: Env;
        proxy?: boolean;
        subdomainOffset?: number;
        silent?: boolean;
        plugins?: Plugins;
        controllers?: Array<{
            new (...args: any[]): any;
        }>;
        routeStrict?: boolean;
    }
    interface BaseContext extends ContextDelegatedRequest, ContextDelegatedResponse {
        /**
         * Similar to .throw(), adds assertion.
         *
         *    this.assert(this.user, 401, 'Please login!');
         *
         * See: https://github.com/jshttp/http-assert
         */
        assert: typeof httpAssert;
        /**
         * Throw an error with `msg` and optional `status`
         * defaulting to 500. Note that these are user-level
         * errors, and the message may be exposed to the client.
         *
         *    this.throw(403)
         *    this.throw('name required', 400)
         *    this.throw(400, 'name required')
         *    this.throw('something exploded')
         *    this.throw(new Error('invalid'), 400);
         *    this.throw(400, new Error('invalid'));
         *
         * See: https://github.com/jshttp/http-errors
         */
        throw(message: string, code?: number, properties?: {}): never;
        throw(status: number): never;
        throw(...properties: Array<number | string | {}>): never;
    }
    interface BaseRequest extends ContextDelegatedRequest {
        /**
         * Get the charset when present or undefined.
         */
        charset: string;
        /**
         * Return parsed Content-Length when present.
         */
        length: number;
        /**
         * Return the request mime type void of
         * parameters such as "charset".
         */
        type: string;
        /**
         * Is
         */
        is(...types: string[]): string | false;
    }
    interface BaseResponse extends ContextDelegatedResponse {
        /**
         * Return the request socket.
         *
         * @return {Connection}
         * @api public
         */
        socket: Socket;
        /**
         * Return response header.
         */
        header: OutgoingHttpHeaders;
        /**
         * Return response header, alias as response.header
         */
        headers: OutgoingHttpHeaders;
        /**
         * Check whether the response is one of the listed types.
         * Pretty much the same as `this.request.is()`.
         *
         * @param {String|Array} types...
         * @return {String|false}
         * @api public
         */
        is(...types: string[]): string | false;
        is(type: string): string | false;
        /**
         * Return response header.
         *
         * Examples:
         *
         *     this.get('Content-Type');
         *     // => "text/plain"
         *
         *     this.get('content-type');
         *     // => "text/plain"
         */
        get(field: string): string | number | string[];
    }
    interface Request extends BaseRequest {
        app: Server;
        req: IncomingMessage | Http2ServerRequest;
        res: ServerResponse | Http2ServerResponse;
        ctx: Context;
        body: any;
        files: any;
        response: Response;
        originalUrl: string;
        ip: string;
    }
    interface Response extends BaseResponse {
        app: Server;
        req: IncomingMessage | Http2ServerRequest;
        res: ServerResponse | Http2ServerResponse;
        ctx: Context;
        request: Request;
    }
    interface Context extends BaseContext {
        app: Server;
        request: Request;
        response: Response;
        req: IncomingMessage | Http2ServerRequest;
        res: ServerResponse | Http2ServerResponse;
        originalUrl: string;
        cookies: Cookies;
        files: any;
        session?: Session;
        _session?: string;
        /**
         * To bypass Koa's built-in response handling, you may explicitly set `ctx.respond = false;`
         */
        respond?: boolean;
        [key: string]: any;
    }
    interface Session {
        refresh?(): void;
        sid: string;
        old?: string;
        [key: string]: any;
    }
    interface ContextDelegatedRequest {
        /**
         * Return request header.
         */
        header: IncomingHttpHeaders;
        /**
         * Return request header, alias as request.header
         */
        headers: IncomingHttpHeaders;
        /**
         * Get/Set request URL.
         */
        url: string;
        /**
         * Get origin of URL.
         */
        origin: string;
        /**
         * Get full request URL.
         */
        href: string;
        /**
         * Get/Set request method.
         */
        method: string;
        /**
         * Get request pathname.
         * Set pathname, retaining the query-string when present.
         */
        path: string;
        /**
         * Get parsed query-string.
         * Set query-string as an object.
         */
        query: any;
        /**
         * Get/Set query string.
         */
        querystring: string;
        /**
         * Get the search string. Same as the querystring
         * except it includes the leading ?.
         *
         * Set the search string. Same as
         * response.querystring= but included for ubiquity.
         */
        search: string;
        /**
         * Parse the "Host" header field host
         * and support X-Forwarded-Host when a
         * proxy is enabled.
         */
        host: string;
        /**
         * Parse the "Host" header field hostname
         * and support X-Forwarded-Host when a
         * proxy is enabled.
         */
        hostname: string;
        /**
         * Get WHATWG parsed URL object.
         */
        URL?: URL;
        /**
         * Check if the request is fresh, aka
         * Last-Modified and/or the ETag
         * still match.
         */
        fresh: boolean;
        /**
         * Check if the request is stale, aka
         * "Last-Modified" and / or the "ETag" for the
         * resource has changed.
         */
        stale: boolean;
        /**
         * Check if the request is idempotent.
         */
        idempotent: boolean;
        /**
         * Return the request socket.
         */
        socket: Socket;
        /**
         * Return the protocol string "http" or "https"
         * when requested with TLS. When the proxy setting
         * is enabled the "X-Forwarded-Proto" header
         * field will be trusted. If you're running behind
         * a reverse proxy that supplies https for you this
         * may be enabled.
         */
        protocol: string;
        /**
         * Short-hand for:
         *
         *    this.protocol == 'https'
         */
        secure: boolean;
        /**
         * Request remote address. Supports X-Forwarded-For when app.proxy is true.
         */
        ip: string;
        /**
         * Request params
         */
        params: any;
        /**
         * When `app.proxy` is `true`, parse
         * the "X-Forwarded-For" ip address list.
         *
         * For example if the value were "client, proxy1, proxy2"
         * you would receive the array `["client", "proxy1", "proxy2"]`
         * where "proxy2" is the furthest down-stream.
         */
        ips: string[];
        /**
         * Return subdomains as an array.
         *
         * Subdomains are the dot-separated parts of the host before the main domain
         * of the app. By default, the domain of the app is assumed to be the last two
         * parts of the host. This can be changed by setting `app.subdomainOffset`.
         *
         * For example, if the domain is "tobi.ferrets.example.com":
         * If `app.subdomainOffset` is not set, this.subdomains is
         * `["ferrets", "tobi"]`.
         * If `app.subdomainOffset` is 3, this.subdomains is `["tobi"]`.
         */
        subdomains: string[];
        accept: any;
        /**
         * Get
         */
        get(field: string): string | number | string[];
        /**
         * accepts
         */
        accepts(args: string | string[]): string[] | string | false;
        accepts(...args: string[]): string[] | string | false;
        /**
         * acceptsLanguages
         */
        acceptsLanguages(args: string | string[]): string | false;
        acceptsLanguages(...args: string[]): string | false;
        /**
         * acceptsLanguages
         */
        acceptsCharsets(args: string | string[]): string | false;
        acceptsCharsets(...args: string[]): string | false;
        /**
         * acceptsLanguages
         */
        acceptsEncodings(args: string | string[]): string | false;
        acceptsEncodings(...args: string[]): string | false;
    }
    interface ContextDelegatedResponse {
        /**
         * Response finished
         */
        finished: boolean;
        /**
         * Get/Set response status code.
         */
        status: number;
        /**
         * Get response status message
         */
        message: string;
        /**
         * Get/Set response body.
         */
        body: any;
        /**
         * Return parsed response Content-Length when present.
         * Set Content-Length field to `n`.
         */
        length: number;
        /**
         * Check if a header has been written to the socket.
         */
        headerSent: boolean;
        /**
         * Vary on `field`.
         */
        vary(field: string): void;
        /**
         * Perform a 302 redirect to `url`.
         *
         * The string "back" is special-cased
         * to provide Referrer support, when Referrer
         * is not present `alt` or "/" is used.
         *
         * Examples:
         *
         *    this.redirect('back');
         *    this.redirect('back', '/index.html');
         *    this.redirect('/login');
         *    this.redirect('http://google.com');
         */
        redirect(url: string, alt?: string): void;
        /**
         * Set Content-Disposition header to "attachment" with optional `filename`.
         */
        attachment(filename: string): void;
        /**
         * Return the response mime type void of
         * parameters such as "charset".
         *
         * Set Content-Type response header with `type` through `mime.lookup()`
         * when it does not contain a charset.
         *
         * Examples:
         *
         *     this.type = '.html';
         *     this.type = 'html';
         *     this.type = 'json';
         *     this.type = 'application/json';
         *     this.type = 'png';
         */
        type: string;
        /**
         * Get the Last-Modified date in Date form, if it exists.
         * Set the Last-Modified date using a string or a Date.
         *
         *     this.response.lastModified = new Date();
         *     this.response.lastModified = '2013-09-13';
         */
        lastModified: Date;
        /**
         * Get/Set the ETag of a response.
         * This will normalize the quotes if necessary.
         *
         *     this.response.etag = 'md5hashsum';
         *     this.response.etag = '"md5hashsum"';
         *     this.response.etag = 'W/"123456789"';
         *
         * @param {String} etag
         * @api public
         */
        etag: string;
        /**
         * Set header `field` to `val`, or pass
         * an object of header fields.
         *
         * Examples:
         *
         *    this.set('Foo', ['bar', 'baz']);
         *    this.set('Accept', 'application/json');
         *    this.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
         */
        set(field: {
            [key: string]: string;
        }): void;
        set(field: string, val: string | string[]): void;
        /**
         * Append additional header `field` with value `val`.
         *
         * Examples:
         *
         * ```
         * this.append('Link', ['<http://localhost/>', '<http://localhost:3000/>']);
         * this.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly');
         * this.append('Warning', '199 Miscellaneous warning');
         * ```
         */
        append(field: string, val: string | string[]): void;
        /**
         * Remove header `field`.
         */
        remove(field: string): void;
        /**
         * Checks if the request is writable.
         * Tests for the existence of the socket
         * as node sometimes does not set it.
         */
        writable: boolean;
        /**
         * Flush any set headers, and begin the body
         */
        flushHeaders(): void;
    }
    type Env = 'development' | 'production';
    interface Hook {
        (ctx?: Context): Promise<any>;
    }
    interface Messages<S = string> {
        alpha?: string;
        alphanumeric?: string;
        ascii?: string;
        base64?: string;
        boolean?: string;
        byteLength?: string;
        creditCard?: string;
        dataURI?: string;
        magnetURI?: string;
        decimal?: string;
        email?: string;
        float?: string;
        hash?: string;
        hexColor?: string;
        hexadecimal?: string;
        identityCard?: string;
        ip?: string;
        ipRange?: string;
        ISBN?: string;
        ISSN?: string;
        ISIN?: string;
        ISO8601?: string;
        RFC3339?: string;
        ISO31661Alpha?: string;
        ISRC?: string;
        in?: string;
        int?: string;
        json?: string;
        jwt?: string;
        latLong?: string;
        length?: string;
        lowercase?: string;
        macAddress?: string;
        md5?: string;
        mimeType?: string;
        mobilePhone?: string;
        multibyte?: string;
        numeric?: string;
        port?: string;
        postalCode?: string;
        url?: string;
        uuid?: string;
        uppercase?: string;
        required?: string;
        validator?: string;
    }
    type MimeDbTypes = 'application/1d-interleaved-parityfec' | 'application/3gpdash-qoe-report+xml' | 'application/3gpp-ims+xml' | 'application/a2l' | 'application/activemessage' | 'application/activity+json' | 'application/alto-costmap+json' | 'application/alto-costmapfilter+json' | 'application/alto-directory+json' | 'application/alto-endpointcost+json' | 'application/alto-endpointcostparams+json' | 'application/alto-endpointprop+json' | 'application/alto-endpointpropparams+json' | 'application/alto-error+json' | 'application/alto-networkmap+json' | 'application/alto-networkmapfilter+json' | 'application/aml' | 'application/andrew-inset' | 'application/applefile' | 'application/applixware' | 'application/atf' | 'application/atfx' | 'application/atom+xml' | 'application/atomcat+xml' | 'application/atomdeleted+xml' | 'application/atomicmail' | 'application/atomsvc+xml' | 'application/atxml' | 'application/auth-policy+xml' | 'application/bacnet-xdd+zip' | 'application/batch-smtp' | 'application/bdoc' | 'application/beep+xml' | 'application/calendar+json' | 'application/calendar+xml' | 'application/call-completion' | 'application/cals-1840' | 'application/cbor' | 'application/cccex' | 'application/ccmp+xml' | 'application/ccxml+xml' | 'application/cdfx+xml' | 'application/cdmi-capability' | 'application/cdmi-container' | 'application/cdmi-domain' | 'application/cdmi-object' | 'application/cdmi-queue' | 'application/cdni' | 'application/cea' | 'application/cea-2018+xml' | 'application/cellml+xml' | 'application/cfw' | 'application/clue_info+xml' | 'application/cms' | 'application/cnrp+xml' | 'application/coap-group+json' | 'application/coap-payload' | 'application/commonground' | 'application/conference-info+xml' | 'application/cose' | 'application/cose-key' | 'application/cose-key-set' | 'application/cpl+xml' | 'application/csrattrs' | 'application/csta+xml' | 'application/cstadata+xml' | 'application/csvm+json' | 'application/cu-seeme' | 'application/cwt' | 'application/cybercash' | 'application/dart' | 'application/dash+xml' | 'application/dashdelta' | 'application/davmount+xml' | 'application/dca-rft' | 'application/dcd' | 'application/dec-dx' | 'application/dialog-info+xml' | 'application/dicom' | 'application/dicom+json' | 'application/dicom+xml' | 'application/dii' | 'application/dit' | 'application/dns' | 'application/dns+json' | 'application/dns-message' | 'application/docbook+xml' | 'application/dskpp+xml' | 'application/dssc+der' | 'application/dssc+xml' | 'application/dvcs' | 'application/ecmascript' | 'application/edi-consent' | 'application/edi-x12' | 'application/edifact' | 'application/efi' | 'application/emergencycalldata.comment+xml' | 'application/emergencycalldata.control+xml' | 'application/emergencycalldata.deviceinfo+xml' | 'application/emergencycalldata.ecall.msd' | 'application/emergencycalldata.providerinfo+xml' | 'application/emergencycalldata.serviceinfo+xml' | 'application/emergencycalldata.subscriberinfo+xml' | 'application/emergencycalldata.veds+xml' | 'application/emma+xml' | 'application/emotionml+xml' | 'application/encaprtp' | 'application/epp+xml' | 'application/epub+zip' | 'application/eshop' | 'application/exi' | 'application/fastinfoset' | 'application/fastsoap' | 'application/fdt+xml' | 'application/fhir+json' | 'application/fhir+xml' | 'application/fido.trusted-apps+json' | 'application/fits' | 'application/font-sfnt' | 'application/font-tdpfr' | 'application/font-woff' | 'application/framework-attributes+xml' | 'application/geo+json' | 'application/geo+json-seq' | 'application/geopackage+sqlite3' | 'application/geoxacml+xml' | 'application/gltf-buffer' | 'application/gml+xml' | 'application/gpx+xml' | 'application/gxf' | 'application/gzip' | 'application/h224' | 'application/held+xml' | 'application/hjson' | 'application/http' | 'application/hyperstudio' | 'application/ibe-key-request+xml' | 'application/ibe-pkg-reply+xml' | 'application/ibe-pp-data' | 'application/iges' | 'application/im-iscomposing+xml' | 'application/index' | 'application/index.cmd' | 'application/index.obj' | 'application/index.response' | 'application/index.vnd' | 'application/inkml+xml' | 'application/iotp' | 'application/ipfix' | 'application/ipp' | 'application/isup' | 'application/its+xml' | 'application/java-archive' | 'application/java-serialized-object' | 'application/java-vm' | 'application/javascript' | 'application/jf2feed+json' | 'application/jose' | 'application/jose+json' | 'application/jrd+json' | 'application/json' | 'application/json-patch+json' | 'application/json-seq' | 'application/json5' | 'application/jsonml+json' | 'application/jwk+json' | 'application/jwk-set+json' | 'application/jwt' | 'application/kpml-request+xml' | 'application/kpml-response+xml' | 'application/ld+json' | 'application/lgr+xml' | 'application/link-format' | 'application/load-control+xml' | 'application/lost+xml' | 'application/lostsync+xml' | 'application/lxf' | 'application/mac-binhex40' | 'application/mac-compactpro' | 'application/macwriteii' | 'application/mads+xml' | 'application/manifest+json' | 'application/marc' | 'application/marcxml+xml' | 'application/mathematica' | 'application/mathml+xml' | 'application/mathml-content+xml' | 'application/mathml-presentation+xml' | 'application/mbms-associated-procedure-description+xml' | 'application/mbms-deregister+xml' | 'application/mbms-envelope+xml' | 'application/mbms-msk+xml' | 'application/mbms-msk-response+xml' | 'application/mbms-protection-description+xml' | 'application/mbms-reception-report+xml' | 'application/mbms-register+xml' | 'application/mbms-register-response+xml' | 'application/mbms-schedule+xml' | 'application/mbms-user-service-description+xml' | 'application/mbox' | 'application/media-policy-dataset+xml' | 'application/media_control+xml' | 'application/mediaservercontrol+xml' | 'application/merge-patch+json' | 'application/metalink+xml' | 'application/metalink4+xml' | 'application/mets+xml' | 'application/mf4' | 'application/mikey' | 'application/mmt-usd+xml' | 'application/mods+xml' | 'application/moss-keys' | 'application/moss-signature' | 'application/mosskey-data' | 'application/mosskey-request' | 'application/mp21' | 'application/mp4' | 'application/mpeg4-generic' | 'application/mpeg4-iod' | 'application/mpeg4-iod-xmt' | 'application/mrb-consumer+xml' | 'application/mrb-publish+xml' | 'application/msc-ivr+xml' | 'application/msc-mixer+xml' | 'application/msword' | 'application/mud+json' | 'application/mxf' | 'application/n-quads' | 'application/n-triples' | 'application/nasdata' | 'application/news-checkgroups' | 'application/news-groupinfo' | 'application/news-transmission' | 'application/nlsml+xml' | 'application/node' | 'application/nss' | 'application/ocsp-request' | 'application/ocsp-response' | 'application/octet-stream' | 'application/oda' | 'application/odx' | 'application/oebps-package+xml' | 'application/ogg' | 'application/omdoc+xml' | 'application/onenote' | 'application/oxps' | 'application/p2p-overlay+xml' | 'application/parityfec' | 'application/passport' | 'application/patch-ops-error+xml' | 'application/pdf' | 'application/pdx' | 'application/pgp-encrypted' | 'application/pgp-keys' | 'application/pgp-signature' | 'application/pics-rules' | 'application/pidf+xml' | 'application/pidf-diff+xml' | 'application/pkcs10' | 'application/pkcs12' | 'application/pkcs7-mime' | 'application/pkcs7-signature' | 'application/pkcs8' | 'application/pkcs8-encrypted' | 'application/pkix-attr-cert' | 'application/pkix-cert' | 'application/pkix-crl' | 'application/pkix-pkipath' | 'application/pkixcmp' | 'application/pls+xml' | 'application/poc-settings+xml' | 'application/postscript' | 'application/ppsp-tracker+json' | 'application/problem+json' | 'application/problem+xml' | 'application/provenance+xml' | 'application/prs.alvestrand.titrax-sheet' | 'application/prs.cww' | 'application/prs.hpub+zip' | 'application/prs.nprend' | 'application/prs.plucker' | 'application/prs.rdf-xml-crypt' | 'application/prs.xsf+xml' | 'application/pskc+xml' | 'application/qsig' | 'application/raml+yaml' | 'application/raptorfec' | 'application/rdap+json' | 'application/rdf+xml' | 'application/reginfo+xml' | 'application/relax-ng-compact-syntax' | 'application/remote-printing' | 'application/reputon+json' | 'application/resource-lists+xml' | 'application/resource-lists-diff+xml' | 'application/rfc+xml' | 'application/riscos' | 'application/rlmi+xml' | 'application/rls-services+xml' | 'application/route-apd+xml' | 'application/route-s-tsid+xml' | 'application/route-usd+xml' | 'application/rpki-ghostbusters' | 'application/rpki-manifest' | 'application/rpki-publication' | 'application/rpki-roa' | 'application/rpki-updown' | 'application/rsd+xml' | 'application/rss+xml' | 'application/rtf' | 'application/rtploopback' | 'application/rtx' | 'application/samlassertion+xml' | 'application/samlmetadata+xml' | 'application/sbml+xml' | 'application/scaip+xml' | 'application/scim+json' | 'application/scvp-cv-request' | 'application/scvp-cv-response' | 'application/scvp-vp-request' | 'application/scvp-vp-response' | 'application/sdp' | 'application/secevent+jwt' | 'application/senml+cbor' | 'application/senml+json' | 'application/senml+xml' | 'application/senml-exi' | 'application/sensml+cbor' | 'application/sensml+json' | 'application/sensml+xml' | 'application/sensml-exi' | 'application/sep+xml' | 'application/sep-exi' | 'application/session-info' | 'application/set-payment' | 'application/set-payment-initiation' | 'application/set-registration' | 'application/set-registration-initiation' | 'application/sgml' | 'application/sgml-open-catalog' | 'application/shf+xml' | 'application/sieve' | 'application/simple-filter+xml' | 'application/simple-message-summary' | 'application/simplesymbolcontainer' | 'application/slate' | 'application/smil' | 'application/smil+xml' | 'application/smpte336m' | 'application/soap+fastinfoset' | 'application/soap+xml' | 'application/sparql-query' | 'application/sparql-results+xml' | 'application/spirits-event+xml' | 'application/sql' | 'application/srgs' | 'application/srgs+xml' | 'application/sru+xml' | 'application/ssdl+xml' | 'application/ssml+xml' | 'application/stix+json' | 'application/tamp-apex-update' | 'application/tamp-apex-update-confirm' | 'application/tamp-community-update' | 'application/tamp-community-update-confirm' | 'application/tamp-error' | 'application/tamp-sequence-adjust' | 'application/tamp-sequence-adjust-confirm' | 'application/tamp-status-query' | 'application/tamp-status-response' | 'application/tamp-update' | 'application/tamp-update-confirm' | 'application/tar' | 'application/taxii+json' | 'application/tei+xml' | 'application/thraud+xml' | 'application/timestamp-query' | 'application/timestamp-reply' | 'application/timestamped-data' | 'application/tlsrpt+gzip' | 'application/tlsrpt+json' | 'application/tnauthlist' | 'application/trickle-ice-sdpfrag' | 'application/trig' | 'application/ttml+xml' | 'application/tve-trigger' | 'application/ulpfec' | 'application/urc-grpsheet+xml' | 'application/urc-ressheet+xml' | 'application/urc-targetdesc+xml' | 'application/urc-uisocketdesc+xml' | 'application/vcard+json' | 'application/vcard+xml' | 'application/vemmi' | 'application/vividence.scriptfile' | 'application/vnd.1000minds.decision-model+xml' | 'application/vnd.3gpp-prose+xml' | 'application/vnd.3gpp-prose-pc3ch+xml' | 'application/vnd.3gpp-v2x-local-service-information' | 'application/vnd.3gpp.access-transfer-events+xml' | 'application/vnd.3gpp.bsf+xml' | 'application/vnd.3gpp.gmop+xml' | 'application/vnd.3gpp.mc-signalling-ear' | 'application/vnd.3gpp.mcdata-payload' | 'application/vnd.3gpp.mcdata-signalling' | 'application/vnd.3gpp.mcptt-affiliation-command+xml' | 'application/vnd.3gpp.mcptt-floor-request+xml' | 'application/vnd.3gpp.mcptt-info+xml' | 'application/vnd.3gpp.mcptt-location-info+xml' | 'application/vnd.3gpp.mcptt-mbms-usage-info+xml' | 'application/vnd.3gpp.mcptt-signed+xml' | 'application/vnd.3gpp.mid-call+xml' | 'application/vnd.3gpp.pic-bw-large' | 'application/vnd.3gpp.pic-bw-small' | 'application/vnd.3gpp.pic-bw-var' | 'application/vnd.3gpp.sms' | 'application/vnd.3gpp.sms+xml' | 'application/vnd.3gpp.srvcc-ext+xml' | 'application/vnd.3gpp.srvcc-info+xml' | 'application/vnd.3gpp.state-and-event-info+xml' | 'application/vnd.3gpp.ussd+xml' | 'application/vnd.3gpp2.bcmcsinfo+xml' | 'application/vnd.3gpp2.sms' | 'application/vnd.3gpp2.tcap' | 'application/vnd.3lightssoftware.imagescal' | 'application/vnd.3m.post-it-notes' | 'application/vnd.accpac.simply.aso' | 'application/vnd.accpac.simply.imp' | 'application/vnd.acucobol' | 'application/vnd.acucorp' | 'application/vnd.adobe.air-application-installer-package+zip' | 'application/vnd.adobe.flash.movie' | 'application/vnd.adobe.formscentral.fcdt' | 'application/vnd.adobe.fxp' | 'application/vnd.adobe.partial-upload' | 'application/vnd.adobe.xdp+xml' | 'application/vnd.adobe.xfdf' | 'application/vnd.aether.imp' | 'application/vnd.afpc.afplinedata' | 'application/vnd.afpc.modca' | 'application/vnd.ah-barcode' | 'application/vnd.ahead.space' | 'application/vnd.airzip.filesecure.azf' | 'application/vnd.airzip.filesecure.azs' | 'application/vnd.amadeus+json' | 'application/vnd.amazon.ebook' | 'application/vnd.amazon.mobi8-ebook' | 'application/vnd.americandynamics.acc' | 'application/vnd.amiga.ami' | 'application/vnd.amundsen.maze+xml' | 'application/vnd.android.package-archive' | 'application/vnd.anki' | 'application/vnd.anser-web-certificate-issue-initiation' | 'application/vnd.anser-web-funds-transfer-initiation' | 'application/vnd.antix.game-component' | 'application/vnd.apache.thrift.binary' | 'application/vnd.apache.thrift.compact' | 'application/vnd.apache.thrift.json' | 'application/vnd.api+json' | 'application/vnd.apothekende.reservation+json' | 'application/vnd.apple.installer+xml' | 'application/vnd.apple.keynote' | 'application/vnd.apple.mpegurl' | 'application/vnd.apple.numbers' | 'application/vnd.apple.pages' | 'application/vnd.apple.pkpass' | 'application/vnd.arastra.swi' | 'application/vnd.aristanetworks.swi' | 'application/vnd.artisan+json' | 'application/vnd.artsquare' | 'application/vnd.astraea-software.iota' | 'application/vnd.audiograph' | 'application/vnd.autopackage' | 'application/vnd.avalon+json' | 'application/vnd.avistar+xml' | 'application/vnd.balsamiq.bmml+xml' | 'application/vnd.balsamiq.bmpr' | 'application/vnd.banana-accounting' | 'application/vnd.bbf.usp.msg' | 'application/vnd.bbf.usp.msg+json' | 'application/vnd.bekitzur-stech+json' | 'application/vnd.bint.med-content' | 'application/vnd.biopax.rdf+xml' | 'application/vnd.blink-idb-value-wrapper' | 'application/vnd.blueice.multipass' | 'application/vnd.bluetooth.ep.oob' | 'application/vnd.bluetooth.le.oob' | 'application/vnd.bmi' | 'application/vnd.businessobjects' | 'application/vnd.byu.uapi+json' | 'application/vnd.cab-jscript' | 'application/vnd.canon-cpdl' | 'application/vnd.canon-lips' | 'application/vnd.capasystems-pg+json' | 'application/vnd.cendio.thinlinc.clientconf' | 'application/vnd.century-systems.tcp_stream' | 'application/vnd.chemdraw+xml' | 'application/vnd.chess-pgn' | 'application/vnd.chipnuts.karaoke-mmd' | 'application/vnd.cinderella' | 'application/vnd.cirpack.isdn-ext' | 'application/vnd.citationstyles.style+xml' | 'application/vnd.claymore' | 'application/vnd.cloanto.rp9' | 'application/vnd.clonk.c4group' | 'application/vnd.cluetrust.cartomobile-config' | 'application/vnd.cluetrust.cartomobile-config-pkg' | 'application/vnd.coffeescript' | 'application/vnd.collabio.xodocuments.document' | 'application/vnd.collabio.xodocuments.document-template' | 'application/vnd.collabio.xodocuments.presentation' | 'application/vnd.collabio.xodocuments.presentation-template' | 'application/vnd.collabio.xodocuments.spreadsheet' | 'application/vnd.collabio.xodocuments.spreadsheet-template' | 'application/vnd.collection+json' | 'application/vnd.collection.doc+json' | 'application/vnd.collection.next+json' | 'application/vnd.comicbook+zip' | 'application/vnd.comicbook-rar' | 'application/vnd.commerce-battelle' | 'application/vnd.commonspace' | 'application/vnd.contact.cmsg' | 'application/vnd.coreos.ignition+json' | 'application/vnd.cosmocaller' | 'application/vnd.crick.clicker' | 'application/vnd.crick.clicker.keyboard' | 'application/vnd.crick.clicker.palette' | 'application/vnd.crick.clicker.template' | 'application/vnd.crick.clicker.wordbank' | 'application/vnd.criticaltools.wbs+xml' | 'application/vnd.ctc-posml' | 'application/vnd.ctct.ws+xml' | 'application/vnd.cups-pdf' | 'application/vnd.cups-postscript' | 'application/vnd.cups-ppd' | 'application/vnd.cups-raster' | 'application/vnd.cups-raw' | 'application/vnd.curl' | 'application/vnd.curl.car' | 'application/vnd.curl.pcurl' | 'application/vnd.cyan.dean.root+xml' | 'application/vnd.cybank' | 'application/vnd.d2l.coursepackage1p0+zip' | 'application/vnd.dart' | 'application/vnd.data-vision.rdz' | 'application/vnd.datapackage+json' | 'application/vnd.dataresource+json' | 'application/vnd.debian.binary-package' | 'application/vnd.dece.data' | 'application/vnd.dece.ttml+xml' | 'application/vnd.dece.unspecified' | 'application/vnd.dece.zip' | 'application/vnd.denovo.fcselayout-link' | 'application/vnd.desmume.movie' | 'application/vnd.dir-bi.plate-dl-nosuffix' | 'application/vnd.dm.delegation+xml' | 'application/vnd.dna' | 'application/vnd.document+json' | 'application/vnd.dolby.mlp' | 'application/vnd.dolby.mobile.1' | 'application/vnd.dolby.mobile.2' | 'application/vnd.doremir.scorecloud-binary-document' | 'application/vnd.dpgraph' | 'application/vnd.dreamfactory' | 'application/vnd.drive+json' | 'application/vnd.ds-keypoint' | 'application/vnd.dtg.local' | 'application/vnd.dtg.local.flash' | 'application/vnd.dtg.local.html' | 'application/vnd.dvb.ait' | 'application/vnd.dvb.dvbj' | 'application/vnd.dvb.esgcontainer' | 'application/vnd.dvb.ipdcdftnotifaccess' | 'application/vnd.dvb.ipdcesgaccess' | 'application/vnd.dvb.ipdcesgaccess2' | 'application/vnd.dvb.ipdcesgpdd' | 'application/vnd.dvb.ipdcroaming' | 'application/vnd.dvb.iptv.alfec-base' | 'application/vnd.dvb.iptv.alfec-enhancement' | 'application/vnd.dvb.notif-aggregate-root+xml' | 'application/vnd.dvb.notif-container+xml' | 'application/vnd.dvb.notif-generic+xml' | 'application/vnd.dvb.notif-ia-msglist+xml' | 'application/vnd.dvb.notif-ia-registration-request+xml' | 'application/vnd.dvb.notif-ia-registration-response+xml' | 'application/vnd.dvb.notif-init+xml' | 'application/vnd.dvb.pfr' | 'application/vnd.dvb.service' | 'application/vnd.dxr' | 'application/vnd.dynageo' | 'application/vnd.dzr' | 'application/vnd.easykaraoke.cdgdownload' | 'application/vnd.ecdis-update' | 'application/vnd.ecip.rlp' | 'application/vnd.ecowin.chart' | 'application/vnd.ecowin.filerequest' | 'application/vnd.ecowin.fileupdate' | 'application/vnd.ecowin.series' | 'application/vnd.ecowin.seriesrequest' | 'application/vnd.ecowin.seriesupdate' | 'application/vnd.efi.img' | 'application/vnd.efi.iso' | 'application/vnd.emclient.accessrequest+xml' | 'application/vnd.enliven' | 'application/vnd.enphase.envoy' | 'application/vnd.eprints.data+xml' | 'application/vnd.epson.esf' | 'application/vnd.epson.msf' | 'application/vnd.epson.quickanime' | 'application/vnd.epson.salt' | 'application/vnd.epson.ssf' | 'application/vnd.ericsson.quickcall' | 'application/vnd.espass-espass+zip' | 'application/vnd.eszigno3+xml' | 'application/vnd.etsi.aoc+xml' | 'application/vnd.etsi.asic-e+zip' | 'application/vnd.etsi.asic-s+zip' | 'application/vnd.etsi.cug+xml' | 'application/vnd.etsi.iptvcommand+xml' | 'application/vnd.etsi.iptvdiscovery+xml' | 'application/vnd.etsi.iptvprofile+xml' | 'application/vnd.etsi.iptvsad-bc+xml' | 'application/vnd.etsi.iptvsad-cod+xml' | 'application/vnd.etsi.iptvsad-npvr+xml' | 'application/vnd.etsi.iptvservice+xml' | 'application/vnd.etsi.iptvsync+xml' | 'application/vnd.etsi.iptvueprofile+xml' | 'application/vnd.etsi.mcid+xml' | 'application/vnd.etsi.mheg5' | 'application/vnd.etsi.overload-control-policy-dataset+xml' | 'application/vnd.etsi.pstn+xml' | 'application/vnd.etsi.sci+xml' | 'application/vnd.etsi.simservs+xml' | 'application/vnd.etsi.timestamp-token' | 'application/vnd.etsi.tsl+xml' | 'application/vnd.etsi.tsl.der' | 'application/vnd.eudora.data' | 'application/vnd.evolv.ecig.profile' | 'application/vnd.evolv.ecig.settings' | 'application/vnd.evolv.ecig.theme' | 'application/vnd.exstream-empower+zip' | 'application/vnd.ezpix-album' | 'application/vnd.ezpix-package' | 'application/vnd.f-secure.mobile' | 'application/vnd.fastcopy-disk-image' | 'application/vnd.fdf' | 'application/vnd.fdsn.mseed' | 'application/vnd.fdsn.seed' | 'application/vnd.ffsns' | 'application/vnd.filmit.zfc' | 'application/vnd.fints' | 'application/vnd.firemonkeys.cloudcell' | 'application/vnd.flographit' | 'application/vnd.fluxtime.clip' | 'application/vnd.font-fontforge-sfd' | 'application/vnd.framemaker' | 'application/vnd.frogans.fnc' | 'application/vnd.frogans.ltf' | 'application/vnd.fsc.weblaunch' | 'application/vnd.fujitsu.oasys' | 'application/vnd.fujitsu.oasys2' | 'application/vnd.fujitsu.oasys3' | 'application/vnd.fujitsu.oasysgp' | 'application/vnd.fujitsu.oasysprs' | 'application/vnd.fujixerox.art-ex' | 'application/vnd.fujixerox.art4' | 'application/vnd.fujixerox.ddd' | 'application/vnd.fujixerox.docuworks' | 'application/vnd.fujixerox.docuworks.binder' | 'application/vnd.fujixerox.docuworks.container' | 'application/vnd.fujixerox.hbpl' | 'application/vnd.fut-misnet' | 'application/vnd.futoin+cbor' | 'application/vnd.futoin+json' | 'application/vnd.fuzzysheet' | 'application/vnd.genomatix.tuxedo' | 'application/vnd.geo+json' | 'application/vnd.geocube+xml' | 'application/vnd.geogebra.file' | 'application/vnd.geogebra.tool' | 'application/vnd.geometry-explorer' | 'application/vnd.geonext' | 'application/vnd.geoplan' | 'application/vnd.geospace' | 'application/vnd.gerber' | 'application/vnd.globalplatform.card-content-mgt' | 'application/vnd.globalplatform.card-content-mgt-response' | 'application/vnd.gmx' | 'application/vnd.google-apps.document' | 'application/vnd.google-apps.presentation' | 'application/vnd.google-apps.spreadsheet' | 'application/vnd.google-earth.kml+xml' | 'application/vnd.google-earth.kmz' | 'application/vnd.gov.sk.e-form+xml' | 'application/vnd.gov.sk.e-form+zip' | 'application/vnd.gov.sk.xmldatacontainer+xml' | 'application/vnd.grafeq' | 'application/vnd.gridmp' | 'application/vnd.groove-account' | 'application/vnd.groove-help' | 'application/vnd.groove-identity-message' | 'application/vnd.groove-injector' | 'application/vnd.groove-tool-message' | 'application/vnd.groove-tool-template' | 'application/vnd.groove-vcard' | 'application/vnd.hal+json' | 'application/vnd.hal+xml' | 'application/vnd.handheld-entertainment+xml' | 'application/vnd.hbci' | 'application/vnd.hc+json' | 'application/vnd.hcl-bireports' | 'application/vnd.hdt' | 'application/vnd.heroku+json' | 'application/vnd.hhe.lesson-player' | 'application/vnd.hp-hpgl' | 'application/vnd.hp-hpid' | 'application/vnd.hp-hps' | 'application/vnd.hp-jlyt' | 'application/vnd.hp-pcl' | 'application/vnd.hp-pclxl' | 'application/vnd.httphone' | 'application/vnd.hydrostatix.sof-data' | 'application/vnd.hyper+json' | 'application/vnd.hyper-item+json' | 'application/vnd.hyperdrive+json' | 'application/vnd.hzn-3d-crossword' | 'application/vnd.ibm.afplinedata' | 'application/vnd.ibm.electronic-media' | 'application/vnd.ibm.minipay' | 'application/vnd.ibm.modcap' | 'application/vnd.ibm.rights-management' | 'application/vnd.ibm.secure-container' | 'application/vnd.iccprofile' | 'application/vnd.ieee.1905' | 'application/vnd.igloader' | 'application/vnd.imagemeter.folder+zip' | 'application/vnd.imagemeter.image+zip' | 'application/vnd.immervision-ivp' | 'application/vnd.immervision-ivu' | 'application/vnd.ims.imsccv1p1' | 'application/vnd.ims.imsccv1p2' | 'application/vnd.ims.imsccv1p3' | 'application/vnd.ims.lis.v2.result+json' | 'application/vnd.ims.lti.v2.toolconsumerprofile+json' | 'application/vnd.ims.lti.v2.toolproxy+json' | 'application/vnd.ims.lti.v2.toolproxy.id+json' | 'application/vnd.ims.lti.v2.toolsettings+json' | 'application/vnd.ims.lti.v2.toolsettings.simple+json' | 'application/vnd.informedcontrol.rms+xml' | 'application/vnd.informix-visionary' | 'application/vnd.infotech.project' | 'application/vnd.infotech.project+xml' | 'application/vnd.innopath.wamp.notification' | 'application/vnd.insors.igm' | 'application/vnd.intercon.formnet' | 'application/vnd.intergeo' | 'application/vnd.intertrust.digibox' | 'application/vnd.intertrust.nncp' | 'application/vnd.intu.qbo' | 'application/vnd.intu.qfx' | 'application/vnd.iptc.g2.catalogitem+xml' | 'application/vnd.iptc.g2.conceptitem+xml' | 'application/vnd.iptc.g2.knowledgeitem+xml' | 'application/vnd.iptc.g2.newsitem+xml' | 'application/vnd.iptc.g2.newsmessage+xml' | 'application/vnd.iptc.g2.packageitem+xml' | 'application/vnd.iptc.g2.planningitem+xml' | 'application/vnd.ipunplugged.rcprofile' | 'application/vnd.irepository.package+xml' | 'application/vnd.is-xpr' | 'application/vnd.isac.fcs' | 'application/vnd.jam' | 'application/vnd.japannet-directory-service' | 'application/vnd.japannet-jpnstore-wakeup' | 'application/vnd.japannet-payment-wakeup' | 'application/vnd.japannet-registration' | 'application/vnd.japannet-registration-wakeup' | 'application/vnd.japannet-setstore-wakeup' | 'application/vnd.japannet-verification' | 'application/vnd.japannet-verification-wakeup' | 'application/vnd.jcp.javame.midlet-rms' | 'application/vnd.jisp' | 'application/vnd.joost.joda-archive' | 'application/vnd.jsk.isdn-ngn' | 'application/vnd.kahootz' | 'application/vnd.kde.karbon' | 'application/vnd.kde.kchart' | 'application/vnd.kde.kformula' | 'application/vnd.kde.kivio' | 'application/vnd.kde.kontour' | 'application/vnd.kde.kpresenter' | 'application/vnd.kde.kspread' | 'application/vnd.kde.kword' | 'application/vnd.kenameaapp' | 'application/vnd.kidspiration' | 'application/vnd.kinar' | 'application/vnd.koan' | 'application/vnd.kodak-descriptor' | 'application/vnd.las.las+json' | 'application/vnd.las.las+xml' | 'application/vnd.leap+json' | 'application/vnd.liberty-request+xml' | 'application/vnd.llamagraphics.life-balance.desktop' | 'application/vnd.llamagraphics.life-balance.exchange+xml' | 'application/vnd.lotus-1-2-3' | 'application/vnd.lotus-approach' | 'application/vnd.lotus-freelance' | 'application/vnd.lotus-notes' | 'application/vnd.lotus-organizer' | 'application/vnd.lotus-screencam' | 'application/vnd.lotus-wordpro' | 'application/vnd.macports.portpkg' | 'application/vnd.mapbox-vector-tile' | 'application/vnd.marlin.drm.actiontoken+xml' | 'application/vnd.marlin.drm.conftoken+xml' | 'application/vnd.marlin.drm.license+xml' | 'application/vnd.marlin.drm.mdcf' | 'application/vnd.mason+json' | 'application/vnd.maxmind.maxmind-db' | 'application/vnd.mcd' | 'application/vnd.medcalcdata' | 'application/vnd.mediastation.cdkey' | 'application/vnd.meridian-slingshot' | 'application/vnd.mfer' | 'application/vnd.mfmp' | 'application/vnd.micro+json' | 'application/vnd.micrografx.flo' | 'application/vnd.micrografx.igx' | 'application/vnd.microsoft.portable-executable' | 'application/vnd.microsoft.windows.thumbnail-cache' | 'application/vnd.miele+json' | 'application/vnd.mif' | 'application/vnd.minisoft-hp3000-save' | 'application/vnd.mitsubishi.misty-guard.trustweb' | 'application/vnd.mobius.daf' | 'application/vnd.mobius.dis' | 'application/vnd.mobius.mbk' | 'application/vnd.mobius.mqy' | 'application/vnd.mobius.msl' | 'application/vnd.mobius.plc' | 'application/vnd.mobius.txf' | 'application/vnd.mophun.application' | 'application/vnd.mophun.certificate' | 'application/vnd.motorola.flexsuite' | 'application/vnd.motorola.flexsuite.adsi' | 'application/vnd.motorola.flexsuite.fis' | 'application/vnd.motorola.flexsuite.gotap' | 'application/vnd.motorola.flexsuite.kmr' | 'application/vnd.motorola.flexsuite.ttc' | 'application/vnd.motorola.flexsuite.wem' | 'application/vnd.motorola.iprm' | 'application/vnd.mozilla.xul+xml' | 'application/vnd.ms-3mfdocument' | 'application/vnd.ms-artgalry' | 'application/vnd.ms-asf' | 'application/vnd.ms-cab-compressed' | 'application/vnd.ms-color.iccprofile' | 'application/vnd.ms-excel' | 'application/vnd.ms-excel.addin.macroenabled.12' | 'application/vnd.ms-excel.sheet.binary.macroenabled.12' | 'application/vnd.ms-excel.sheet.macroenabled.12' | 'application/vnd.ms-excel.template.macroenabled.12' | 'application/vnd.ms-fontobject' | 'application/vnd.ms-htmlhelp' | 'application/vnd.ms-ims' | 'application/vnd.ms-lrm' | 'application/vnd.ms-office.activex+xml' | 'application/vnd.ms-officetheme' | 'application/vnd.ms-opentype' | 'application/vnd.ms-outlook' | 'application/vnd.ms-package.obfuscated-opentype' | 'application/vnd.ms-pki.seccat' | 'application/vnd.ms-pki.stl' | 'application/vnd.ms-playready.initiator+xml' | 'application/vnd.ms-powerpoint' | 'application/vnd.ms-powerpoint.addin.macroenabled.12' | 'application/vnd.ms-powerpoint.presentation.macroenabled.12' | 'application/vnd.ms-powerpoint.slide.macroenabled.12' | 'application/vnd.ms-powerpoint.slideshow.macroenabled.12' | 'application/vnd.ms-powerpoint.template.macroenabled.12' | 'application/vnd.ms-printdevicecapabilities+xml' | 'application/vnd.ms-printing.printticket+xml' | 'application/vnd.ms-printschematicket+xml' | 'application/vnd.ms-project' | 'application/vnd.ms-tnef' | 'application/vnd.ms-windows.devicepairing' | 'application/vnd.ms-windows.nwprinting.oob' | 'application/vnd.ms-windows.printerpairing' | 'application/vnd.ms-windows.wsd.oob' | 'application/vnd.ms-wmdrm.lic-chlg-req' | 'application/vnd.ms-wmdrm.lic-resp' | 'application/vnd.ms-wmdrm.meter-chlg-req' | 'application/vnd.ms-wmdrm.meter-resp' | 'application/vnd.ms-word.document.macroenabled.12' | 'application/vnd.ms-word.template.macroenabled.12' | 'application/vnd.ms-works' | 'application/vnd.ms-wpl' | 'application/vnd.ms-xpsdocument' | 'application/vnd.msa-disk-image' | 'application/vnd.mseq' | 'application/vnd.msign' | 'application/vnd.multiad.creator' | 'application/vnd.multiad.creator.cif' | 'application/vnd.music-niff' | 'application/vnd.musician' | 'application/vnd.muvee.style' | 'application/vnd.mynfc' | 'application/vnd.ncd.control' | 'application/vnd.ncd.reference' | 'application/vnd.nearst.inv+json' | 'application/vnd.nervana' | 'application/vnd.netfpx' | 'application/vnd.neurolanguage.nlu' | 'application/vnd.nimn' | 'application/vnd.nintendo.nitro.rom' | 'application/vnd.nintendo.snes.rom' | 'application/vnd.nitf' | 'application/vnd.noblenet-directory' | 'application/vnd.noblenet-sealer' | 'application/vnd.noblenet-web' | 'application/vnd.nokia.catalogs' | 'application/vnd.nokia.conml+wbxml' | 'application/vnd.nokia.conml+xml' | 'application/vnd.nokia.iptv.config+xml' | 'application/vnd.nokia.isds-radio-presets' | 'application/vnd.nokia.landmark+wbxml' | 'application/vnd.nokia.landmark+xml' | 'application/vnd.nokia.landmarkcollection+xml' | 'application/vnd.nokia.n-gage.ac+xml' | 'application/vnd.nokia.n-gage.data' | 'application/vnd.nokia.n-gage.symbian.install' | 'application/vnd.nokia.ncd' | 'application/vnd.nokia.pcd+wbxml' | 'application/vnd.nokia.pcd+xml' | 'application/vnd.nokia.radio-preset' | 'application/vnd.nokia.radio-presets' | 'application/vnd.novadigm.edm' | 'application/vnd.novadigm.edx' | 'application/vnd.novadigm.ext' | 'application/vnd.ntt-local.content-share' | 'application/vnd.ntt-local.file-transfer' | 'application/vnd.ntt-local.ogw_remote-access' | 'application/vnd.ntt-local.sip-ta_remote' | 'application/vnd.ntt-local.sip-ta_tcp_stream' | 'application/vnd.oasis.opendocument.chart' | 'application/vnd.oasis.opendocument.chart-template' | 'application/vnd.oasis.opendocument.database' | 'application/vnd.oasis.opendocument.formula' | 'application/vnd.oasis.opendocument.formula-template' | 'application/vnd.oasis.opendocument.graphics' | 'application/vnd.oasis.opendocument.graphics-template' | 'application/vnd.oasis.opendocument.image' | 'application/vnd.oasis.opendocument.image-template' | 'application/vnd.oasis.opendocument.presentation' | 'application/vnd.oasis.opendocument.presentation-template' | 'application/vnd.oasis.opendocument.spreadsheet' | 'application/vnd.oasis.opendocument.spreadsheet-template' | 'application/vnd.oasis.opendocument.text' | 'application/vnd.oasis.opendocument.text-master' | 'application/vnd.oasis.opendocument.text-template' | 'application/vnd.oasis.opendocument.text-web' | 'application/vnd.obn' | 'application/vnd.ocf+cbor' | 'application/vnd.oftn.l10n+json' | 'application/vnd.oipf.contentaccessdownload+xml' | 'application/vnd.oipf.contentaccessstreaming+xml' | 'application/vnd.oipf.cspg-hexbinary' | 'application/vnd.oipf.dae.svg+xml' | 'application/vnd.oipf.dae.xhtml+xml' | 'application/vnd.oipf.mippvcontrolmessage+xml' | 'application/vnd.oipf.pae.gem' | 'application/vnd.oipf.spdiscovery+xml' | 'application/vnd.oipf.spdlist+xml' | 'application/vnd.oipf.ueprofile+xml' | 'application/vnd.oipf.userprofile+xml' | 'application/vnd.olpc-sugar' | 'application/vnd.oma-scws-config' | 'application/vnd.oma-scws-http-request' | 'application/vnd.oma-scws-http-response' | 'application/vnd.oma.bcast.associated-procedure-parameter+xml' | 'application/vnd.oma.bcast.drm-trigger+xml' | 'application/vnd.oma.bcast.imd+xml' | 'application/vnd.oma.bcast.ltkm' | 'application/vnd.oma.bcast.notification+xml' | 'application/vnd.oma.bcast.provisioningtrigger' | 'application/vnd.oma.bcast.sgboot' | 'application/vnd.oma.bcast.sgdd+xml' | 'application/vnd.oma.bcast.sgdu' | 'application/vnd.oma.bcast.simple-symbol-container' | 'application/vnd.oma.bcast.smartcard-trigger+xml' | 'application/vnd.oma.bcast.sprov+xml' | 'application/vnd.oma.bcast.stkm' | 'application/vnd.oma.cab-address-book+xml' | 'application/vnd.oma.cab-feature-handler+xml' | 'application/vnd.oma.cab-pcc+xml' | 'application/vnd.oma.cab-subs-invite+xml' | 'application/vnd.oma.cab-user-prefs+xml' | 'application/vnd.oma.dcd' | 'application/vnd.oma.dcdc' | 'application/vnd.oma.dd2+xml' | 'application/vnd.oma.drm.risd+xml' | 'application/vnd.oma.group-usage-list+xml' | 'application/vnd.oma.lwm2m+json' | 'application/vnd.oma.lwm2m+tlv' | 'application/vnd.oma.pal+xml' | 'application/vnd.oma.poc.detailed-progress-report+xml' | 'application/vnd.oma.poc.final-report+xml' | 'application/vnd.oma.poc.groups+xml' | 'application/vnd.oma.poc.invocation-descriptor+xml' | 'application/vnd.oma.poc.optimized-progress-report+xml' | 'application/vnd.oma.push' | 'application/vnd.oma.scidm.messages+xml' | 'application/vnd.oma.xcap-directory+xml' | 'application/vnd.omads-email+xml' | 'application/vnd.omads-file+xml' | 'application/vnd.omads-folder+xml' | 'application/vnd.omaloc-supl-init' | 'application/vnd.onepager' | 'application/vnd.onepagertamp' | 'application/vnd.onepagertamx' | 'application/vnd.onepagertat' | 'application/vnd.onepagertatp' | 'application/vnd.onepagertatx' | 'application/vnd.openblox.game+xml' | 'application/vnd.openblox.game-binary' | 'application/vnd.openeye.oeb' | 'application/vnd.openofficeorg.extension' | 'application/vnd.openstreetmap.data+xml' | 'application/vnd.openxmlformats-officedocument.custom-properties+xml' | 'application/vnd.openxmlformats-officedocument.customxmlproperties+xml' | 'application/vnd.openxmlformats-officedocument.drawing+xml' | 'application/vnd.openxmlformats-officedocument.drawingml.chart+xml' | 'application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml' | 'application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml' | 'application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml' | 'application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml' | 'application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml' | 'application/vnd.openxmlformats-officedocument.extended-properties+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.comments+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.presentation' | 'application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.presprops+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.slide' | 'application/vnd.openxmlformats-officedocument.presentationml.slide+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.slideshow' | 'application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.tags+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.template' | 'application/vnd.openxmlformats-officedocument.presentationml.template.main+xml' | 'application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.template' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml' | 'application/vnd.openxmlformats-officedocument.theme+xml' | 'application/vnd.openxmlformats-officedocument.themeoverride+xml' | 'application/vnd.openxmlformats-officedocument.vmldrawing' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.template' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml' | 'application/vnd.openxmlformats-package.core-properties+xml' | 'application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml' | 'application/vnd.openxmlformats-package.relationships+xml' | 'application/vnd.oracle.resource+json' | 'application/vnd.orange.indata' | 'application/vnd.osa.netdeploy' | 'application/vnd.osgeo.mapguide.package' | 'application/vnd.osgi.bundle' | 'application/vnd.osgi.dp' | 'application/vnd.osgi.subsystem' | 'application/vnd.otps.ct-kip+xml' | 'application/vnd.oxli.countgraph' | 'application/vnd.pagerduty+json' | 'application/vnd.palm' | 'application/vnd.panoply' | 'application/vnd.paos.xml' | 'application/vnd.patentdive' | 'application/vnd.pawaafile' | 'application/vnd.pcos' | 'application/vnd.pg.format' | 'application/vnd.pg.osasli' | 'application/vnd.piaccess.application-licence' | 'application/vnd.picsel' | 'application/vnd.pmi.widget' | 'application/vnd.poc.group-advertisement+xml' | 'application/vnd.pocketlearn' | 'application/vnd.powerbuilder6' | 'application/vnd.powerbuilder6-s' | 'application/vnd.powerbuilder7' | 'application/vnd.powerbuilder7-s' | 'application/vnd.powerbuilder75' | 'application/vnd.powerbuilder75-s' | 'application/vnd.preminet' | 'application/vnd.previewsystems.box' | 'application/vnd.proteus.magazine' | 'application/vnd.psfs' | 'application/vnd.publishare-delta-tree' | 'application/vnd.pvi.ptid1' | 'application/vnd.pwg-multiplexed' | 'application/vnd.pwg-xhtml-print+xml' | 'application/vnd.qualcomm.brew-app-res' | 'application/vnd.quarantainenet' | 'application/vnd.quark.quarkxpress' | 'application/vnd.quobject-quoxdocument' | 'application/vnd.radisys.moml+xml' | 'application/vnd.radisys.msml+xml' | 'application/vnd.radisys.msml-audit+xml' | 'application/vnd.radisys.msml-audit-conf+xml' | 'application/vnd.radisys.msml-audit-conn+xml' | 'application/vnd.radisys.msml-audit-dialog+xml' | 'application/vnd.radisys.msml-audit-stream+xml' | 'application/vnd.radisys.msml-conf+xml' | 'application/vnd.radisys.msml-dialog+xml' | 'application/vnd.radisys.msml-dialog-base+xml' | 'application/vnd.radisys.msml-dialog-fax-detect+xml' | 'application/vnd.radisys.msml-dialog-fax-sendrecv+xml' | 'application/vnd.radisys.msml-dialog-group+xml' | 'application/vnd.radisys.msml-dialog-speech+xml' | 'application/vnd.radisys.msml-dialog-transform+xml' | 'application/vnd.rainstor.data' | 'application/vnd.rapid' | 'application/vnd.rar' | 'application/vnd.realvnc.bed' | 'application/vnd.recordare.musicxml' | 'application/vnd.recordare.musicxml+xml' | 'application/vnd.renlearn.rlprint' | 'application/vnd.restful+json' | 'application/vnd.rig.cryptonote' | 'application/vnd.rim.cod' | 'application/vnd.rn-realmedia' | 'application/vnd.rn-realmedia-vbr' | 'application/vnd.route66.link66+xml' | 'application/vnd.rs-274x' | 'application/vnd.ruckus.download' | 'application/vnd.s3sms' | 'application/vnd.sailingtracker.track' | 'application/vnd.sbm.cid' | 'application/vnd.sbm.mid2' | 'application/vnd.scribus' | 'application/vnd.sealed.3df' | 'application/vnd.sealed.csf' | 'application/vnd.sealed.doc' | 'application/vnd.sealed.eml' | 'application/vnd.sealed.mht' | 'application/vnd.sealed.net' | 'application/vnd.sealed.ppt' | 'application/vnd.sealed.tiff' | 'application/vnd.sealed.xls' | 'application/vnd.sealedmedia.softseal.html' | 'application/vnd.sealedmedia.softseal.pdf' | 'application/vnd.seemail' | 'application/vnd.sema' | 'application/vnd.semd' | 'application/vnd.semf' | 'application/vnd.shana.informed.formdata' | 'application/vnd.shana.informed.formtemplate' | 'application/vnd.shana.informed.interchange' | 'application/vnd.shana.informed.package' | 'application/vnd.shootproof+json' | 'application/vnd.sigrok.session' | 'application/vnd.simtech-mindmapper' | 'application/vnd.siren+json' | 'application/vnd.smaf' | 'application/vnd.smart.notebook' | 'application/vnd.smart.teacher' | 'application/vnd.software602.filler.form+xml' | 'application/vnd.software602.filler.form-xml-zip' | 'application/vnd.solent.sdkm+xml' | 'application/vnd.spotfire.dxp' | 'application/vnd.spotfire.sfs' | 'application/vnd.sqlite3' | 'application/vnd.sss-cod' | 'application/vnd.sss-dtf' | 'application/vnd.sss-ntf' | 'application/vnd.stardivision.calc' | 'application/vnd.stardivision.draw' | 'application/vnd.stardivision.impress' | 'application/vnd.stardivision.math' | 'application/vnd.stardivision.writer' | 'application/vnd.stardivision.writer-global' | 'application/vnd.stepmania.package' | 'application/vnd.stepmania.stepchart' | 'application/vnd.street-stream' | 'application/vnd.sun.wadl+xml' | 'application/vnd.sun.xml.calc' | 'application/vnd.sun.xml.calc.template' | 'application/vnd.sun.xml.draw' | 'application/vnd.sun.xml.draw.template' | 'application/vnd.sun.xml.impress' | 'application/vnd.sun.xml.impress.template' | 'application/vnd.sun.xml.math' | 'application/vnd.sun.xml.writer' | 'application/vnd.sun.xml.writer.global' | 'application/vnd.sun.xml.writer.template' | 'application/vnd.sus-calendar' | 'application/vnd.svd' | 'application/vnd.swiftview-ics' | 'application/vnd.symbian.install' | 'application/vnd.syncml+xml' | 'application/vnd.syncml.dm+wbxml' | 'application/vnd.syncml.dm+xml' | 'application/vnd.syncml.dm.notification' | 'application/vnd.syncml.dmddf+wbxml' | 'application/vnd.syncml.dmddf+xml' | 'application/vnd.syncml.dmtnds+wbxml' | 'application/vnd.syncml.dmtnds+xml' | 'application/vnd.syncml.ds.notification' | 'application/vnd.tableschema+json' | 'application/vnd.tao.intent-module-archive' | 'application/vnd.tcpdump.pcap' | 'application/vnd.think-cell.ppttc+json' | 'application/vnd.tmd.mediaflex.api+xml' | 'application/vnd.tml' | 'application/vnd.tmobile-livetv' | 'application/vnd.tri.onesource' | 'application/vnd.trid.tpt' | 'application/vnd.triscape.mxs' | 'application/vnd.trueapp' | 'application/vnd.truedoc' | 'application/vnd.ubisoft.webplayer' | 'application/vnd.ufdl' | 'application/vnd.uiq.theme' | 'application/vnd.umajin' | 'application/vnd.unity' | 'application/vnd.uoml+xml' | 'application/vnd.uplanet.alert' | 'application/vnd.uplanet.alert-wbxml' | 'application/vnd.uplanet.bearer-choice' | 'application/vnd.uplanet.bearer-choice-wbxml' | 'application/vnd.uplanet.cacheop' | 'application/vnd.uplanet.cacheop-wbxml' | 'application/vnd.uplanet.channel' | 'application/vnd.uplanet.channel-wbxml' | 'application/vnd.uplanet.list' | 'application/vnd.uplanet.list-wbxml' | 'application/vnd.uplanet.listcmd' | 'application/vnd.uplanet.listcmd-wbxml' | 'application/vnd.uplanet.signal' | 'application/vnd.uri-map' | 'application/vnd.valve.source.material' | 'application/vnd.vcx' | 'application/vnd.vd-study' | 'application/vnd.vectorworks' | 'application/vnd.vel+json' | 'application/vnd.verimatrix.vcas' | 'application/vnd.vidsoft.vidconference' | 'application/vnd.visio' | 'application/vnd.visionary' | 'application/vnd.vividence.scriptfile' | 'application/vnd.vsf' | 'application/vnd.wap.sic' | 'application/vnd.wap.slc' | 'application/vnd.wap.wbxml' | 'application/vnd.wap.wmlc' | 'application/vnd.wap.wmlscriptc' | 'application/vnd.webturbo' | 'application/vnd.wfa.p2p' | 'application/vnd.wfa.wsc' | 'application/vnd.windows.devicepairing' | 'application/vnd.wmc' | 'application/vnd.wmf.bootstrap' | 'application/vnd.wolfram.mathematica' | 'application/vnd.wolfram.mathematica.package' | 'application/vnd.wolfram.player' | 'application/vnd.wordperfect' | 'application/vnd.wqd' | 'application/vnd.wrq-hp3000-labelled' | 'application/vnd.wt.stf' | 'application/vnd.wv.csp+wbxml' | 'application/vnd.wv.csp+xml' | 'application/vnd.wv.ssp+xml' | 'application/vnd.xacml+json' | 'application/vnd.xara' | 'application/vnd.xfdl' | 'application/vnd.xfdl.webform' | 'application/vnd.xmi+xml' | 'application/vnd.xmpie.cpkg' | 'application/vnd.xmpie.dpkg' | 'application/vnd.xmpie.plan' | 'application/vnd.xmpie.ppkg' | 'application/vnd.xmpie.xlim' | 'application/vnd.yamaha.hv-dic' | 'application/vnd.yamaha.hv-script' | 'application/vnd.yamaha.hv-voice' | 'application/vnd.yamaha.openscoreformat' | 'application/vnd.yamaha.openscoreformat.osfpvg+xml' | 'application/vnd.yamaha.remote-setup' | 'application/vnd.yamaha.smaf-audio' | 'application/vnd.yamaha.smaf-phrase' | 'application/vnd.yamaha.through-ngn' | 'application/vnd.yamaha.tunnel-udpencap' | 'application/vnd.yaoweme' | 'application/vnd.yellowriver-custom-menu' | 'application/vnd.youtube.yt' | 'application/vnd.zul' | 'application/vnd.zzazz.deck+xml' | 'application/voicexml+xml' | 'application/voucher-cms+json' | 'application/vq-rtcpxr' | 'application/wasm' | 'application/watcherinfo+xml' | 'application/webpush-options+json' | 'application/whoispp-query' | 'application/whoispp-response' | 'application/widget' | 'application/winhlp' | 'application/wita' | 'application/wordperfect5.1' | 'application/wsdl+xml' | 'application/wspolicy+xml' | 'application/x-7z-compressed' | 'application/x-abiword' | 'application/x-ace-compressed' | 'application/x-amf' | 'application/x-apple-diskimage' | 'application/x-arj' | 'application/x-authorware-bin' | 'application/x-authorware-map' | 'application/x-authorware-seg' | 'application/x-bcpio' | 'application/x-bdoc' | 'application/x-bittorrent' | 'application/x-blorb' | 'application/x-bzip' | 'application/x-bzip2' | 'application/x-cbr' | 'application/x-cdlink' | 'application/x-cfs-compressed' | 'application/x-chat' | 'application/x-chess-pgn' | 'application/x-chrome-extension' | 'application/x-cocoa' | 'application/x-compress' | 'application/x-conference' | 'application/x-cpio' | 'application/x-csh' | 'application/x-deb' | 'application/x-debian-package' | 'application/x-dgc-compressed' | 'application/x-director' | 'application/x-doom' | 'application/x-dtbncx+xml' | 'application/x-dtbook+xml' | 'application/x-dtbresource+xml' | 'application/x-dvi' | 'application/x-envoy' | 'application/x-eva' | 'application/x-font-bdf' | 'application/x-font-dos' | 'application/x-font-framemaker' | 'application/x-font-ghostscript' | 'application/x-font-libgrx' | 'application/x-font-linux-psf' | 'application/x-font-pcf' | 'application/x-font-snf' | 'application/x-font-speedo' | 'application/x-font-sunos-news' | 'application/x-font-type1' | 'application/x-font-vfont' | 'application/x-freearc' | 'application/x-futuresplash' | 'application/x-gca-compressed' | 'application/x-glulx' | 'application/x-gnumeric' | 'application/x-gramps-xml' | 'application/x-gtar' | 'application/x-gzip' | 'application/x-hdf' | 'application/x-httpd-php' | 'application/x-install-instructions' | 'application/x-iso9660-image' | 'application/x-java-archive-diff' | 'application/x-java-jnlp-file' | 'application/x-javascript' | 'application/x-latex' | 'application/x-lua-bytecode' | 'application/x-lzh-compressed' | 'application/x-makeself' | 'application/x-mie' | 'application/x-mobipocket-ebook' | 'application/x-mpegurl' | 'application/x-ms-application' | 'application/x-ms-shortcut' | 'application/x-ms-wmd' | 'application/x-ms-wmz' | 'application/x-ms-xbap' | 'application/x-msaccess' | 'application/x-msbinder' | 'application/x-mscardfile' | 'application/x-msclip' | 'application/x-msdos-program' | 'application/x-msdownload' | 'application/x-msmediaview' | 'application/x-msmetafile' | 'application/x-msmoney' | 'application/x-mspublisher' | 'application/x-msschedule' | 'application/x-msterminal' | 'application/x-mswrite' | 'application/x-netcdf' | 'application/x-ns-proxy-autoconfig' | 'application/x-nzb' | 'application/x-perl' | 'application/x-pilot' | 'application/x-pkcs12' | 'application/x-pkcs7-certificates' | 'application/x-pkcs7-certreqresp' | 'application/x-rar-compressed' | 'application/x-redhat-package-manager' | 'application/x-research-info-systems' | 'application/x-sea' | 'application/x-sh' | 'application/x-shar' | 'application/x-shockwave-flash' | 'application/x-silverlight-app' | 'application/x-sql' | 'application/x-stuffit' | 'application/x-stuffitx' | 'application/x-subrip' | 'application/x-sv4cpio' | 'application/x-sv4crc' | 'application/x-t3vm-image' | 'application/x-tads' | 'application/x-tar' | 'application/x-tcl' | 'application/x-tex' | 'application/x-tex-tfm' | 'application/x-texinfo' | 'application/x-tgif' | 'application/x-ustar' | 'application/x-virtualbox-hdd' | 'application/x-virtualbox-ova' | 'application/x-virtualbox-ovf' | 'application/x-virtualbox-vbox' | 'application/x-virtualbox-vbox-extpack' | 'application/x-virtualbox-vdi' | 'application/x-virtualbox-vhd' | 'application/x-virtualbox-vmdk' | 'application/x-wais-source' | 'application/x-web-app-manifest+json' | 'application/x-www-form-urlencoded' | 'application/x-x509-ca-cert' | 'application/x-xfig' | 'application/x-xliff+xml' | 'application/x-xpinstall' | 'application/x-xz' | 'application/x-zmachine' | 'application/x400-bp' | 'application/xacml+xml' | 'application/xaml+xml' | 'application/xcap-att+xml' | 'application/xcap-caps+xml' | 'application/xcap-diff+xml' | 'application/xcap-el+xml' | 'application/xcap-error+xml' | 'application/xcap-ns+xml' | 'application/xcon-conference-info+xml' | 'application/xcon-conference-info-diff+xml' | 'application/xenc+xml' | 'application/xhtml+xml' | 'application/xhtml-voice+xml' | 'application/xliff+xml' | 'application/xml' | 'application/xml-dtd' | 'application/xml-external-parsed-entity' | 'application/xml-patch+xml' | 'application/xmpp+xml' | 'application/xop+xml' | 'application/xproc+xml' | 'application/xslt+xml' | 'application/xspf+xml' | 'application/xv+xml' | 'application/yang' | 'application/yang-data+json' | 'application/yang-data+xml' | 'application/yang-patch+json' | 'application/yang-patch+xml' | 'application/yin+xml' | 'application/zip' | 'application/zlib' | 'application/zstd' | 'audio/1d-interleaved-parityfec' | 'audio/32kadpcm' | 'audio/3gpp' | 'audio/3gpp2' | 'audio/aac' | 'audio/ac3' | 'audio/adpcm' | 'audio/amr' | 'audio/amr-wb' | 'audio/amr-wb+' | 'audio/aptx' | 'audio/asc' | 'audio/atrac-advanced-lossless' | 'audio/atrac-x' | 'audio/atrac3' | 'audio/basic' | 'audio/bv16' | 'audio/bv32' | 'audio/clearmode' | 'audio/cn' | 'audio/dat12' | 'audio/dls' | 'audio/dsr-es201108' | 'audio/dsr-es202050' | 'audio/dsr-es202211' | 'audio/dsr-es202212' | 'audio/dv' | 'audio/dvi4' | 'audio/eac3' | 'audio/encaprtp' | 'audio/evrc' | 'audio/evrc-qcp' | 'audio/evrc0' | 'audio/evrc1' | 'audio/evrcb' | 'audio/evrcb0' | 'audio/evrcb1' | 'audio/evrcnw' | 'audio/evrcnw0' | 'audio/evrcnw1' | 'audio/evrcwb' | 'audio/evrcwb0' | 'audio/evrcwb1' | 'audio/evs' | 'audio/fwdred' | 'audio/g711-0' | 'audio/g719' | 'audio/g722' | 'audio/g7221' | 'audio/g723' | 'audio/g726-16' | 'audio/g726-24' | 'audio/g726-32' | 'audio/g726-40' | 'audio/g728' | 'audio/g729' | 'audio/g7291' | 'audio/g729d' | 'audio/g729e' | 'audio/gsm' | 'audio/gsm-efr' | 'audio/gsm-hr-08' | 'audio/ilbc' | 'audio/ip-mr_v2.5' | 'audio/isac' | 'audio/l16' | 'audio/l20' | 'audio/l24' | 'audio/l8' | 'audio/lpc' | 'audio/melp' | 'audio/melp1200' | 'audio/melp2400' | 'audio/melp600' | 'audio/midi' | 'audio/mobile-xmf' | 'audio/mp3' | 'audio/mp4' | 'audio/mp4a-latm' | 'audio/mpa' | 'audio/mpa-robust' | 'audio/mpeg' | 'audio/mpeg4-generic' | 'audio/musepack' | 'audio/ogg' | 'audio/opus' | 'audio/parityfec' | 'audio/pcma' | 'audio/pcma-wb' | 'audio/pcmu' | 'audio/pcmu-wb' | 'audio/prs.sid' | 'audio/qcelp' | 'audio/raptorfec' | 'audio/red' | 'audio/rtp-enc-aescm128' | 'audio/rtp-midi' | 'audio/rtploopback' | 'audio/rtx' | 'audio/s3m' | 'audio/silk' | 'audio/smv' | 'audio/smv-qcp' | 'audio/smv0' | 'audio/sp-midi' | 'audio/speex' | 'audio/t140c' | 'audio/t38' | 'audio/telephone-event' | 'audio/tone' | 'audio/uemclip' | 'audio/ulpfec' | 'audio/usac' | 'audio/vdvi' | 'audio/vmr-wb' | 'audio/vnd.3gpp.iufp' | 'audio/vnd.4sb' | 'audio/vnd.audiokoz' | 'audio/vnd.celp' | 'audio/vnd.cisco.nse' | 'audio/vnd.cmles.radio-events' | 'audio/vnd.cns.anp1' | 'audio/vnd.cns.inf1' | 'audio/vnd.dece.audio' | 'audio/vnd.digital-winds' | 'audio/vnd.dlna.adts' | 'audio/vnd.dolby.heaac.1' | 'audio/vnd.dolby.heaac.2' | 'audio/vnd.dolby.mlp' | 'audio/vnd.dolby.mps' | 'audio/vnd.dolby.pl2' | 'audio/vnd.dolby.pl2x' | 'audio/vnd.dolby.pl2z' | 'audio/vnd.dolby.pulse.1' | 'audio/vnd.dra' | 'audio/vnd.dts' | 'audio/vnd.dts.hd' | 'audio/vnd.dvb.file' | 'audio/vnd.everad.plj' | 'audio/vnd.hns.audio' | 'audio/vnd.lucent.voice' | 'audio/vnd.ms-playready.media.pya' | 'audio/vnd.nokia.mobile-xmf' | 'audio/vnd.nortel.vbk' | 'audio/vnd.nuera.ecelp4800' | 'audio/vnd.nuera.ecelp7470' | 'audio/vnd.nuera.ecelp9600' | 'audio/vnd.octel.sbc' | 'audio/vnd.presonus.multitrack' | 'audio/vnd.qcelp' | 'audio/vnd.rhetorex.32kadpcm' | 'audio/vnd.rip' | 'audio/vnd.rn-realaudio' | 'audio/vnd.sealedmedia.softseal.mpeg' | 'audio/vnd.vmx.cvsd' | 'audio/vnd.wave' | 'audio/vorbis' | 'audio/vorbis-config' | 'audio/wav' | 'audio/wave' | 'audio/webm' | 'audio/x-aac' | 'audio/x-aiff' | 'audio/x-caf' | 'audio/x-flac' | 'audio/x-m4a' | 'audio/x-matroska' | 'audio/x-mpegurl' | 'audio/x-ms-wax' | 'audio/x-ms-wma' | 'audio/x-pn-realaudio' | 'audio/x-pn-realaudio-plugin' | 'audio/x-realaudio' | 'audio/x-tta' | 'audio/x-wav' | 'audio/xm' | 'chemical/x-cdx' | 'chemical/x-cif' | 'chemical/x-cmdf' | 'chemical/x-cml' | 'chemical/x-csml' | 'chemical/x-pdb' | 'chemical/x-xyz' | 'font/collection' | 'font/otf' | 'font/sfnt' | 'font/ttf' | 'font/woff' | 'font/woff2' | 'image/aces' | 'image/apng' | 'image/avci' | 'image/avcs' | 'image/bmp' | 'image/cgm' | 'image/dicom-rle' | 'image/emf' | 'image/fits' | 'image/g3fax' | 'image/gif' | 'image/heic' | 'image/heic-sequence' | 'image/heif' | 'image/heif-sequence' | 'image/ief' | 'image/jls' | 'image/jp2' | 'image/jpeg' | 'image/jpm' | 'image/jpx' | 'image/ktx' | 'image/naplps' | 'image/pjpeg' | 'image/png' | 'image/prs.btif' | 'image/prs.pti' | 'image/pwg-raster' | 'image/sgi' | 'image/svg+xml' | 'image/t38' | 'image/tiff' | 'image/tiff-fx' | 'image/vnd.adobe.photoshop' | 'image/vnd.airzip.accelerator.azv' | 'image/vnd.cns.inf2' | 'image/vnd.dece.graphic' | 'image/vnd.djvu' | 'image/vnd.dvb.subtitle' | 'image/vnd.dwg' | 'image/vnd.dxf' | 'image/vnd.fastbidsheet' | 'image/vnd.fpx' | 'image/vnd.fst' | 'image/vnd.fujixerox.edmics-mmr' | 'image/vnd.fujixerox.edmics-rlc' | 'image/vnd.globalgraphics.pgb' | 'image/vnd.microsoft.icon' | 'image/vnd.mix' | 'image/vnd.mozilla.apng' | 'image/vnd.ms-modi' | 'image/vnd.ms-photo' | 'image/vnd.net-fpx' | 'image/vnd.radiance' | 'image/vnd.sealed.png' | 'image/vnd.sealedmedia.softseal.gif' | 'image/vnd.sealedmedia.softseal.jpg' | 'image/vnd.svf' | 'image/vnd.tencent.tap' | 'image/vnd.valve.source.texture' | 'image/vnd.wap.wbmp' | 'image/vnd.xiff' | 'image/vnd.zbrush.pcx' | 'image/webp' | 'image/wmf' | 'image/x-3ds' | 'image/x-cmu-raster' | 'image/x-cmx' | 'image/x-freehand' | 'image/x-icon' | 'image/x-jng' | 'image/x-mrsid-image' | 'image/x-ms-bmp' | 'image/x-pcx' | 'image/x-pict' | 'image/x-portable-anymap' | 'image/x-portable-bitmap' | 'image/x-portable-graymap' | 'image/x-portable-pixmap' | 'image/x-rgb' | 'image/x-tga' | 'image/x-xbitmap' | 'image/x-xcf' | 'image/x-xpixmap' | 'image/x-xwindowdump' | 'message/cpim' | 'message/delivery-status' | 'message/disposition-notification' | 'message/external-body' | 'message/feedback-report' | 'message/global' | 'message/global-delivery-status' | 'message/global-disposition-notification' | 'message/global-headers' | 'message/http' | 'message/imdn+xml' | 'message/news' | 'message/partial' | 'message/rfc822' | 'message/s-http' | 'message/sip' | 'message/sipfrag' | 'message/tracking-status' | 'message/vnd.si.simp' | 'message/vnd.wfa.wsc' | 'model/3mf' | 'model/gltf+json' | 'model/gltf-binary' | 'model/iges' | 'model/mesh' | 'model/stl' | 'model/vnd.collada+xml' | 'model/vnd.dwf' | 'model/vnd.flatland.3dml' | 'model/vnd.gdl' | 'model/vnd.gs-gdl' | 'model/vnd.gs.gdl' | 'model/vnd.gtw' | 'model/vnd.moml+xml' | 'model/vnd.mts' | 'model/vnd.opengex' | 'model/vnd.parasolid.transmit.binary' | 'model/vnd.parasolid.transmit.text' | 'model/vnd.rosette.annotated-data-model' | 'model/vnd.usdz+zip' | 'model/vnd.valve.source.compiled-map' | 'model/vnd.vtu' | 'model/vrml' | 'model/x3d+binary' | 'model/x3d+fastinfoset' | 'model/x3d+vrml' | 'model/x3d+xml' | 'model/x3d-vrml' | 'multipart/alternative' | 'multipart/appledouble' | 'multipart/byteranges' | 'multipart/digest' | 'multipart/encrypted' | 'multipart/form-data' | 'multipart/header-set' | 'multipart/mixed' | 'multipart/multilingual' | 'multipart/parallel' | 'multipart/related' | 'multipart/report' | 'multipart/signed' | 'multipart/vnd.bint.med-plus' | 'multipart/voice-message' | 'multipart/x-mixed-replace' | 'text/1d-interleaved-parityfec' | 'text/cache-manifest' | 'text/calendar' | 'text/calender' | 'text/cmd' | 'text/coffeescript' | 'text/css' | 'text/csv' | 'text/csv-schema' | 'text/directory' | 'text/dns' | 'text/ecmascript' | 'text/encaprtp' | 'text/enriched' | 'text/fwdred' | 'text/grammar-ref-list' | 'text/html' | 'text/jade' | 'text/javascript' | 'text/jcr-cnd' | 'text/jsx' | 'text/less' | 'text/markdown' | 'text/mathml' | 'text/mizar' | 'text/n3' | 'text/parameters' | 'text/parityfec' | 'text/plain' | 'text/provenance-notation' | 'text/prs.fallenstein.rst' | 'text/prs.lines.tag' | 'text/prs.prop.logic' | 'text/raptorfec' | 'text/red' | 'text/rfc822-headers' | 'text/richtext' | 'text/rtf' | 'text/rtp-enc-aescm128' | 'text/rtploopback' | 'text/rtx' | 'text/sgml' | 'text/shex' | 'text/slim' | 'text/strings' | 'text/stylus' | 'text/t140' | 'text/tab-separated-values' | 'text/troff' | 'text/turtle' | 'text/ulpfec' | 'text/uri-list' | 'text/vcard' | 'text/vnd.a' | 'text/vnd.abc' | 'text/vnd.ascii-art' | 'text/vnd.curl' | 'text/vnd.curl.dcurl' | 'text/vnd.curl.mcurl' | 'text/vnd.curl.scurl' | 'text/vnd.debian.copyright' | 'text/vnd.dmclientscript' | 'text/vnd.dvb.subtitle' | 'text/vnd.esmertec.theme-descriptor' | 'text/vnd.fly' | 'text/vnd.fmi.flexstor' | 'text/vnd.gml' | 'text/vnd.graphviz' | 'text/vnd.hgl' | 'text/vnd.in3d.3dml' | 'text/vnd.in3d.spot' | 'text/vnd.iptc.newsml' | 'text/vnd.iptc.nitf' | 'text/vnd.latex-z' | 'text/vnd.motorola.reflex' | 'text/vnd.ms-mediapackage' | 'text/vnd.net2phone.commcenter.command' | 'text/vnd.radisys.msml-basic-layout' | 'text/vnd.si.uricatalogue' | 'text/vnd.sun.j2me.app-descriptor' | 'text/vnd.trolltech.linguist' | 'text/vnd.wap.si' | 'text/vnd.wap.sl' | 'text/vnd.wap.wml' | 'text/vnd.wap.wmlscript' | 'text/vtt' | 'text/x-asm' | 'text/x-c' | 'text/x-component' | 'text/x-fortran' | 'text/x-gwt-rpc' | 'text/x-handlebars-template' | 'text/x-java-source' | 'text/x-jquery-tmpl' | 'text/x-lua' | 'text/x-markdown' | 'text/x-nfo' | 'text/x-opml' | 'text/x-org' | 'text/x-pascal' | 'text/x-processing' | 'text/x-sass' | 'text/x-scss' | 'text/x-setext' | 'text/x-sfv' | 'text/x-suse-ymp' | 'text/x-uuencode' | 'text/x-vcalendar' | 'text/x-vcard' | 'text/xml' | 'text/xml-external-parsed-entity' | 'text/yaml' | 'video/1d-interleaved-parityfec' | 'video/3gpp' | 'video/3gpp-tt' | 'video/3gpp2' | 'video/bmpeg' | 'video/bt656' | 'video/celb' | 'video/dv' | 'video/encaprtp' | 'video/h261' | 'video/h263' | 'video/h263-1998' | 'video/h263-2000' | 'video/h264' | 'video/h264-rcdo' | 'video/h264-svc' | 'video/h265' | 'video/iso.segment' | 'video/jpeg' | 'video/jpeg2000' | 'video/jpm' | 'video/mj2' | 'video/mp1s' | 'video/mp2p' | 'video/mp2t' | 'video/mp4' | 'video/mp4v-es' | 'video/mpeg' | 'video/mpeg4-generic' | 'video/mpv' | 'video/nv' | 'video/ogg' | 'video/parityfec' | 'video/pointer' | 'video/quicktime' | 'video/raptorfec' | 'video/raw' | 'video/rtp-enc-aescm128' | 'video/rtploopback' | 'video/rtx' | 'video/smpte291' | 'video/smpte292m' | 'video/ulpfec' | 'video/vc1' | 'video/vc2' | 'video/vnd.cctv' | 'video/vnd.dece.hd' | 'video/vnd.dece.mobile' | 'video/vnd.dece.mp4' | 'video/vnd.dece.pd' | 'video/vnd.dece.sd' | 'video/vnd.dece.video' | 'video/vnd.directv.mpeg' | 'video/vnd.directv.mpeg-tts' | 'video/vnd.dlna.mpeg-tts' | 'video/vnd.dvb.file' | 'video/vnd.fvt' | 'video/vnd.hns.video' | 'video/vnd.iptvforum.1dparityfec-1010' | 'video/vnd.iptvforum.1dparityfec-2005' | 'video/vnd.iptvforum.2dparityfec-1010' | 'video/vnd.iptvforum.2dparityfec-2005' | 'video/vnd.iptvforum.ttsavc' | 'video/vnd.iptvforum.ttsmpeg2' | 'video/vnd.motorola.video' | 'video/vnd.motorola.videop' | 'video/vnd.mpegurl' | 'video/vnd.ms-playready.media.pyv' | 'video/vnd.nokia.interleaved-multimedia' | 'video/vnd.nokia.mp4vr' | 'video/vnd.nokia.videovoip' | 'video/vnd.objectvideo' | 'video/vnd.radgamettools.bink' | 'video/vnd.radgamettools.smacker' | 'video/vnd.sealed.mpeg1' | 'video/vnd.sealed.mpeg4' | 'video/vnd.sealed.swf' | 'video/vnd.sealedmedia.softseal.mov' | 'video/vnd.uvvu.mp4' | 'video/vnd.vivo' | 'video/vp8' | 'video/webm' | 'video/x-f4v' | 'video/x-fli' | 'video/x-flv' | 'video/x-m4v' | 'video/x-matroska' | 'video/x-mng' | 'video/x-ms-asf' | 'video/x-ms-vob' | 'video/x-ms-wm' | 'video/x-ms-wmv' | 'video/x-ms-wmx' | 'video/x-ms-wvx' | 'video/x-msvideo' | 'video/x-sgi-movie' | 'video/x-smv' | 'x-conference/x-cooltalk' | 'x-shader/x-fragment' | 'x-shader/x-vertex';
}
