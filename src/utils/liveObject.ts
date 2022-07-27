type OnChangeCallback<T> = (change: Partial<T>) => void;

export const createLiveObject = <T>(
    object: T,
    onChange?: OnChangeCallback<T>
) => {
    const handler = {
        get: (_target: any, key: string) => {
            if (key in _target) {
                return _target[key];
            }
        },
        set: (_target: any, key: string, value: any) => {
            _target[key] = value;

            if (onChange) {
                const change = { [key]: value } as Partial<T>;
                onChange(change);
            }

            return true;
        },
    };

    return new Proxy(object, handler);
};
