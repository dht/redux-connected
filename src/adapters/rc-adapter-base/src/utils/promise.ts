export class ChainablePromise {
    public promise: any;
    private resolve: any;
    // private reject: any;

    constructor() {
        this.promise = new Promise((resolve, _reject) => {
            this.resolve = resolve;
            // this.reject = reject;
        });
    }

    add(callback: any) {
        this.promise = this.promise.then((res: any) => {
            return callback(res);
        });
        this.invoke();

        return this;
    }

    invoke() {
        debounce(() => {
            this.promise = this.promise.catch((err: any) => {
                return err;
            });

            this.resolve(true);
        }, 100);
    }
}

let timeout;

const debounce = (callback: any, delay: number) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        callback();
    }, delay);
};
