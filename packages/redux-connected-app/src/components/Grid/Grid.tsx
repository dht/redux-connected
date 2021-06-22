import { useRef, useState } from 'react';
import { GridEdit } from '../GridEdit/GridEdit';
import './Grid.scss';
import { WidgetGallery } from '../WidgetGallery/WidgetGallery';
import { Widget } from '../../types.specific';
import { Icon } from '../Icon/Icon';
import { Mode, Panel } from '../../types';
import GridView from '../GridView/GridView';
import classnames from 'classnames';
import { useToggle } from '../../hooks/useToggle';

type GridProps = {
    panels: Panel[];
    panelToFit?: Panel;
    renderGallery: () => JSX.Element;
    renderPanel: (id: string) => JSX.Element;
};

export function Grid(props: GridProps) {
    const { panels, gallery: GalleryCmp } = props;
    const [editMode, toggleMode] = useToggle(true);
    const ref = useRef<HTMLDivElement>(null);

    const GridCmp = editMode ? GridEdit : GridView;

    const className = classnames('Grid-container', {
        edit: editMode,
    });

    return (
        <div className={className} ref={ref}>
            <GridCmp {...props} gridRef={ref} onToggle={toggleMode} />
            {editMode && GalleryCmp}
        </div>
    );
}

export default Grid;
