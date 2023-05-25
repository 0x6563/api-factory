import { APIResponse } from "./server";
import { APICallback, APIFactoryConfig, APIRequestT, APIResponseT, Constructor, HttpError, HttpStringMap, Promiseable } from "./typings";

export abstract class API<T extends APIFactoryConfig = {}> {
    abstract config: T;
    constructor() { }
    abstract run(request: APIRequestT<T>): APIResponseT<T>;
    onError(request: APIRequestT<T>, error: any): APIResponseT<T> | Promiseable<void> {
        console.log(error);
    }


    static Factory<T extends APIFactoryConfig>(run: APICallback<T>): Constructor<API<T>>;
    static Factory<T extends APIFactoryConfig>(config: T, run: APICallback<T>): Constructor<API<T>>;
    static Factory<T extends APIFactoryConfig>(a: T | APICallback<T>, b?: APICallback<T>): Constructor<API<T>> {
        const config = typeof a == 'function' ? {} as T : a;
        const run = typeof a == 'function' ? a : b;
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
            body: c ?? `${a} Error`
        }
    } else if (typeof a == 'string') {
        response = {
            statusCode: 500,
            headers: {},
            body: a
        }
    }
    response = response ?? { statusCode: 500, headers: {}, body: '500 Error' };
    error = error ?? new Error(response.body);
    (error as HttpError).response = response;
    return error as HttpError;
}