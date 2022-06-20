import { APIAuthentication, APIRequest, Promiseable } from "../typings";
export declare class BasicAuth<T> implements APIAuthentication {
    private config;
    constructor(config: {
        authenticate: (user: string, password: string) => Promiseable<T>;
    });
    canAuthenticate(request: APIRequest): boolean;
    authenticate(request: APIRequest): Promise<BasicAuthUser<T> | undefined>;
}
export interface BasicAuthUser<T> {
    type: "Basic";
    data: T;
}
