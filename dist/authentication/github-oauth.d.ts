import { APIRequest } from "../server";
import { APIAuthentication } from "../typings";
export declare class GitHubOAuth implements APIAuthentication {
    private config;
    private prefix;
    constructor(config: {
        clientId: string;
        clientSecret: string;
        prefix?: string;
        getCode?: (request: APIRequest) => string;
        canAuthenticate?: (request: APIRequest) => boolean;
    });
    canAuthenticate(request: APIRequest): boolean;
    authenticate(request: APIRequest): Promise<GitHubOAuthUser | undefined>;
    private getCode;
}
export interface GitHubOAuthUser {
    type: 'GitHub';
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
        };
    };
}
