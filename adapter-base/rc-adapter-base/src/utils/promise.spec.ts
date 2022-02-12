import { ChainablePromiseDriver } from './promise.driver';

describe('ChainablePromise', () => {
    let driver;

    beforeAll(() => {
        driver = new ChainablePromiseDriver();
    });

    it('one async callback', async () => {
        expect(await driver.get.data()).toEqual({ age: 32 });
    });

    it('two async callbacks', async () => {
        const name = 'james';
        expect(await driver.when.changeData({ name }).get.data()).toEqual({
            name,
            age: 32,
        });
    });
});
