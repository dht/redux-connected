import React from 'react';
import './Chalk.scss';
import classnames from 'classnames';

type ChalkProps = {
    children: string;
};

const CHALK_REGEX = /\u001b\[([0-9]{2,3})m/gi;
const CHALK_SPLIT_REGEX = /\u001b\[[0-9]{2,3}m/gi;

// \u001b[2K\u001b[1G\u001b[2m[4/4]\u001b[22m Building fresh packages.
export function Chalk(props: ChalkProps) {
    const parts = parseColorText(props.children);

    function renderLine(line: string, index: number) {
        return <React.Fragment key={index}>{line}</React.Fragment>;
    }

    function renderPart(part: IColorText, index: number) {
        const className = classnames('part', part.color);

        const lines = part.value.split('\n');

        const showBr = lines.length >= 2;

        return (
            <span key={index} className={className}>
                {lines.map((line, index2) => renderLine(line, index2))}
                {showBr && <br />}
            </span>
        );
    }

    function renderParts() {
        return parts.map((part, index: number) => renderPart(part, index));
    }

    return <div className="Chalk-container">{renderParts()}</div>;
}

type IRegexMatch = {
    index: number;
    value: string;
};

type IColorText = {
    index: number;
    value: string;
    colorRaw: string;
    color: string;
};

const colorMap: Record<string, string> = {
    '31': 'red',
    '32': 'green',
    '33': 'yellow',
    '34': 'blue',
    '35': 'magenta',
    '36': 'cyan',
    '37': 'white',
    '41': 'bg red',
    '42': 'bg green',
    '43': 'bg yellow',
    '44': 'bg blue',
    '45': 'bg magenta',
    '46': 'bg cyan',
    '47': 'bg white',
    '90': 'light red',
    '91': 'light green',
    '92': 'light yellow',
    '93': 'light blue',
    '94': 'light blue',
    '95': 'light magenta',
    '96': 'light cyan',
    '97': 'light white',
    '100': 'bg light gray',
    '101': 'bg light red',
    '102': 'bg light green',
    '103': 'bg light yellow',
    '104': 'bg light blue',
    '105': 'bg light magenta',
    '106': 'bg light cyan',
    '107': 'bg light white',
};

// children: "\u001b[2K\u001b[1G\u001b[34minfo\u001b[39m Direct dependencies\n"

function exec(regex: RegExp, text: string): IRegexMatch[] {
    let matches,
        output = [];

    let fixIndex = 0;

    while ((matches = regex.exec(text))) {
        output.push({
            index: matches.index - fixIndex,
            value: matches[1],
        });

        fixIndex += 5;
    }

    return output;
}

function convertUnicode(input: string) {
    return input.replace(/\\u[0-9a-fA-F]{4}/g, function (a, b) {
        var charcode = parseInt(b, 16);
        return String.fromCharCode(charcode);
    });
}

function parseColorText(text: string) {
    text = text
        .replace(/\u001b\[2K/g, '')
        .replace(/\u001b\[2m/g, '')
        .replace(/\u001b\[1G/g, '');

    const matches = exec(CHALK_REGEX, text).filter(
        (m) => m.value !== '39' && m.value !== '49'
    );
    let length = 0;

    return text
        .split(CHALK_SPLIT_REGEX)
        .filter((i) => i)
        .reduce((output, part) => {
            const index = length;
            const match: IRegexMatch | undefined = matches.find(
                (m) => m.index === index
            );

            const { value: colorRaw = '39' } = match || {};
            const color = colorMap[colorRaw] || '';

            output.push({
                index,
                value: part,
                colorRaw,
                color,
            });

            length += part.length;
            return output;
        }, [] as IColorText[]);
}

export default Chalk;
