import { API, Server, BasicAuth } from "../src";

class CRUD {
    private id: number = 0;
    private table: { [key: string]: any } = Object.create(null);
    constructor() { }

    create(data: any) {
        const id = this.id++;
        this.table[(id).toString()] = data;
        return id;
    }

    read(id: string) {
        return this.table[id];
    }

    update(id: string, data: any) {
        this.table[id] = data;
    }

    delete(id: string) {
        delete this.table[id];
    }

    list() {
        return Object.keys(this.table)
    }

}

export const MockDatabase = new CRUD();

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
