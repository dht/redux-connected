import React from 'react';
import './Content.scss';

type ContentProps = {
    children: JSX.Element;
};

export function Content(props: ContentProps) {
    return <div className="Content-container">{props.children}</div>;
}

export default Content;
