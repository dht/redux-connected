import { uuidv4 } from './uuid';

describe('uuid', () => {
    it('should generate a uuidv4', () => {
        const guid = uuidv4();
        expect(guid.length).toBe(36);
        expect(guid.split('-').length).toBe(5);
    });
});
