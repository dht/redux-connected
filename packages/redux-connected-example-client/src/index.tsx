import App from './components/App/App';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connectedStore, store } from './redux/store';
import { DevTools } from 'redux-connected-devtools';
import { initializeIcons } from '@fluentui/react';
import { Provider } from 'react-redux';
import './index.scss';
import 'redux-connected-devtools/lib/index.css';
import 'redux-connected-components/lib/index.css';

initializeIcons();

ReactDOM.render(
    <Provider store={connectedStore}>
        <div>
            <DevTools />
        </div>
    </Provider>,
    document.getElementById('devtools')
);

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
