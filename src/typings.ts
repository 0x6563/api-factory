import { ServerOptions } from "https";
import { API } from "./api";
import { APIResponse, APIRequest } from './server'

export interface ServerConfig {
    routes: Routes;
    port: number;
    cors?: CORS;
    ssl?: ServerOptions
    authentication?: Promiseable<APIAuthentication>[];

}

export interface Route {
    id: string;
    method: string[];
    path: string;
    handler: Constructor<API>;
    cors?: CORS;
}

export type Routes = Route[];
export type CORS = true | {
    origin?: Function | RegExp | boolean | string | string[];
    methods?: string[];
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
    optionsSuccessStatus?: number;
}


export interface HttpError extends Error {
    response: Partial<APIResponse>;
}

export type APIRequestTransform = (request: APIRequest) => APIRequest;
export type HttpStringMapMulti = { [key: string]: string | string[] };
export type HttpStringMap = { [key: string]: string };

export interface APIAuthentication {
    canAuthenticate(request: APIRequest): boolean;
    authenticate(request: APIRequest): Promiseable<APIUser | undefined>;
}


export interface APIUser {
    type: string;
    data?: any;
}

export type APICallback<T> = (request: APIRequestT<T>) => APIResponseT<T>;
export type APIResponseT<T extends APIFactoryConfig> = Promiseable<GetResponseType<T>>;
export type APIRequestT<T extends APIFactoryConfig> = APIRequest<GetUserTypes<T>>;

type GetResponseType<T> = T extends { responseType: 'full' } ? Required<APIResponse> : any;
type GetUserTypes<T> = T extends { authentication: Promiseable<APIAuthentication>[] } ? NonNullable<PromiseResult<ReturnType<PromiseResult<T["authentication"][number]>["authenticate"]>>> : undefined;
type PromiseResult<T> = T extends Promise<infer U> ? U : T;
export type Promiseable<T> = Promise<T> | T;

export interface APIFactoryConfig {
    authentication?: Promiseable<APIAuthentication>[];
}

export interface Constructor<T> {
    new(): T;
}
