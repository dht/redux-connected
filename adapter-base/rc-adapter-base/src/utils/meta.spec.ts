import { generateMeta, clearMeta } from './meta';
import { Chance } from 'chance';

const chance = new Chance();

jest.mock('./date');

describe('meta', () => {
    it('should generate a meta object', () => {
        const sequence = chance.integer();
        const output = generateMeta(sequence);
        expect(output.id.length).toEqual(36);
        expect(output.shortId.length).toEqual(4);
        expect(output.sequence).toEqual(sequence);
        expect(output.createdTS).toEqual(100);
    });

    it('should clear a meta object', () => {
        const metaObject = {
            meta: generateMeta(1),
            originalAction: {},
        };

        const output = clearMeta(metaObject);
        expect(output).toEqual({});
    });
});
