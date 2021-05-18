import { timestamp } from './date';

describe('date', () => {
    it('should create a timestamp', () => {
        const output = timestamp();
        expect(typeof output).toEqual('number');
    });
});
