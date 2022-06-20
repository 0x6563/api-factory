import * as express from 'express';
import { createServer, Server as HTTPSServer } from 'https';
import { Response } from "express-serve-static-core";
import { APIAuthentication, APIFactoryConfig, APIRequest, APIResponse, APIUser, Constructor, HttpStringMap, ServerConfig } from './typings';
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
            app[method](route.path, express.text({ type: '*/*' }), Invoke(route.handler) as any);
        }
    }
    return new Promise((resolve) => {
        const result: { server: HTTPServer | HTTPSServer } = { server: undefined as any };
        const server = config.ssl ? createServer(config.ssl, app) : app;
        result.server = server.listen(config.port, () => resolve(result.server));
    });
}

const DefaultAPIFactoryConfig: Partial<APIFactoryConfig> = {
    responseType: 'simple',
    authentication: [],
}

function Invoke(API: Constructor<API<any>>) {
    return (async (req: any, resp: any) => {
        const api = new API();
        const config = Object.assign({}, DefaultAPIFactoryConfig, api.config);
        const { method, url, path, params: pathParameters, query, headers, body } = req;
        const request: APIRequest = { method, url, path, pathParameters, query, headers, body, } as any;
        let response: APIResponse;
        try {
            const user = await Authenticate(request, config.authentication);
            if (user) {
                (request as any).user = user;
            }
            const result = await api.run(request as any);
            response = config.responseType == 'simple' ? { body: result } : result;
        } catch (error: any) {
            if (typeof api.onError == 'function') {
                response = (await api.onError(request as any, error)) || ErrorResponse(error);
            } else {
                console.log('b');
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

async function Authenticate(request: APIRequest, authentication?: readonly APIAuthentication[]): Promise<APIUser | void> {
    if (authentication && authentication.length) {
        for (const auth of authentication) {
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

function ResponseSetStatusCode(resp: Response<any>, statusCode: number = 200) {
    resp.statusCode = statusCode;
}

function ResponseSetHeaders(resp: Response<any>, headers: HttpStringMap = {}) {
    for (const key in headers) {
        const values: any[] = (Array.isArray(headers[key]) ? headers[key] : [headers[key]]) as any[];
        for (const value of values) {
            resp.setHeader(key, value?.toString() || '');
        }
    }
}

function ResponseSetBody(resp: Response<any>, body: string = '') {
    resp.send(typeof body == 'string' ? body : JSON.stringify(body));
}