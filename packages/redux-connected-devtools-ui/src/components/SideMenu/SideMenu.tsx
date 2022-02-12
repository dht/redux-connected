import React from 'react';
import classnames from 'classnames';
import Logo from '../Logo/Logo';
import { Icon } from '@fluentui/react';
import { Link } from 'react-router-dom';
import { MenuItem } from '../../data/menuBuilder';
import { useCallback, useEffect } from 'react';
import { useLocation, useSetState, useToggle } from 'react-use';
import './SideMenu.scss';

type SideMenuProps = {
    data: MenuItem[];
    groups: string[];
};

export function SideMenu(props: SideMenuProps) {
    const { data, groups } = props;
    const [sections, updateSections] = useSetState<Record<string, boolean>>({});
    const [slim, toggleSlim] = useToggle(true);
    const location = useLocation();

    useEffect(() => {
        if (groups.length === 0) {
            return;
        }

        updateSections({
            [groups[0]]: true,
        });
    }, [groups, updateSections]);

    const slimItems = data.filter(
        (item) => item.showOnSlim || item.path === location.pathname
    );

    const toggleGroup = useCallback(
        (groupId: string) => {
            updateSections({
                [groupId]: !sections[groupId],
            });
        },
        [sections, updateSections]
    );

    function renderItem(item: MenuItem) {
        const { id, icon, title, path, disabled, hidden } = item;

        if (hidden) {
            return null;
        }

        const className = classnames('item', {
            selected: location.pathname === path,
            disabled,
        });

        return (
            <Link
                to={path}
                key={id}
                draggable={false}
                className={className}
                onClick={() => toggleSlim(true)}
            >
                <Icon className="icon" iconName={icon} />
                <div className="title">{title}</div>
            </Link>
        );
    }

    function renderItems(items: MenuItem[]) {
        return (
            <div className="items">{items.map((item) => renderItem(item))}</div>
        );
    }

    function renderGroup(groupId: string) {
        const isSectionVisible = sections[groupId];

        const className = classnames('group', {
            open: isSectionVisible,
        });

        const items = data.filter((item) => item.groupId === groupId);

        return (
            <div key={groupId} className={className}>
                <div className="title" onClick={() => toggleGroup(groupId)}>
                    {groupId}
                    <Icon iconName="ChevronDown" className="chevron"></Icon>
                </div>
                {isSectionVisible && renderItems(items)}
            </div>
        );
    }

    function renderGroups() {
        return groups.map((group) => renderGroup(group));
    }

    const className = classnames('SideMenu-container', {
        slim,
    });

    return (
        <div className={className}>
            <div className="header">
                <Logo small={slim} onClick={toggleSlim} />
                <Icon
                    className="cancel"
                    iconName="ChevronLeftSmall"
                    onClick={toggleSlim}
                ></Icon>
            </div>
            {slim ? renderItems(slimItems) : renderGroups()}
            {!slim && <div className="overlay" onClick={toggleSlim}></div>}
        </div>
    );
}

export default SideMenu;
