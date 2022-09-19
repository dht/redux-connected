import faker from '@faker-js/faker';
import { createLiveObject } from './liveObject';
import { jest } from '@jest/globals';

describe('liveObject', () => {
    let person: Person, liveObject: Person, callback: any;

    beforeEach(() => {
        person = {
            id: faker.datatype.uuid(),
            name: faker.name.findName(),
        };

        callback = jest.fn();
        liveObject = createLiveObject<Person>(person, callback) as any;
    });

    it('get', () => {
        expect(liveObject.id).toEqual(person.id);
        expect(liveObject.name).toEqual(person.name);
    });

    it('get (non-organic)', () => {
        // @ts-ignore
        expect(liveObject.id2).toEqual(undefined);
    });

    it('set', () => {
        const newId = faker.datatype.uuid();
        liveObject.id = newId;
        expect(liveObject.id).toEqual(newId);
    });

    it('set (non-organic)', () => {
        const newId = faker.datatype.uuid();
        // @ts-ignore
        liveObject.id2 = newId;
        // @ts-ignore
        expect(liveObject.id2).toEqual(newId);
    });

    it('callback', () => {
        const newId = faker.datatype.uuid();
        liveObject.id = newId;
        expect(callback).toHaveBeenLastCalledWith({ id: newId });
    });
});

export type Person = {
    id: string;
    name: string;
};
