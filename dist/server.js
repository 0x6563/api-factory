"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const https_1 = require("https");
const api_1 = require("./api");
function Server(config) {
    const app = (0, express_1.default)();
    const allowed = new Set(['get', 'post', 'delete', 'put', 'all']);
    for (const route of config.routes) {
        console.log();
        console.log(route.id);
        console.log(`[${route.method}]\nlocalhost:${config.port}${route.path}`);
        const methods = route.method
            .map(v => v.toLowerCase().trim())
            .filter(v => allowed.has(v));
        for (const method of methods) {
            app[method](route.path, express_1.default.text({ type: '*/*' }), Invoke(route.handler));
        }
    }
    return new Promise((resolve) => {
        const result = { server: undefined };
        const server = config.ssl ? (0, https_1.createServer)(config.ssl, app) : app;
        result.server = server.listen(config.port, () => resolve(result.server));
    });
}
exports.Server = Server;
const DefaultAPIFactoryConfig = {
    responseType: 'simple',
    authentication: [],
};
function Invoke(API) {
    return (async (req, resp) => {
        const api = new API();
        const config = Object.assign({}, DefaultAPIFactoryConfig, api.config);
        const { method, url, path, params: pathParameters, query, headers, body } = req;
        const request = { method, url, path, pathParameters, query, headers, body, };
        if (config.jsonBody) {
            request.json = TryJSON(request.body);
        }
        let response;
        try {
            request.user = await Authenticate(request, config.authentication);
            const result = await api.run(request);
            response = config.responseType == 'simple' ? { body: result } : result;
        }
        catch (error) {
            if (typeof api.onError == 'function') {
                response = (await api.onError(request, error)) || ErrorResponse(error);
            }
            else {
                response = ErrorResponse(error);
            }
        }
        ResponseSetStatusCode(resp, response.statusCode);
        ResponseSetHeaders(resp, response.headers);
        ResponseSetBody(resp, response.body);
    });
}
function TryJSON(body) {
    try {
        return JSON.stringify(body);
    }
    catch (error) {
        return body;
    }
}
function ErrorResponse(error) {
    return 'response' in error ? error.response : (0, api_1.HttpError)(error);
}
async function Authenticate(request, authentication) {
    if (authentication && authentication.length) {
        for (const auth of authentication) {
            if (auth.canAuthenticate(request)) {
                const user = await auth.authenticate(request);
                if (!user)
                    throw (0, api_1.HttpError)(401, {}, 'Not Authorized');
                return user;
            }
        }
        throw (0, api_1.HttpError)(401, {}, 'Not Authorized');
    }
}
function ResponseSetStatusCode(resp, statusCode = 200) {
    resp.statusCode = statusCode;
}
function ResponseSetHeaders(resp, headers = {}) {
    for (const key in headers) {
        const values = (Array.isArray(headers[key]) ? headers[key] : [headers[key]]);
        for (const value of values) {
            resp.setHeader(key, value?.toString() || '');
        }
    }
}
function ResponseSetBody(resp, body = '') {
    resp.send(typeof body == 'string' ? body : JSON.stringify(body));
}
//# sourceMappingURL=server.js.map