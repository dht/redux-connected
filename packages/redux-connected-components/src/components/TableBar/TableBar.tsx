import * as React from 'react';
import cssPrefix from '../prefix';

type TableBarProps = {
    search: string;
    onSearch: (search: string) => void;
    onToggleFilter: () => void;
    onNew: () => void;
};

export function TableBar(props: TableBarProps) {
    const { search } = props;

    function onSearch(ev: React.ChangeEvent<HTMLInputElement>) {
        props.onSearch(ev.target.value);
    }

    return (
        <div className={`${cssPrefix}TableBar-container`}>
            <div className="search">
                <span className="material-icons">search</span>
                <input placeholder="search..." value={search} onChange={onSearch}></input>
            </div>
            <div className="actions">
                <button onClick={props.onToggleFilter}>
                    <span className="material-icons">filter_alt</span>
                </button>
                <button onClick={props.onNew}>
                    <span className="material-icons">add</span>
                </button>
            </div>
        </div>
    );
}

export default TableBar;
