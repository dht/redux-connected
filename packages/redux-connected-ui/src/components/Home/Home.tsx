import React from 'react';
import './Home.scss';
import { ConnectedTable } from 'redux-connected-components';
import * as products from '../../data/products';

type HomeProps = {};

export function Home(props: HomeProps) {
    return (
        <div className="Home-container container single-column">
            <div className="col">
                <ConnectedTable
                    actions={products.actions}
                    selector={products.selector}
                    columns={products.columns}
                    filters={products.filters}
                    fields={products.fields}
                />
            </div>
        </div>
    );
}

export default Home;
