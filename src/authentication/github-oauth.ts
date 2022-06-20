import { APIRequest } from "../server";
import { APIAuthentication } from "../typings";

export class GitHubOAuth implements APIAuthentication {
    private prefix = '';
    constructor(private config: {
        clientId: string;
        clientSecret: string;
        prefix?: string;
        getCode?: (request: APIRequest) => string;
        canAuthenticate?: (request: APIRequest) => boolean;
    }) {
        this.prefix = config.prefix || 'GitHub ';
    }

    canAuthenticate(request: APIRequest) {
        if (this.config.canAuthenticate) {
            return this.config.canAuthenticate(request);
        }
        const { authorization } = request.headers;
        return authorization?.indexOf(this.prefix) == 0;
    }

    async authenticate(request: APIRequest): Promise<GitHubOAuthUser | undefined> {
        const code = this.getCode(request);
        const url = `https://github.com/login/oauth/access_token?client_id=${this.config.clientId}&client_secret=${this.config.clientSecret}&code=${code}`;
        const response = await fetch(url, { method: 'POST' });
        const token = (await response.text()).replace(/^.*(gho[^&]+)&.*$/, 'token $1');
        const g = await fetch('https://api.github.com/user', { headers: { 'Authorization': token } });
        const user = await g.json();
        if (!user)
            return;
        return {
            type: 'GitHub' as const,
            data: user
        }
    }

    private getCode(request: APIRequest) {
        if (this.config.getCode) {
            return this.config.getCode(request);
        }
        const { authorization } = request.headers;
        const i = authorization.indexOf(' ');
        return authorization.substring(i + 1);
    }

}

export interface GitHubOAuthUser {
    type: 'GitHub',
    data: {
        "login": string;
        "id": number;
        "avatar_url": string;
        "gravatar_id": string;
        "url": string;
        "html_url": string;
        "followers_url": string;
        "following_url": string;
        "gists_url": string;
        "starred_url": string;
        "subscriptions_url": string;
        "organizations_url": string;
        "repos_url": string;
        "events_url": string;
        "received_events_url": string;
        "type": string;
        "site_admin": boolean;
        "name": string;
        "company": string;
        "blog": string;
        "location": string;
        "email": string;
        "hireable": boolean;
        "bio": string;
        "twitter_username": string;
        "public_repos": number;
        "public_gists": number;
        "followers": number;
        "following": number;
        "created_at": string;
        "updated_at": string;
        "private_gists": string;
        "total_private_repos": number;
        "owned_private_repos": number;
        "disk_usage": number;
        "collaborators": number;
        "two_factor_authentication": number;
        "plan": {
            "name": string;
            "space": number;
            "collaborators": number;
            "private_repos": number;
        }
    }
}