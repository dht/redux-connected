import * as React from 'react';
import classnames from 'classnames';
import Json from '../Json/Json';
import * as selectors from '../../selectors/selectors';
import { useSelector } from 'react-redux';
import cssPrefix from '../prefix';

type StateProps = {
    isWide: boolean;
};

export function Status(props: StateProps) {
    const { isWide } = props;
    const status = useSelector(selectors.$status);

    const className = classnames(`${cssPrefix}Status-container`, {
        wide: isWide,
    });

    return (
        <div className={className}>
            <Json value={status} />
        </div>
    );
}

export default Status;
