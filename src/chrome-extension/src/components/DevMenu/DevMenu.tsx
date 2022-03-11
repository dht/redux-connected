import React from 'react';
import { IDevRoute } from '../../data/devRouter';
import {
    Container,
    MenuGroup,
    MenuGroupTitle,
    MenuItem,
    Title,
    Badge,
} from './DevMenu.style';

export type DevMenuProps = {
    groups: string[];
    items: IDevRoute[];
    onClick: (route: IDevRoute) => void;
};

export function DevMenu(props: DevMenuProps) {
    const { groups, items } = props;

    function renderItem(item: IDevRoute) {
        const { title } = item;
        return (
            <MenuItem key={item.path}>
                <Title>{title}</Title>
                <Badge>5</Badge>
            </MenuItem>
        );
    }

    function renderItems(groupItems: IDevRoute[]) {
        return groupItems.map((item: IDevRoute) => renderItem(item));
    }

    function renderGroup(group: string) {
        const groupItems = items.filter((item) => item.group === group);

        return (
            <MenuGroup key={group}>
                <MenuGroupTitle>{group}</MenuGroupTitle>
                {renderItems(groupItems)}
            </MenuGroup>
        );
    }

    function renderGroups() {
        return groups.map((group: string) => renderGroup(group));
    }

    return (
        <Container
            className='DevMenu-container'
            data-testid='DevMenu-container'
        >
            {renderGroups()}
        </Container>
    );
}

export default DevMenu;
