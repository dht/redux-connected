import * as React from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { useLocalStorage } from 'react-use';
import cssPrefix from '../prefix';
import './Panel.scss';

interface PanelProps {
    id: string;
    children: JSX.Element;
    onClose?: () => void;
    onNew?: () => void;
    onToggleSize?: () => void;
    showDuplicate?: boolean;
    showLock?: boolean;
    zIndex?: number;
}

export function Panel(props: PanelProps) {
    const { id, zIndex } = props;
    const draggableRef = React.useRef(null); // https://stackoverflow.com/a/63603903

    const [offset, setOffset, clearLocalStoragePosition] = useLocalStorage(
        `PANEL_OFFSET_${id}`,
        { x: 0, y: 0 }
    );

    const right = 100;
    const bottom = 20;
    const docWidth = document.documentElement.clientWidth;
    const docHeight = document.documentElement.clientHeight;
    const boxWidth = 750;
    const boxHeight = 800;
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
        <Draggable
            nodeRef={draggableRef}
            bounds={bounds}
            onStop={onStop}
            defaultPosition={offset}
        >
            <div
                ref={draggableRef}
                className={`${cssPrefix}Panel-container`}
                style={{ zIndex }}
            >
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
