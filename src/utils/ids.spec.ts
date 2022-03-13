import { generateIds, clearIds } from './ids';
import { Chance } from 'chance';

const chance = new Chance();

jest.mock('./date');

describe('ids', () => {
    it('should generate a ids object', () => {
        const sequence = chance.integer();
        const output = generateIds(sequence);
        expect(output.id.length).toEqual(36);
        expect(output.shortId.length).toEqual(4);
        expect(output.sequence).toEqual(sequence);
        expect(output.createdTS).toEqual(100);
    });

    it('should clear a ids object', () => {
        const idsObject = {
            meta: generateIds(1),
            originalAction: {},
        };

        const output = clearIds(idsObject);
        expect(output).toEqual({});
    });
});
