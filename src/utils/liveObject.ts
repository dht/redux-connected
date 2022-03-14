type OnChangeCallback<T> = (change: Partial<T>) => void;

export class LiveObject<T> {
    constructor(private item: T, private onChange?: OnChangeCallback<T>) {
        const handler = {
            get: (_target: any, key: string) => {
                if (key in this.item) {
                    return this.getField(key as keyof T);
                }
            },
            set: (_target: any, key: string, value: any) => {
                return this.setField(key as keyof T, value);
            },
        };

        return new Proxy(this, handler);
    }

    setField(field: keyof T, value: any) {
        this.item[field] = value;

        if (this.onChange) {
            const change = { [field]: value } as Partial<T>;
            this.onChange(change);
        }

        return true;
    }

    getField(field: keyof T) {
        return this.item[field];
    }
}
