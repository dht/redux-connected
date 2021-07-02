import * as React from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import classnames from 'classnames';
import { useLocalStorage } from 'react-use';
import cssPrefix from '../prefix';

interface PanelProps {
    id: string;
    children: JSX.Element;
    onClose?: () => void;
    onNew?: () => void;
    onToggleSize?: (isWide: boolean) => void;
    isWide?: boolean;
    showDuplicate?: boolean;
    showLock?: boolean;
    zIndex?: number;
}

export function Panel(props: PanelProps) {
    const { id, isWide, zIndex } = props;
    const draggableRef = React.useRef(null); // https://stackoverflow.com/a/63603903

    const [offset, setOffset, clearLocalStoragePosition] = useLocalStorage(`PANEL_OFFSET_${id}`, { x: 0, y: 0 });

    const className = classnames(`${cssPrefix}Panel-container`, {
        wide: isWide,
    });

    const right = 100;
    const bottom = 20;
    const docWidth = document.documentElement.clientWidth;
    const docHeight = document.documentElement.clientHeight;
    const boxWidth = isWide ? 750 : 350;
    const boxHeight = isWide ? 800 : 390;
    const corners = {
        left: docWidth - boxWidth - right,
        top: docHeight - boxHeight - bottom,
    };

    const bounds = {
        top: -corners.top,
        left: -corners.left,
        right,
        bottom,
    };

    const handler = isWide ? undefined : '.handler';

    function onStop(_ev: DraggableEvent, data: DraggableData) {
        const { x, y } = data;
        setOffset({ x, y });
    }

    function onClose() {
        clearLocalStoragePosition();

        if (props.onClose) {
            props.onClose();
        }
    }

    return (
        <Draggable nodeRef={draggableRef} handle={handler} bounds={bounds} onStop={onStop} defaultPosition={offset}>
            <div ref={draggableRef} className={className} style={{ zIndex }}>
                <div className="handler">
                    <div className="close" onClick={onClose}>
                        X
                    </div>
                </div>
                {props.children}
            </div>
        </Draggable>
    );
}

export default Panel;
