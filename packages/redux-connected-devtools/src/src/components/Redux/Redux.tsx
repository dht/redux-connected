import * as React from 'react';
import * as selectors from '../../selectors/selectors';
import classnames from 'classnames';
import Json from '../Json/Json';
import { Action } from 'redux-store-generator';
import { filterReadings } from '../../utils/filter';
import { Reading, useMonitor } from 'redux-connected';
import { useLocalStorage } from 'react-use';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import VirtualList, { VirtualListItemWithEvent, VirtualListRowProps } from '../VirtualList/VirtualList';
import cssPrefix from '../prefix';

type ReduxProps = {
    isWide: boolean;
};

const now = new Date().getTime();

export function Redux(props: ReduxProps) {
    const actionTypes = useSelector(selectors.$actionTypes);

    const [readings] = useMonitor({ monitorState: true });
    // const [showFiltersDialog, toggleFilterDialog] = useBoolean(false);
    const [currentReading, setCurrentReading] = useState<Reading>();
    const [filters] = useLocalStorage<any>('REDUX_FILTERS', {});

    const { isWide } = props;

    const filteredReading = filterReadings(readings, filters || {}, actionTypes);

    function renderList() {
        const height = isWide ? 700 : 288;

        const className = classnames(`${cssPrefix}Redux-list-container`, `${cssPrefix}Rows-container`, {
            wide: isWide,
        });

        return (
            <VirtualList className={className} items={filteredReading} height={height} onClick={setCurrentReading}>
                {ReduxRow}
            </VirtualList>
        );
    }

    function renderDetails() {
        const { action, state } = (currentReading || {}) as Reading;

        return (
            <>
                <div className="action">
                    <label>action</label>
                    <Json value={action} />
                </div>
                <div className="state">
                    <label>state</label>
                    <Json collapsed value={state} />
                </div>
            </>
        );
    }

    function renderFilters() {
        return (
            <div className="filters">
                <input className="search" placeholder="search..."></input>
                {/* <Icon iconName="Filter" className="icon" onClick={toggleFilterDialog} /> */}
            </div>
        );
    }

    const className = classnames(`${cssPrefix}Redux-container`, {
        wide: isWide,
    });

    return (
        <div className={className}>
            <div className="list">
                {/* {showFiltersDialog && (
                    <ReduxSettings onDismiss={toggleFilterDialog} filters={filters} setFilters={setFilters} />
                )} */}
                {renderFilters()}
                {renderList()}
            </div>
            <div className="details">{renderDetails()}</div>
        </div>
    );
}

const ReduxRow = (props: VirtualListRowProps) => {
    const { index } = props;
    const listItem: VirtualListItemWithEvent<Reading> = props.data[index];
    const reading = listItem.item;
    const { action, meta } = reading;
    const { type, payload } = (action as Action) || {};
    const { createdTS, shortId } = meta;

    const className = classnames(`${cssPrefix}Reading-container`, {});

    const delta = ((createdTS - now) / 1000).toFixed(2);

    return (
        <div className={className} style={props.style} onClick={listItem.onClick}>
            <div className="col">
                <div className="row">
                    <div className="type">{type}</div>
                </div>
                <div className="description short">{JSON.stringify(payload)}</div>
            </div>
            <div className="col">
                <div className="timestamp">+{delta}s</div>
                <div className="id">{shortId}</div>
            </div>
        </div>
    );
};

export default Redux;
