import * as React from 'react';
import classnames from 'classnames';
import Json from '../Json/Json';
import { Action } from 'redux-store-generator';
import { Log, ActionWithPromise } from 'redux-connected';
import { ApiRequest, clearMeta, clearActionP, Reading, SagaState, useMonitor } from 'redux-connected';
import cssPrefix from '../prefix';

export type PreviewType = 'request' | 'log' | 'process';

type PreviewItem = ApiRequest | Log | SagaState;

export type PreviewAction = Action & {
    type: 'PREVIEW';
    payload: {
        item: PreviewItem;
        previewType: PreviewType;
    };
};

export const preview = (item: PreviewItem, previewType: PreviewType): PreviewAction => ({
    type: 'PREVIEW',
    payload: {
        item,
        previewType,
    },
});

type PreviewProps = {
    isWide: boolean;
};

export function Preview(props: PreviewProps) {
    const { isWide } = props;
    const [previews] = useMonitor({ onlyLast: true }, (action: Action) => action.type === 'PREVIEW');

    function renderInner(reading: Reading) {
        if (!reading) {
            return <NoPreview />;
        }

        const { payload } = reading.action as PreviewAction;
        const { item, previewType } = payload || {};

        switch (previewType) {
            case 'request':
                return <PreviewRequest item={item} />;
            case 'log':
                return <PreviewLog item={item} />;
            case 'process':
                return <PreviewProcess item={item} />;
        }
    }

    const className = classnames(`${cssPrefix}Preview-container`, {
        wide: isWide,
    });

    return <div className={className}>{renderInner(previews[0])}</div>;
}

function NoPreview() {
    return <div className={`${cssPrefix}NoPreview-container`}>No preview</div>;
}

type PreviewDetailsProps = {
    item: PreviewItem;
};

function PreviewRequest(props: PreviewDetailsProps) {
    const { item } = props;

    let data = clearMeta(item);
    data = clearActionP(data as ActionWithPromise);

    return (
        <div className={`${cssPrefix}PreviewRequest-container`}>
            <Json value={data}></Json>
        </div>
    );
}

function PreviewLog(props: PreviewDetailsProps) {
    const { item } = props;

    const data = clearMeta(item);

    return (
        <div className={`${cssPrefix}PreviewLog-container`}>
            <Json value={data}></Json>
        </div>
    );
}

function PreviewProcess(props: PreviewDetailsProps) {
    const { item } = props;

    const data = clearMeta(item);

    return (
        <div className={`${cssPrefix}PreviewLog-container`}>
            <Json value={data}></Json>
        </div>
    );
}

export default Preview;
