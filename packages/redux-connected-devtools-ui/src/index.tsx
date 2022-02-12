import App from './components/App/App';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { connectedStore } from './store/store';
import { initializeIcons, ThemeProvider } from '@fluentui/react';
import { Provider } from 'react-redux';
import { theme } from './theme';
import './index.scss';

initializeIcons();

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme} className="theme">
            <Provider store={connectedStore}>
                <Router>
                    <App />
                </Router>
            </Provider>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
