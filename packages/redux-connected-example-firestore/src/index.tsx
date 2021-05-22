import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { connectedStore, store } from './redux/store';
import { initializeIcons } from '@fluentui/react';
import 'redux-connected-devtools/lib/index.css';
import 'redux-connected-components/lib/index.css';
import { Route, Switch } from 'react-router-dom';
import { DevTools } from 'redux-connected-devtools';

initializeIcons();

// const action = {
//     type: 'ADD_PRODUCT',
//     payload: {
//         title: 'new product',
//     },
// };

ReactDOM.render(
    <Provider store={connectedStore}>
        <DevTools />
    </Provider>,
    document.getElementById('devtools')
);

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Switch>
                {/* <Route path="/visual">
                    <Canvas action={action} />
</Route>*/}
                <Route path="/" component={App} />
            </Switch>
        </Router>
    </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

/* <Dispatcher storeState={state} onClose={toggleDevtools} /> */
