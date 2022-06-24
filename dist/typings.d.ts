/// <reference types="node" />
import { ServerOptions } from "https";
import { API } from "./api";
import { APIResponse, APIRequest } from './server';
export interface ServerConfig {
    routes: Routes;
    port: number;
    cors?: CORS;
    ssl?: ServerOptions;
}
export interface Route {
    id: string;
    method: string[];
    path: string;
    handler: Constructor<API>;
    cors?: CORS;
}
export declare type Routes = Route[];
export declare type CORS = true | {
    origin?: Function | RegExp | boolean | string | string[];
    methods?: string[];
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
    optionsSuccessStatus?: number;
};
export interface HttpError extends Error {
    response: Partial<APIResponse>;
}
export declare type APIRequestTransform = (request: APIRequest) => APIRequest;
export declare type HttpStringMapMulti = {
    [key: string]: string | string[];
};
export declare type HttpStringMap = {
    [key: string]: string;
};
export interface APIAuthentication {
    canAuthenticate(request: APIRequest): boolean;
    authenticate(request: APIRequest): Promiseable<APIUser | undefined>;
}
export interface APIUser {
    readonly type: string;
    data?: any;
}
export declare type APICallback<T> = (request: APIRequestT<T>) => APIResponseT<T>;
export declare type APIResponseT<T extends APIFactoryConfig> = Promiseable<GetResponseType<T>>;
export declare type APIRequestT<T extends APIFactoryConfig> = APIRequest<GetUserTypes<T>>;
declare type GetResponseType<T> = T extends {
    responseType: 'full';
} ? Required<APIResponse> : any;
declare type GetUserTypes<T> = T extends {
    authentication: APIAuthentication[];
} ? NonNullable<PromiseResult<ReturnType<T["authentication"][number]["authenticate"]>>> : undefined;
declare type PromiseResult<T> = T extends Promise<infer U> ? U : T;
export declare type Promiseable<T> = Promise<T> | T;
export interface APIFactoryConfig {
    authentication?: readonly APIAuthentication[];
}
export interface Constructor<T> {
    new (): T;
}
export {};
