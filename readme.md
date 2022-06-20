# API Factory

## Description
API Factory's primary goal is to create a quick and easy way to host APIs.

## Example
Below is an example copied from `mock.server.ts`

```TypeScript
import { API, Server, BasicAuth } from "api-factory";
import { MockDatabase } from "./mockdatabase";

const basicAuth = new BasicAuth({ authenticate: (username, password) => username == 'me' && password == 'secret' ? { username } : null });
const User = API.Factory({ authentication: [basicAuth], }, ({ user }) => user);
const Create = API.Factory({}, ({ body }) => MockDatabase.create(body));
const List = API.Factory({}, () => MockDatabase.list());
const Read = API.Factory({}, ({ pathParameters }) => MockDatabase.read(pathParameters.id));
const Update = API.Factory({}, ({ pathParameters, body }) => MockDatabase.update(pathParameters.id, body));
const Delete = API.Factory({}, ({ pathParameters }) => MockDatabase.delete(pathParameters.id));

export const MockServer =
  Server({
        port: 80,
        cors: true,
        routes: [
            {
                id: 'create',
                method: ['PUT'],
                path: '/db',
                handler: Create
            }, {
                id: 'list',
                method: ['GET'],
                path: '/db',
                handler: List
            }, {
                id: 'read',
                method: ['GET'],
                path: '/db/:id',
                handler: Read
            }, {
                id: 'update',
                method: ['POST'],
                path: '/db/:id',
                handler: Update
            }, {
                id: 'delete',
                method: ['DELETE'],
                path: '/db/:id',
                handler: Delete
            }, {
                id: 'user',
                method: ['GET'],
                path: '/user',
                handler: User
            }, {
                id: '*',
                method: ['ALL'],
                path: '*',
                handler: API.Factory({}, ({ path }) => `Not Found: ${path}`)
            }
        ]
    });

```