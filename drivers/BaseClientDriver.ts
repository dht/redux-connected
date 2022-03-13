import { ChainablePromise } from '../src/adapters/utils/promise';

export class BaseClientDriver {
    private promise: ChainablePromise;
    given: any;
    when: any;
    get: any;

    constructor() {
        this.promise = new ChainablePromise();
    }

    wrap = (callback) => {
        this.promise.add(callback);
        return this;
    };

    wrapP = async (callback) => {
        try {
            this.promise.add(callback);
            const response = await this.promise.promise;
            return response;
        } catch (err: any) {
            return err.message;
        }
    };

    wrapProxy = (variableName: string, wrapperMethod: any) => {
        this[variableName] = new Proxy(this[variableName], {
            get: (oTarget, sKey) => {
                return (...args) => {
                    const callback = () => oTarget[sKey].apply(this, args);
                    return wrapperMethod(callback);
                };
            },
        });
    };

    init() {
        this.wrapProxy('given', this.wrapP);
        this.wrapProxy('get', this.wrapP);
        this.wrapProxy('when', this.wrap);
    }
}
