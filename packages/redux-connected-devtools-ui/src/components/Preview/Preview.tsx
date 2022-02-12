import * as React from 'react';
import Json from '../Json/Json';
import { Action } from 'redux-store-generator';
import { clearMeta, clearActionP } from '@redux-connected';
import {
    Log,
    ActionWithPromise,
    ApiRequest,
    Reading,
    SagaState,
} from 'redux-connected-types';

import cssPrefix from '../prefix';
import { useMonitor } from '../../hooks/useMonitor';
import './Preview.scss';

export type PreviewType = 'request' | 'log' | 'process';

type PreviewItem = ApiRequest | Log | SagaState;

export type PreviewAction = Action & {
    type: 'PREVIEW';
    payload: {
        item: PreviewItem;
        previewType: PreviewType;
    };
};

export const preview = (
    item: PreviewItem,
    previewType: PreviewType
): PreviewAction => ({
    type: 'PREVIEW',
    payload: {
        item,
        previewType,
    },
});

type PreviewProps = {};

export function Preview(props: PreviewProps) {
    const [previews] = useMonitor(
        { onlyLast: true },
        (action: Action) => action.type === 'PREVIEW'
    );

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

    return (
        <div className={`${cssPrefix}Preview-container`}>
            {renderInner(previews[0])}
        </div>
    );
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
