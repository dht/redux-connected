import Content from '../Content/Content';
import './App.scss';
import { Route, Switch } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Home from '../Home/Home';
import { useMount } from 'react-use';
import { useDispatch } from 'react-redux';
import { actions } from '../../redux/store';
import { ChatBar } from 'redux-connected-components';

function App() {
    const dispatch = useDispatch();

    useMount(() => {
        setTimeout(() => {
            dispatch(actions.user.get({}));
        });
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
