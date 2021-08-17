import './ReleaseButton.scss';

type ReleaseButtonProps = {
    children: string;
    onChange: (isDown: boolean) => void;
};

export function ReleaseButton(props: ReleaseButtonProps) {
    function onMouseDown() {
        props.onChange(true);
    }

    function onMouseUp() {
        props.onChange(false);
    }

    return (
        <button
            className="ReleaseButton-container"
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
        >
            {props.children}
        </button>
    );
}

export default ReleaseButton;
