"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = exports.APIFactory = exports.API = void 0;
class API {
    constructor() { }
    onError(request, error) {
        console.log(error);
    }
    static Factory(a, b) {
        const config = typeof a == 'function' ? {} : a;
        const run = typeof a == 'function' ? a : b;
        return class extends API {
            config = config;
            run = run;
        };
    }
}
exports.API = API;
exports.APIFactory = API.Factory;
function HttpError(a, b, c) {
    let error = undefined;
    let response = undefined;
    if (a instanceof Error) {
        error = a;
    }
    else if (typeof a == 'number') {
        response = {
            statusCode: a,
            headers: b || {},
            body: c ?? `${a} Error`
        };
    }
    else if (typeof a == 'string') {
        response = {
            statusCode: 500,
            headers: {},
            body: a
        };
    }
    response = response ?? { statusCode: 500, headers: {}, body: '500 Error' };
    error = error ?? new Error(response.body);
    error.response = response;
    return error;
}
exports.HttpError = HttpError;
//# sourceMappingURL=api.js.map