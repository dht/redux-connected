import React from 'react';
import classnames from 'classnames';
import logo from './logo.svg';
import logoSmall from './logo-small-hover.svg';
import './Logo.scss';

type LogoProps = {
    className?: string;
    small?: boolean;
    onClick?: () => void;
};

export function Logo(props: LogoProps) {
    const { small } = props;

    const className = classnames('Logo-container', props.className, {
        small,
        clickable: props.onClick,
    });

    const src = small ? logoSmall : logo;

    return (
        <div className={className} onClick={props.onClick}>
            <img draggable={false} className="logo" src={src} alt="logo" />
        </div>
    );
}

export default Logo;
