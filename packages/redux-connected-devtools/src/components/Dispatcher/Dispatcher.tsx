import * as React from 'react';
import Group from '../Group/Group';
import classnames from 'classnames';
import { generateActionsForStore, NodeType } from 'redux-store-generator';
import * as dispatcherActions from '../../data/dispatcherActions';
import { ActionParams } from '../../data/dispatcherActions';
import { useSetState } from 'react-use';
import { analyzeStructure } from 'redux-store-generator';
import Panel from '../Panel/Panel';
import { useDispatch } from 'react-redux';
import cssPrefix from '../prefix';

type DispatcherProps = {
    storeState: any;
    isWide?: boolean;
    onClose?: () => void;
};

export function Dispatcher(props: DispatcherProps) {
    const dispatch = useDispatch();
    const [requests, setRequests] = useSetState<Record<string, boolean>>({});
    const { isWide = false, storeState } = props;

    const actions = generateActionsForStore(storeState);
    const nodeTypes = analyzeStructure(storeState);

    async function dispatchAction(nodeName: string, verbType: string, actionParams: any[]) {
        const node = actions[nodeName] as any;
        const actionCreator = node[verbType];
        const action = actionCreator.apply(null, actionParams);

        setRequests({
            [`${nodeName}_${verbType}`]: true,
        });

        await dispatch(action);

        setRequests({
            [`${nodeName}_${verbType}`]: false,
        });
    }

    function renderAction(nodeName: string, verbType: string, actionParams: any[]) {
        const disabled = requests[`${nodeName}_${verbType}`];

        return (
            <button onClick={() => dispatchAction(nodeName, verbType, actionParams)} key={verbType} disabled={disabled}>
                {verbType}
            </button>
        );
    }

    function renderActions(nodeName: string) {
        const nodeType: NodeType = nodeTypes[nodeName];
        const actions = dispatcherActions[nodeType] as ActionParams;

        const buttons = Object.keys(actions).map((verbType: string) => {
            const actionParams = actions[verbType];
            return renderAction(nodeName, verbType, actionParams);
        });

        return buttons;
    }

    const className = classnames(`${cssPrefix}Dispatcher-container`, {
        wide: isWide,
    });

    return (
        <Panel id="dispatcher" zIndex={999} onClose={props.onClose}>
            <div className={className}>
                {Object.keys(nodeTypes).map((nodeName: string) => (
                    <Group key={nodeName} title={nodeName} isWide={isWide} fluid={true}>
                        <>{renderActions(nodeName)}</>
                    </Group>
                ))}
            </div>
        </Panel>
    );
}

export default Dispatcher;
