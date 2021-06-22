import { Widget } from '../../types.specific';
import './WidgetRow.scss';

type WidgetRowProps = {
    widget: Widget;
    onSelect: (id: string) => void;
};

export function WidgetRow(props: WidgetRowProps) {
    const { widget } = props;
    const { id, title, description, dimension, tags } = widget;
    const { x: width, y: height } = dimension || {};

    function onSelect() {
        props.onSelect(id);
    }

    return (
        <div className="WidgetRow-container" onClick={onSelect}>
            <div className="row">
                <div className="title">{title}</div>
                <div className="dimensions">
                    {width}x{height}
                </div>
            </div>
            <div className="row">
                <div className="description">{description}</div>
                <div className="tags">{tags}</div>
            </div>
        </div>
    );
}

export default WidgetRow;
