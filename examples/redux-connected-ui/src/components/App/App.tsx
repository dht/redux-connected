import Content from '../Content/Content';
import Header from '../Header/Header';
import Home from '../Home/Home';
import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { actions, connectedStore } from '../../store/store';
import { ChatBar } from '@redux-connected-components';
import { Route, Switch } from 'react-router-dom';
import { useMount } from 'react-use';
import './App.scss';

function App() {
    useMount(() => {
        connectedStore.dispatch({ type: 'REFRESH' });
    });

    return (
        <div className="App-container">
            <Header />
            <Sidebar />
            <ChatBar action={actions.chats.get} />
            <Content>
                <Switch>
                    <Route path="/" exact component={Home} />
                </Switch>
            </Content>
        </div>
    );
}

export default App;
