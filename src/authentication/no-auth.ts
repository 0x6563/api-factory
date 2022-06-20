import { APIAuthentication } from "../typings";

export class NoAuthentication implements APIAuthentication {
    canAuthenticate = NoAuthentication.canAuthenticate;
    authenticate = NoAuthentication.authenticate;

    constructor() { }

    static canAuthenticate() {
        return true;
    }

    static async authenticate(): Promise<AnonymousUser> {
        return {
            type: 'Anonymous',
            data: {}
        }
    }
}

export interface AnonymousUser {
    type: "Anonymous";
    data: {}
}