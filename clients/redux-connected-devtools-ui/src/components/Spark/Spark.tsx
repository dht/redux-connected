import React, { useEffect, useState } from 'react';
import { connectedSelectors } from '@redux-connected';
import { useSelector } from 'react-redux';
import './Spark.scss';
import {
    ActionLifecycle,
    ActionLog,
    ApiRequest,
    ApiRequestStatus,
    Journey,
} from 'redux-connected-types';
import classnames from 'classnames';
import { Json } from 'redux-store-generator';
import { Icon } from '@fluentui/react';
import { delta } from '../../utils/time';

type SparkProps = {};

export function Spark(props: SparkProps) {
    const requests = useSelector(connectedSelectors.$requestsRaw);
    const actionLogs = useSelector(connectedSelectors.$actionLogs);
    const [currentRequestId, setCurrentRequestId] = useState('');
    const [currentActionLog, setCurrentActionLog] = useState('');

    useEffect(() => {
        if (actionLogs.length > 0) {
            setCurrentActionLog(actionLogs[0].meta.id);
        }
    }, [actionLogs.length]);

    useEffect(() => {
        if (requests.length > 0) {
            setCurrentRequestId(requests[0].meta.id);
        }
    }, [requests.length]);

    const requestIndex = requests.findIndex(req => req.meta.id === currentRequestId); // prettier-ignore
    const request = requests.find((req) => req.meta.id === currentRequestId);

    const actionLogIndex = actionLogs.findIndex(log => log.meta.id === currentActionLog); // prettier-ignore
    const actionLog = actionLogs.find((log) => log.meta.id === currentActionLog); // prettier-ignore

    return (
        <div className="Spark-container">
            <div className="requests-panel">
                <RequestsPanel onClick={setCurrentRequestId} />
            </div>
            <div className="request-details">
                <RequestDetails request={request} requestIndex={requestIndex} />
            </div>
            <CircleRequests onClick={setCurrentRequestId} />
            <div className="actionLogs-panel">
                <ActionLogsPanel onClick={setCurrentActionLog} />
            </div>
            <div className="actionLog-details">
                <ActionLogDetails
                    actionLog={actionLog}
                    actionLogIndex={actionLogIndex}
                />
            </div>
            <CircleActions onClick={setCurrentActionLog} />
        </div>
    );
}

function RequestDetails(props: any) {
    const { requestIndex, request } = props;

    if (!request) {
        return null;
    }

    const { journey = [] } = request as ApiRequest;

    return (
        <div className="RequestDetails-container">
            <div className="header">Request #{requestIndex + 1}</div>
            <div className="table table-1">
                <Table header="info" data={requestToTableData(request)} />
            </div>
            <div className="table table-2">
                <Table header="journey" data={journeyToTableData(journey)} />
            </div>
        </div>
    );
}

function ActionLogDetails(props: any) {
    const { actionLogIndex, actionLog } = props;

    if (!actionLog) {
        return null;
    }

    const { journey = [] } = actionLog as ActionLog;

    return (
        <div className="ActionLogDetails-container">
            <div className="header">Action #{actionLogIndex + 1}</div>
            <div className="table table-1">
                <Table header="info" data={actionLogToTableData(actionLog)} />
            </div>
            <div className="table table-2">
                <Table header="journey" data={journeyToTableData(journey)} />
            </div>
        </div>
    );
}

function Cell(props: any) {
    const { itemData } = props;
    const { value, type } = itemData;

    function renderInner() {
        switch (type) {
            case 'delta':
                return delta(value);
            case 'json':
                return (
                    <div className="json">
                        <Icon iconName="Info" />
                    </div>
                );
            default:
                return value;
        }
    }

    return <div className="Cell-container">{renderInner()}</div>;
}

function Table(props: any) {
    const { data = {} } = props;

    function renderRow(key: string, index: number) {
        return (
            <div className="row" key={index}>
                <div className="title">{key}</div>
                <div className="cell">
                    <Cell itemData={data[key]} />
                </div>
            </div>
        );
    }

    function renderRows() {
        return Object.keys(data).map((key: string, index: number) =>
            renderRow(key, index)
        );
    }

    return (
        <div className="Table-container">
            <div className="header">{props.header}</div>
            <div className="rows">{renderRows()}</div>
        </div>
    );
}

function Tag(props: any) {
    const className = classnames('Tag-container', {
        clickable: typeof props.onClick === 'function',
    });

    return (
        <div className={className} onClick={props.onClick}>
            {props.value}
        </div>
    );
}

