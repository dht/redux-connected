import React from 'react';
import 'react-toggle/style.css';
import ReactToggle from 'react-toggle';

type ToggleProps = {
    defaultChecked: boolean;
    onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Toggle(props: ToggleProps) {
    return (
        <div className="Toggle-container">
            <ReactToggle
                defaultChecked={props.defaultChecked}
                onChange={props.onChange}
            />
        </div>
    );
}

export default Toggle;
