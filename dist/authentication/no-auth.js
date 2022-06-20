"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoAuthentication = void 0;
class NoAuthentication {
    canAuthenticate = NoAuthentication.canAuthenticate;
    authenticate = NoAuthentication.authenticate;
    constructor() { }
    static canAuthenticate() {
        return true;
    }
    static async authenticate() {
        return {
            type: 'Anonymous',
            data: {}
        };
    }
}
exports.NoAuthentication = NoAuthentication;
//# sourceMappingURL=no-auth.js.map