function CircleRequests(props: any) {
    const bases: Record<ApiRequestStatus, string> = {
        [ApiRequestStatus.CREATED]: 'created',
        [ApiRequestStatus.WAITING]: 'waiting',
        [ApiRequestStatus.FIRING]: 'firing',
        [ApiRequestStatus.ERROR]: 'error',
        [ApiRequestStatus.NO_INTERNET]: 'no internet',
        [ApiRequestStatus.RETRYING]: 'retrying',
        [ApiRequestStatus.SUCCESS]: 'success',
        [ApiRequestStatus.DONE]: 'done',
    };

    const requestsByStatus = useSelector(connectedSelectors.$requestsByStatus);
    const angleForBase = 360 / Object.values(bases).length;

    function renderBase(status: ApiRequestStatus, index: number) {
        return (
            <CircleBase
                angle={angleForBase * index}
                key={index}
                title={bases[status]}
            >
                <TagGroup
                    data={(requestsByStatus as any)[status]}
                    onClick={props.onClick}
                />
            </CircleBase>
        );
    }

    function renderBases() {
        return Object.keys(bases).map((status: string, index: number) =>
            renderBase(status as ApiRequestStatus, index)
        );
    }

    return (
        <div className="Circle-container requests">
            <div className="center"></div>
            {renderBases()}
        </div>
    );
}

function CircleActions(props: any) {
    const bases: Record<ActionLifecycle, string> = {
        [ActionLifecycle.RECEIVED]: 'received',
        [ActionLifecycle.FILTERED]: 'filtered',
        [ActionLifecycle.API_REQUEST]: 'request phase',
        [ActionLifecycle.POST_ACTION]: 'post action',
    };

    const actionLogsByLifecycle = useSelector(
        connectedSelectors.$actionLogsByLifecycle
    );

    const angleForBase = 360 / Object.values(bases).length;

    function renderBase(point: ActionLifecycle, index: number) {
        return (
            <CircleBase
                angle={angleForBase * index}
                key={index}
                title={bases[point]}
            >
                <TagGroup
                    data={(actionLogsByLifecycle as any)[point]}
                    onClick={props.onClick}
                />
            </CircleBase>
        );
    }

    function renderBases() {
        return Object.keys(bases).map((status: string, index: number) =>
            renderBase(status as ActionLifecycle, index)
        );
    }

    return (
        <div className="Circle-container actions">
            <div className="center"></div>
            {renderBases()}
        </div>
    );
}

function CircleBase(props: any) {
    const { angle } = props;

    const styleContainer = {
        left: Math.cos(((angle - 90) * Math.PI) / 180) * 284,
        top: Math.sin(((angle - 90) * Math.PI) / 180) * 284,
    };

    let titleAlign: any = 'center';

    if (angle > 0 && angle < 180) {
        titleAlign = 'left';
    }

    if (angle > 180) {
        titleAlign = 'right';
    }

    const styleTitle = {
        textAlign: titleAlign,
        left: Math.cos(((angle - 90) * Math.PI) / 180) * 90,
        top: Math.sin(((angle - 90) * Math.PI) / 180) * 44,
    };

    const styleItems = {
        left: Math.cos(((angle - 90) * Math.PI) / 180) * -75,
        top: Math.sin(((angle - 90) * Math.PI) / 180) * -55,
    };

    return (
        <div className="CircleBase-container" style={styleContainer}>
            <div className="dot">
                <div style={styleTitle} className="title">
                    {props.title}
                </div>
                <div style={styleItems} className="items">
                    {props.children}
                </div>
            </div>
        </div>
    );
}

function RequestsPanel(props: any) {
    const requests = useSelector(connectedSelectors.$requestsRaw);

    return (
        <div className="RequestsPanel-container">
            <div className="title">requests</div>
            <div className="items">
                {requests.map((request) => (
                    <Tag
                        key={request.meta.id}
                        value={request.meta.sequence}
                        onClick={() => props.onClick(request.meta.id)}
                    />
                ))}
            </div>
        </div>
    );
}

function ActionLogsPanel(props: any) {
    const actionLogs = useSelector(connectedSelectors.$actionLogs);

    return (
        <div className="ActionLogsPanel-container">
            <div className="title">actions</div>
            <div className="items">
                {actionLogs.map((actionLog) => (
                    <Tag
                        key={actionLog.meta.id}
                        value={actionLog.meta.sequence}
                        onClick={() => props.onClick(actionLog.meta.id)}
                    />
                ))}
            </div>
        </div>
    );
}

function TagGroup(props: any) {
    const { data = [] } = props;

    return (
        <div className="TagGroup">
            {data.map((item: ApiRequest | ActionLog) => (
                <Tag
                    key={item.meta.id}
                    value={item.meta.sequence}
                    onClick={() => props.onClick(item.meta.id)}
                />
            ))}
        </div>
    );
}

export default Spark;

const journeyToTableData = (journey: Journey) => {
    return journey.reduce((output, journeyPoint) => {
        const { timestamp, title } = journeyPoint;
        output[title] = { value: timestamp, type: 'delta' };
        return output;
    }, {} as any);
};

const requestToTableData = (request: ApiRequest) => {
    const output = {} as Json;
    output.type = { value: request.originalAction?.type, type: '' };
    output.status = { value: request.status, type: '' };
    output.connection = { value: request.connectionType, type: '' };
    output.action = { value: request.originalAction, type: 'json' };
    output.params = { value: request.params, type: 'json' };
    return output;
};

const actionLogToTableData = (actionLog: ActionLog) => {
    const output = {} as Json;
    output.type = { value: actionLog.action.type, type: '' };
    output.status = { value: actionLog.lifecyclePhase, type: '' };
    output.action = { value: actionLog.action, type: 'json' };
    return output;
};
