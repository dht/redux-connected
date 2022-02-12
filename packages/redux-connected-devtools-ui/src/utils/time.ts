export const ts = () => new Date().getTime();

let start = ts();

export const resetTimestamp = () => (start = ts() - 100);

export const delta = (timestamp: number) =>
    ((timestamp - start) / 1000).toLocaleString('en-US', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
    }) + 's';
