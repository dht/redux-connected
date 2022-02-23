import * as React from 'react';
import Json from '../Json/Json';
import { useSelector } from 'react-redux';
import cssPrefix from '../prefix';
import './Status.scss';
import { connectedSelectors } from '@redux-connected';

type StateProps = {};

export function Status(props: StateProps) {
    const status = useSelector(connectedSelectors.$status);

    return (
        <div className={`${cssPrefix}Status-container`}>
            <Json value={status} />
        </div>
    );
}

export default Status;
