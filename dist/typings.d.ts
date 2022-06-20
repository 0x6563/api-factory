/// <reference types="node" />
export type {} from '../node_modules/typescript/lib/lib.dom';
import { ServerOptions } from "https";
import { API } from "./api";
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
    origin?: string | string[];
    acceptHeaders?: string[];
    headers?: HttpStringMap;
};
export interface HttpError extends Error {
    response: Partial<APIResponse>;
}
export interface APIRequest<U = undefined> {
    method: string;
    url: string;
    path: string;
    pathParameters: HttpStringMap;
    query: HttpStringMapMulti;
    headers: HttpStringMap;
    body?: string;
    json?: any;
    user: U;
}
export interface APIResponse {
    statusCode?: number;
    headers?: HttpStringMap;
    body?: any;
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
    responseType?: 'simple' | 'full';
    authentication?: readonly APIAuthentication[];
    jsonBody?: boolean;
}
export interface Constructor<T> {
    new (): T;
}
