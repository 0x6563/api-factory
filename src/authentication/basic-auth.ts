import { APIRequest } from "../server";
import { APIAuthentication,  Promiseable } from "../typings";

export class BasicAuth<T> implements APIAuthentication {

    constructor(private config: {
        authenticate: (user: string, password: string) => Promiseable<T>
    }) { }

    canAuthenticate(request: APIRequest) {
        const { authorization } = request.headers;
        return authorization?.toLowerCase().indexOf('basic ') == 0;
    }

    async authenticate(request: APIRequest): Promise<BasicAuthUser<T> | undefined> {
        const { authorization } = request.headers;
        const b64 = authorization.split(' ')[1];
        const value = Buffer.from(b64, 'base64').toString();
        const i = value.indexOf(':');
        const username = value.substring(0, i);
        const password = value.substring(i + 1);
        const data = await this.config.authenticate(username, password);

        return data ? { type: 'Basic', data } : undefined;
    }
}

export interface BasicAuthUser<T> {
    type: "Basic",
    data: T;
}