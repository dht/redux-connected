import React from 'react';
import App from './components/App/App';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { initializeIcons } from '@fluentui/react';
import './index.scss';

initializeIcons();

ReactDOM.render(
    <Router>
        <Switch>
            <Route path="/" exact component={App} />
        </Switch>
    </Router>,
    document.getElementById('root')
);
