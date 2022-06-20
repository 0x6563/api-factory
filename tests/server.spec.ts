import { expect } from "chai";
import { before } from "mocha";
import { MockServer } from "./mock.server";

describe('Mock Server', async () => {
    const BASEURL = 'http://localhost:80'

    before(async () => {
        await MockServer;
    })

    after(async () => {
        (await MockServer).close();
    })

    it('List empty db', async () => {
        const response = await fetch(`${BASEURL}/db`, { method: 'GET' });
    })

    it('Create item', async () => {
        const response = await fetch(`${BASEURL}/db`, { method: 'PUT', body: 'My Create Test' });
    })

    it('List item', async () => {
        await fetch(`${BASEURL}/db`, { method: 'PUT', body: 'My List Test' });
        const response = await fetch(`${BASEURL}/db`, { method: 'GET' });
        expect((await response.json()).length).greaterThan(0);
    })

    it('Read item', async () => {
        const insert = await fetch(`${BASEURL}/db`, { method: 'PUT', body: 'My Read Test' });
        const id = await insert.text();
        const response = await fetch(`${BASEURL}/db/${id}`, { method: 'GET' });
        expect(await response.text()).equals('My Read Test');
    })

    it('Update item', async () => {
        const insert = await fetch(`${BASEURL}/db`, { method: 'PUT', body: 'My Update Test' });
        const id = await insert.text();
        await fetch(`${BASEURL}/db/${id}`, { method: 'POST', body: 'My Update Test (Updated)' });

        const response = await fetch(`${BASEURL}/db/${id}`, { method: 'GET' });
        expect(await response.text()).equals('My Update Test (Updated)');
    })

    it('Delete item', async () => {
        const insert = await fetch(`${BASEURL}/db`, { method: 'PUT', body: 'My Delete Test' });
        const id = await insert.text();
        const response = await fetch(`${BASEURL}/db/${id}`, { method: 'GET' });
        expect(await response.text()).equals('My Delete Test');
        await fetch(`${BASEURL}/db/${id}`, { method: 'DELETE' });
        const deleted = await fetch(`${BASEURL}/db/${id}`, { method: 'GET' });
        expect(await deleted.text()).empty;
    })

    it('Get User Failed', async () => {
        const response = await fetch(`${BASEURL}/user`, { method: 'GET' });
        expect(await response.text()).equals('Not Authorized');
    })

    it('Get User', async () => {
        const response = await fetch(`${BASEURL}/user`, { method: 'GET', headers: { Authorization: 'Basic bWU6c2VjcmV0' } });
        expect(await response.text()).equals(`{"type":"Basic","data":{"username":"me"}}`);
    })

})