import * as React from 'react';
import classnames from 'classnames';
import Loader from '../Loader/Loader';
import cssPrefix from '../prefix';

type ButtonProps = {
    children: string | JSX.Element;
    onClick?: () => void;
    className?: string;
    isPrimary?: boolean;
    isLoading?: boolean;
};

export function Button(props: ButtonProps) {
    const { isPrimary, isLoading } = props;

    const className = classnames(`${cssPrefix}Button-container`, props.className, {
        primary: isPrimary,
        loading: isLoading,
    });

    return (
        <button className={className} onClick={props.onClick} disabled={isLoading}>
            {props.children}
            {isLoading && (
                <div className="loader">
                    <Loader />
                </div>
            )}
        </button>
    );
}

export default Button;
