import React from 'react';
import { useList, useMount } from 'react-use';
import { on } from 'super0/lib/sockets';
import Chalk from '../Chalk/Chalk';
import './Log.scss';

type LogProps = {};

export function Log(props: LogProps) {
    const [lines, { push }] = useList<string>([]);

    useMount(() => {
        setTimeout(() => {
            on('log', (data: any) => {
                push(data.line);
            });
        });
    });

    function renderLine(line: string, index: number) {
        return (
            <div key={index} className="line">
                <Chalk>{line}</Chalk>
            </div>
        );
    }

    function renderLines() {
        return lines.map((line, index: number) => renderLine(line, index));
    }

    return (
        <div className="Log-container">
            <div className="inner">{renderLines()}</div>
        </div>
    );
}

export default Log;
