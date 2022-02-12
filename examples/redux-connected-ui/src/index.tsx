import React from 'react';
import App from './components/App/App';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { store } from './store/store';
import { initializeIcons } from '@fluentui/react';
import { Provider } from 'react-redux';
import './index.scss';

initializeIcons();

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Switch>
                <Route path="/" component={App} />
            </Switch>
        </Router>
    </Provider>,
    document.getElementById('root')
);
