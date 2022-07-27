import { ChainablePromise } from './promise';

export class ChainablePromiseDriver {
    private promise: ChainablePromise;
    private mockApi: MockApi;

    constructor() {
        this.promise = new ChainablePromise();
        this.mockApi = new MockApi({ age: 32 });
    }

    get: any = {
        data: () => {
            this.promise.add(this.mockApi.apiGet);
            return this.promise.promise;
        },
    };

    when: any = {
        changeData: (data: any) => {
            this.promise.add(() => this.mockApi.apiSet(data));
            return this;
        },
    };
}

export class MockApi {
    delayGet = 10;
    delaySet = 20;

    constructor(private data = {}) {}

    setData(change: any) {
        this.data = { ...this.data, ...change };
    }

    getData = () => {
        return this.data;
    };

    apiGet = () => {
        return this.delayedInvocation(() => this.getData(), this.delayGet);
    };

    apiSet = (change: any) => {
        return this.delayedInvocation(
            () => this.setData(change),
            this.delaySet
        );
    };

    delayedInvocation = (callback: any, delay: number) =>
        new Promise((resolve) => setTimeout(() => resolve(callback()), delay));
}
