import './WidgetGallery.scss';
import Draggable from 'react-draggable';
import { useRef } from 'react';
import { WidgetRow } from '../WidgetRow/WidgetRow';
import { Widget } from '../../types.specific';

type WidgetGalleryProps = {
    widgets: Widget[];
    onSelect: (id: string) => void;
};

export function WidgetGallery(props: WidgetGalleryProps) {
    const { widgets } = props;
    const ref = useRef<HTMLDivElement>(null);

    return (
        <Draggable nodeRef={ref} handle=".header">
            <div className="WidgetGallery-container" ref={ref}>
                <div className="header">Widget Gallery</div>
                <div className="list">
                    {widgets.map((widget) => (
                        <WidgetRow
                            widget={widget}
                            key={widget.id}
                            onSelect={props.onSelect}
                        />
                    ))}
                </div>
            </div>
        </Draggable>
    );
}

export default WidgetGallery;
