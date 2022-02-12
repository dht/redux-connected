import * as React from 'react';
import { CellProps, ColumnAction, Item } from '../../types/types';

type CellActionsProps = CellProps & {
    onActionClick?: (actionId: string, item: Item) => void;
};

export function CellActions(props: CellActionsProps) {
    const { column, item } = props;
    const { key, width, actions = [] } = column;

    function onClick(ev: React.MouseEvent, actionId: string) {
        ev.stopPropagation();
        if (props.onActionClick) {
            props.onActionClick(actionId, item);
        }
    }

    function renderAction(action: ColumnAction) {
        const { id, title, icon } = action;
        return (
            <div className="action" key={id} onClick={(ev) => onClick(ev, id)}>
                <span className="material-icons icon" title={title}>
                    {icon}
                </span>
            </div>
        );
    }

    return (
        <div key={key} className="col actions" style={{ width }}>
            {actions.map((action) => renderAction(action))}
        </div>
    );
}
