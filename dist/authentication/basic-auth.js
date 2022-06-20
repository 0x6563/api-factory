"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicAuth = void 0;
class BasicAuth {
    config;
    constructor(config) {
        this.config = config;
    }
    canAuthenticate(request) {
        const { authorization } = request.headers;
        return authorization?.toLowerCase().indexOf('basic ') == 0;
    }
    async authenticate(request) {
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
exports.BasicAuth = BasicAuth;
//# sourceMappingURL=basic-auth.js.map