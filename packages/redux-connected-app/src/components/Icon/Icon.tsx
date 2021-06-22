import './Icon.scss';
import { Icon as Brush } from './brush_black_24dp';
import { Icon as Close } from './close_black_24dp';
import { Icon as Edit } from './edit_black_24dp';
import { Icon as List } from './view_list_black_24dp';
import { Icon as Download } from './file_download_black_24dp';
import React from 'react';

type IconProps = {
    icon: 'brush' | 'close' | 'edit' | 'list' | 'download';
    onClick?: (ev: React.MouseEvent<HTMLElement>) => void;
};

const all: Record<string, () => JSX.Element> = {
    brush: Brush,
    close: Close,
    edit: Edit,
    list: List,
    download: Download,
};

export function Icon(props: IconProps) {
    const { icon } = props;
    const Cmp = all[icon];

    return (
        <div className="Icon-container" onClick={props.onClick}>
            <Cmp />
        </div>
    );
}

export default Icon;
