import React from 'react';
import 'react-toggle/style.css';
import Toggle from 'react-toggle';

type ToggleProps = {
    defaultChecked: boolean;
    onChange: () => {};
};

export function Toggle(props: ToggleProps) {
    return (
        <div className="Toggle-container">
            <Toggle defaultChecked={props.defaultChecked} onChange={props.onChange} />
        </div>
    );
}

export default Toggle;
