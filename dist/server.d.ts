/// <reference types="node" />
/// <reference types="node" />
import { Server as HTTPSServer } from 'https';
import { HttpStringMap, HttpStringMapMulti, ServerConfig } from './typings';
import { Server as HTTPServer } from 'http';
export declare function Server(config: ServerConfig): Promise<HTTPServer | HTTPSServer>;
export declare class APIRequest<T = undefined> {
    method: string;
    url: string;
    path: string;
    pathParameters: HttpStringMap;
    query: HttpStringMapMulti;
    headers: HttpStringMap;
    body?: string;
    user: T;
    constructor({ method, url, path, pathParameters, query, headers, body }: APIRequest);
    private $json;
    get json(): any;
}
export declare class APIResponse {
    protected static $: Symbol;
    static IsResponse(response: APIResponse): boolean;
    private $?;
    body?: string;
    statusCode?: number;
    headers?: HttpStringMap;
    constructor({ statusCode, headers, body }: APIResponse);
}
