import Button from '../Button/Button';
import classnames from 'classnames';
import React from 'react';
import { actions, providers } from '../../data/providers';
import { iconMap } from '../../data/iconMap';
import { IProvider } from '../../types/types';
import './SoundBoard.scss';

type SoundBoardProps = {};

export function SoundBoard(props: SoundBoardProps) {
    function renderProvider(provider: IProvider, index: number) {
        const className =
            provider.type + '-' + provider.location + '-' + provider.subtype;

        return (
            <StripColumn
                key={provider.id}
                id={provider.id}
                header={provider.id}
                headerClassName={className}
            />
        );
    }

    return (
        <div className="SoundBoard-container">
            <StripFirstColumn />
            {providers.map((provider, index: number) =>
                renderProvider(provider, index)
            )}
        </div>
    );
}

function StripColumn(props: any) {
    const { header, headerClassName } = props;

    function onClick() {}

    function renderButton(action: string) {
        return (
            <Button onClick={onClick} icon={iconMap[action]} iconSize={14} />
        );
    }

    return (
        <div className="Strip-container">
            <StripHeader header={header} className={headerClassName} />
            {actions.map(renderButton)}
        </div>
    );
}

function StripFirstColumn(props: any) {
    function renderTitle(action: string) {
        return (
            <div key={action} className="title">
                {action}
            </div>
        );
    }

    return (
        <div className="StripFirstColumn-container">
            <StripHeader className="header-empty" />
            {actions.map(renderTitle)}
        </div>
    );
}

function StripHeader(props: any) {
    const { header } = props;
    const className = classnames('StripHeader-container', props.className);

    return <div className={className}>{header}</div>;
}

export default SoundBoard;
