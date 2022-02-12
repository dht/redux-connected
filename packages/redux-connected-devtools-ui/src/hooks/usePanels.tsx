import * as React from 'react';
import { Panel } from '../components/Panel/Panel';
import { useCallback, useEffect, useMemo } from 'react';
import { useList, useLocalStorage, useKey } from 'react-use';
import { loadPanelsArrangement } from '../utils/localStorage';

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
            var r = (Math.random() * 16) | 0,
                v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
}

export interface PanelState {
    guid: string;
}

export interface PanelChildProps {
    id: string;
}

export function usePanels(Cmp: (props: any) => JSX.Element) {
    const [savedList, setSavedList] = useLocalStorage<PanelState[]>(
        'PANELS_STATE',
        []
    );
    const [list, { push, updateAt, removeAt }] = useList<PanelState>(savedList);

    useEffect(() => {
        setSavedList(list);
    }, [list, setSavedList]);

    useKey('`', (ev) => {
        if (ev.ctrlKey) {
            loadPanelsArrangement();
        } else {
            add();
        }
    });

    const add = useCallback(() => {
        const guid = uuidv4();
        push({ guid });
    }, [push]);

    const remove = useCallback(
        (guid: string) => {
            const index = list.findIndex((item) => item.guid === guid);
            removeAt(index);
        },
        [removeAt, list]
    );

    const onToggleSize = useCallback(
        (guid: string) => {
            const index = list.findIndex((item) => item.guid === guid);
            const updatedItem = { ...list[index] };
            updateAt(index, updatedItem);
        },
        [list, updateAt]
    );

    const fullJsx = useMemo(
        () => (
            <>
                {list.map((panelState: PanelState) => (
                    <Panel
                        id={panelState.guid}
                        key={panelState.guid}
                        onToggleSize={() => onToggleSize(panelState.guid)}
                        onNew={add}
                        onClose={() => remove(panelState.guid)}
                        showDuplicate={true}
                        showLock={true}
                    >
                        <Cmp id={panelState.guid} />
                    </Panel>
                ))}
            </>
        ),
        [list, Cmp, add, remove, onToggleSize]
    );

    return fullJsx as JSX.Element;
}
