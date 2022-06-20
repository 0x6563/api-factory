import { APIAuthentication } from "../typings";
export declare class NoAuthentication implements APIAuthentication {
    canAuthenticate: typeof NoAuthentication.canAuthenticate;
    authenticate: typeof NoAuthentication.authenticate;
    constructor();
    static canAuthenticate(): boolean;
    static authenticate(): Promise<AnonymousUser>;
}
export interface AnonymousUser {
    type: "Anonymous";
    data: {};
}
