import { APICallback, APIFactoryConfig, APIResponse, APIRequestT, APIResponseT, Constructor, HttpError, HttpStringMap, Promiseable } from "./typings";

export abstract class API<T extends APIFactoryConfig = {}> {
    abstract readonly config: T;
    constructor() { }
    abstract run(request: APIRequestT<T>): APIResponseT<T>;
    onError(request: APIRequestT<T>, error: any): APIResponseT<T> | Promiseable<void> { }

    static Factory<T extends APIFactoryConfig>(config: T, run: APICallback<T>): Constructor<API<T>> {
        return class extends API<T> {
            config = config;
            run = run;
        }
    }
}

export const APIFactory = API.Factory;

export function HttpError(body: string): HttpError;
export function HttpError(error: Error, response?: APIResponse): HttpError;
export function HttpError(statusCode: number, headers: HttpStringMap, body: string): HttpError;
export function HttpError(a: Error | number | string, b?: APIResponse | HttpStringMap, c?: string): HttpError {
    let error: Error = undefined as any;
    let response: APIResponse = undefined as any;

    if (a instanceof Error) {
        error = a as any;
    } else if (typeof a == 'number') {
        response = {
            statusCode: a,
            headers: b as any || {},
            body: typeof c == 'undefined' ? `${a} Error` : c
        }
    } else if (typeof a == 'string') {
        response = {
            statusCode: 500,
            headers: {},
            body: a
        }
    }
    response = typeof response != 'undefined' ? response : { statusCode: 500, headers: {}, body: '500 Error' };
    error = typeof error != 'undefined' ? error : new Error(response.body);
    (error as HttpError).response = response;
    return error as HttpError;
}