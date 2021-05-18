import * as React from 'react';
import { Pivot, PivotItem } from '@fluentui/react';
import Monitor from '../Monitor/Monitor';
import Requests from '../Requests/Requests';
import Redux from '../Redux/Redux';
import Config from '../Config/Config';
import { PanelChildProps, usePanels } from '../../hooks/usePanels';
import { useLocalStorage } from 'react-use';
import Status from '../Status/Status';
import Preview from '../Preview/Preview';
import Logs from '../Logs/Logs';
import Visual from '../Visual/Visual';
import GlobalSettings from '../GlobalSettings/GlobalSettings';
import classnames from 'classnames';
import cssPrefix from '../prefix';

type TaskManagerProps = {
    defaultPanelId?: string;
    className?: string;
};

export function TaskManager(props: PanelChildProps & TaskManagerProps) {
    const { id, isWide, defaultPanelId } = props;
    const [defaultSelectedKey, setDefaultSelectedKey] = useLocalStorage(`TASK_MANAGER_${id}`, defaultPanelId);

    const onLinkClick = (item?: PivotItem) => {
        setDefaultSelectedKey(item?.props.itemKey);
    };

    const className = classnames(`${cssPrefix}TaskManager-container`, props.className);

    return (
        <Pivot
            className={className}
            overflowBehavior="menu"
            onLinkClick={onLinkClick}
            defaultSelectedKey={defaultSelectedKey}
        >
            <PivotItem headerText="Processes" itemKey="processes">
                <Monitor isWide={isWide} />
            </PivotItem>
            <PivotItem headerText="Requests" itemKey="requests">
                <Requests isWide={isWide} />
            </PivotItem>
            <PivotItem headerText="Redux" itemKey="redux">
                <Redux isWide={isWide} />
            </PivotItem>
            <PivotItem headerText="Endpoints Config" itemKey="endpoints">
                <Config isWide={isWide} />
            </PivotItem>
            <PivotItem headerText="API Status" itemKey="apiStatus">
                <Status isWide={isWide} />
            </PivotItem>
            <PivotItem headerText="Logs" itemKey="logs">
                <Logs isWide={isWide} />
            </PivotItem>
            <PivotItem headerText="Visual" itemKey="visual">
                <Visual isWide={isWide} />
            </PivotItem>
            <PivotItem headerText="Settings" itemKey="settings">
                <GlobalSettings isWide={isWide} />
            </PivotItem>
            <PivotItem headerText="Preview" itemKey="preview">
                <Preview isWide={isWide} />
            </PivotItem>
        </Pivot>
    );
}

export function TaskManagers() {
    const jsx = usePanels(TaskManager);

    return <>{jsx}</>;
}

export default TaskManagers;
