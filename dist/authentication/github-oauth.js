"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubOAuth = void 0;
class GitHubOAuth {
    config;
    prefix = '';
    constructor(config) {
        this.config = config;
        this.prefix = config.prefix || 'GitHub ';
    }
    canAuthenticate(request) {
        if (this.config.canAuthenticate) {
            return this.config.canAuthenticate(request);
        }
        const { authorization } = request.headers;
        return authorization?.indexOf(this.prefix) == 0;
    }
    async authenticate(request) {
        const code = this.getCode(request);
        const url = `https://github.com/login/oauth/access_token?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&code=${code}`;
        const response = await fetch(url, { method: 'POST' });
        const token = (await response.text()).replace(/^.*(gho[^&]+)&.*$/, 'token $1');
        const g = await fetch('https://api.github.com/user', { headers: { 'Authorization': token } });
        const user = await g.json();
        if (!(user?.id))
            return;
        return {
            type: 'GitHub',
            data: user
        };
    }
    getCode(request) {
        if (this.config.getCode) {
            return this.config.getCode(request);
        }
        const { authorization } = request.headers;
        const i = authorization.indexOf(' ');
        return authorization.substring(i + 1);
    }
}
exports.GitHubOAuth = GitHubOAuth;
//# sourceMappingURL=github-oauth.js.map