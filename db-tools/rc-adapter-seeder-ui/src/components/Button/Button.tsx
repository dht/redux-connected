import React from 'react';
import { FontIcon } from '@fluentui/react';
import './Button.scss';

type ButtonProps = {
    onClick: () => void;
    disabled?: boolean;
    icon?: string;
    iconSize?: number;
    children?: JSX.Element;
    className?: string;
};

export function Button(props: ButtonProps) {
    const { icon, iconSize = 14 } = props;

    function renderInner() {
        if (props.children) {
            return props.children;
        }

        if (!icon) {
            return null;
        }

        const style = {
            fontSize: `${iconSize}px`,
        };

        return (
            <div className="icon-container">
                <FontIcon
                    aria-label="icon"
                    iconName={icon}
                    className="icon"
                    style={style}
                />
            </div>
        );
    }

    return (
        <div className="Button-container">
            <button className={props.className} onClick={props.onClick}>
                {renderInner()}
            </button>
        </div>
    );
}
export default Button;
