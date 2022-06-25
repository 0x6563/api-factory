import express from "express";
import cors from "cors";
import { createServer, Server as HTTPSServer } from 'https';
import { APIAuthentication, APIFactoryConfig, APIUser, Constructor, HttpStringMap, HttpStringMapMulti, Promiseable, ServerConfig } from './typings';
import { API, HttpError } from './api';
import { Server as HTTPServer } from 'http';

export function Server(config: ServerConfig): Promise<HTTPServer | HTTPSServer> {
    const app = express();
    const allowed = new Set(['get', 'post', 'delete', 'put', 'all']);
    for (const route of config.routes) {
        console.log();
        console.log(route.id);
        console.log(`[${route.method}]\nlocalhost:${config.port}${route.path}`);

        const methods: ('get' | 'post' | 'put' | 'delete' | 'all')[] = route.method
            .map(v => v.toLowerCase().trim())
            .filter(v => allowed.has(v)) as any;

        for (const method of methods) {
            if (config.cors || route.cors) {
                const corsConfig = typeof route.cors === 'object' ? route.cors : (typeof config.cors === 'object' ? config.cors : undefined);
                app.options(route.path, cors(corsConfig));
                app[method](route.path, cors(corsConfig), express.text({ type: '*/*' }), Invoke(route.handler) as any);
            } else {
                app[method](route.path, express.text({ type: '*/*' }), Invoke(route.handler) as any);
            }
        }
    }

    return new Promise((resolve) => {
        const result: { server: HTTPServer | HTTPSServer } = { server: undefined as any };
        const server = config.ssl ? createServer(config.ssl, app) : app;
        result.server = server.listen(config.port, () => resolve(result.server));
    });
}

const DefaultAPIFactoryConfig: Partial<APIFactoryConfig> = {
    authentication: [],
}

function Invoke(API: Constructor<API<any>>) {
    return (async (req: any, resp: any) => {
        const api = new API();
        const config = Object.assign({}, DefaultAPIFactoryConfig, api.config);
        const { method, url, path, params: pathParameters, query, headers, body } = req;
        const request: APIRequest = new APIRequest({ method, url, path, pathParameters, query, headers, body, user: undefined } as any);
        let response: APIResponse;
        try {
            (request as any).user = await Authenticate(request, config.authentication);
            const result = await api.run(request as any);
            response = !APIResponse.IsResponse(result) ? { body: result } : result;
        } catch (error: any) {
            if (typeof api.onError == 'function') {
                response = (await api.onError(request as any, error)) || ErrorResponse(error);
            } else {
                response = ErrorResponse(error);
            }
        }

        ResponseSetStatusCode(resp, response.statusCode);
        ResponseSetHeaders(resp, response.headers);
        ResponseSetBody(resp, response.body);
    });
}

function ErrorResponse(error: any) {
    return 'response' in error ? error.response : HttpError(error);
}

async function Authenticate(request: APIRequest, authentication?: readonly Promiseable<APIAuthentication>[]): Promise<APIUser | void> {
    if (authentication && authentication.length) {
        for await (const auth of authentication) {
            if (auth.canAuthenticate(request)) {
                const user = await auth.authenticate(request);
                if (!user)
                    throw HttpError(401, {}, 'Not Authorized');
                return user;
            }
        }
        throw HttpError(401, {}, 'Not Authorized');
    }
}

function ResponseSetStatusCode(resp: ExpressResponse, statusCode: number = 200) {
    resp.statusCode = statusCode;
}

function ResponseSetHeaders(resp: ExpressResponse, headers: HttpStringMap = {}) {
    for (const key in headers) {
        const values: any[] = (Array.isArray(headers[key]) ? headers[key] : [headers[key]]) as any[];
        for (const value of values) {
            resp.setHeader(key, value?.toString() || '');
        }
    }
}

function ResponseSetBody(resp: ExpressResponse, body: string = '') {
    resp.send(typeof body == 'string' ? body : JSON.stringify(body));
}

export class APIRequest<T = undefined>  {
    method: string;
    url: string;
    path: string;
    pathParameters: HttpStringMap;
    query: HttpStringMapMulti;
    headers: HttpStringMap;
    body?: string;
    user: T;

    constructor({ method, url, path, pathParameters, query, headers, body }: APIRequest) {
        this.method = method;
        this.url = url;
        this.path = path;
        this.pathParameters = pathParameters;
        this.query = query;
        this.headers = headers;
        this.body = body;
    }

    #json = new Cachable();
    get json() {
        if (this.#json.isCached)
            return this.#json.data;
        try {
            this.#json.data = JSON.parse(this.body);
        } catch (error) {
            console.log(error);
        }
        this.#json.isCached = true;
        return this.#json;
    }
}

export class APIResponse {
    static #$Key: Symbol = Symbol('Response');
    static IsResponse(response: APIResponse) {
        return response.$key === APIResponse.#$Key;
    }

    $key?= APIResponse.#$Key;
    body?: string = '';
    statusCode?: number = 200;
    headers?: HttpStringMap = {};
    constructor({ statusCode, headers, body }: APIResponse) {
        this.statusCode = statusCode ?? 200;
        this.headers = headers ?? {};
        this.body = body ?? '';
    }
}

class Cachable {
    isCached = false;
    data;
}

type ExpressResponse = any;


