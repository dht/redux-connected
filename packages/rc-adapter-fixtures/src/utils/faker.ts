const faker = require('faker');
const { format } = require('date-fns');

function interpolate(dataPath) {
    return faker.fake(`{{${dataPath}}}`);
}

const parsers = {
    $i: (value) => value,
    'commerce.price': (value) => parseFloat(value),
    'date.soon': (value) => new Date(value).getTime(),
    'datatype.boolean': (value) => value === 'true',
    'datatype.number': (value) => parseInt(value, 10),
    '/^date./': (value) => format(new Date(value), 'yyyy-MM-dd HH:mm:ss'),
};

const parseRegex = (string = '') => {
    const output = {
        isRegex: false,
        value: string,
    };

    if (string.match(/^\/.+\/$/)) {
        output.isRegex = true;
        output.value = string.replace(/^\//, '').replace(/\/$/, '');
    }

    return output;
};

const findParser = (path) => {
    const parserKey = Object.keys(parsers).find((key) => {
        const regexCheck = parseRegex(key);

        if (!regexCheck.isRegex) {
            return path === key;
        } else {
            const regex = new RegExp(regexCheck.value);
            return path.match(regex);
        }
    });

    return parsers[parserKey || '$i'];
};

function generateSingleFromMap(map, parentId?) {
    return Object.keys(map).reduce((output, fieldName) => {
        const path = map[fieldName];

        if (!Array.isArray(path)) {
            const value = path !== ':parentId' ? interpolate(path) : parentId;
            const parser = findParser(path);
            output[fieldName] = parser(value);
        } else {
            output[fieldName] = generateManyFromMap(
                path[0],
                path.length,
                output['id']
            );
        }

        return output;
    }, {});
}

function generateManyFromMap(map, count, parentId?) {
    return [...new Array(count)].map(() =>
        generateSingleFromMap(map, parentId)
    );
}

export function generateFromMap(map, count?): any {
    if (!count) {
        return generateSingleFromMap(map);
    } else {
        return generateManyFromMap(map, count);
    }
}

export type ParentAndChildren<T, P> = {
    rootItems: T[];
    children: P[];
};

export function splitDeepStructure<T, P>(
    data,
    childKey = 'items'
): ParentAndChildren<T, P> {
    const children = data.reduce((output, item) => {
        output.push(...(item[childKey] || []));
        return output;
    }, []);

    const rootItems = data.map((item) => {
        delete item[childKey];
        return item;
    });

    return {
        rootItems,
        children,
    };
}
