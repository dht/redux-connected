import { timestamp } from './date';
import { uuidv4 } from './uuid';

export const generateIds = (sequence: number) => {
    const uuid = uuidv4();

    return {
        id: uuid,
        shortId: uuid.substr(uuid.length - 4),
        createdTS: timestamp(),
        sequence,
    };
};

export const clearIds = (json: Json): Json => {
    const output = { ...json };
    delete output['meta'];
    delete output['originalAction'];
    return output;
};
