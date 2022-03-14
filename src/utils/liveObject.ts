export class LiveObject<T> {
    constructor() {}

    setField(field: keyof T, value: any) {}

    getField(field: keyof T) {}

    patch(change: T) {}
}
