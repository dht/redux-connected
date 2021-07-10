import * as React from 'react';
import ReactJson from 'react-json-view';
import cssPrefix from '../prefix';

type JsonProps = {
    value: any;
    collapsed?: boolean;
};

export function Json(props: JsonProps) {
    const { value, collapsed } = props;

    return (
        <div className={`${cssPrefix}Json-container`}>
            <ReactJson
                src={value}
                collapsed={collapsed}
                enableClipboard={false}
                displayObjectSize={false}
                displayDataTypes={false}
                theme={'monokai'}
            />
        </div>
    );
}

export default Json;
