import * as React from 'react';
import { useClickAway, useKey } from 'react-use';
import cssPrefix from '../prefix';
import { TaskManager } from '../TaskManager/TaskManager';

type OverlayManagerProps = {
    onClose: () => void;
};

export function OverlayManager(props: OverlayManagerProps) {
    const ref = React.useRef(null);

    useClickAway(ref, props.onClose);
    useKey('Escape', props.onClose);

    return (
        <div className={`${cssPrefix}OverlayManager-container`}>
            <div className="content" ref={ref}>
                <TaskManager defaultPanelId="preview" isWide={false} id="1" className="area area-1" />
                <TaskManager defaultPanelId="redux" isWide={true} id="center" className="area area-center" />
                <TaskManager defaultPanelId="visual" isWide={false} id="2" className="area area-2" />
                <TaskManager defaultPanelId="apiStatus" isWide={false} id="3" className="area area-3" />
                <TaskManager defaultPanelId="requests" isWide={false} id="4" className="area area-4" />
            </div>
        </div>
    );
}

export default OverlayManager;
