import * as React from 'react';
// import Monitor from '../Monitor/Monitor';
// import Requests from '../Requests/Requests';
// import Redux from '../Redux/Redux';
// import Config from '../Config/Config';
// import Status from '../Status/Status';
// import Preview from '../Preview/Preview';
// import Logs from '../Logs/Logs';
// import Visual from '../Visual/Visual';
// import GlobalSettings from '../GlobalSettings/GlobalSettings';
import { PanelChildProps, usePanels } from '../../hooks/usePanels';
import './TaskManager.scss';

import classnames from 'classnames';
import cssPrefix from '../prefix';

type TaskManagerProps = {
    defaultPanelId?: string;
    className?: string;
};

export function TaskManager(props: PanelChildProps & TaskManagerProps) {
    const className = classnames(
        `${cssPrefix}TaskManager-container`,
        props.className
    );

    return <div className={className}>grid</div>;
}

export function TaskManagers() {
    const jsx = usePanels(TaskManager);

    return <>{jsx}</>;
}

export default TaskManagers;
