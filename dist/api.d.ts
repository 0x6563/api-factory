import { APICallback, APIFactoryConfig, APIResponse, APIRequestT, APIResponseT, Constructor, HttpError, HttpStringMap, Promiseable } from "./typings";
export declare abstract class API<T extends APIFactoryConfig = {}> {
    abstract readonly config: T;
    constructor();
    abstract run(request: APIRequestT<T>): APIResponseT<T>;
    onError(request: APIRequestT<T>, error: any): APIResponseT<T> | Promiseable<void>;
    static Factory<T extends APIFactoryConfig>(config: T, run: APICallback<T>): Constructor<API<T>>;
}
export declare const APIFactory: typeof API.Factory;
export declare function HttpError(body: string): HttpError;
export declare function HttpError(error: Error, response?: APIResponse): HttpError;
export declare function HttpError(statusCode: number, headers: HttpStringMap, body: string): HttpError;
