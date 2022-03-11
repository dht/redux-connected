import { Json } from 'redux-store-generator';
import { Meta } from '../types';
import { timestamp } from './date';
import { uuidv4 } from './uuid';

export const generateMeta = (sequence: number): Meta => {
    const uuid = uuidv4();

    return {
        id: uuid,
        shortId: uuid.substr(uuid.length - 4),
        createdTS: timestamp(),
        sequence,
    };
};

export const clearMeta = (json: Json): Json => {
    const output = { ...json };
    delete output['meta'];
    delete output['originalAction'];
    return output;
};
