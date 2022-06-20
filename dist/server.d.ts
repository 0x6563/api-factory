/// <reference types="node" />
/// <reference types="node" />
import { Server as HTTPSServer } from 'https';
import { ServerConfig } from './typings';
import { Server as HTTPServer } from 'http';
export declare function Server(config: ServerConfig): Promise<HTTPServer | HTTPSServer>;
