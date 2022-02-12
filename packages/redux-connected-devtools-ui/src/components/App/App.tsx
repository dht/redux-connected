import React from 'react';
import './App.scss';
import SideMenu from '../SideMenu/SideMenu';
import { Icon } from '@fluentui/react';
import { dataGroups, menuData } from '../../data/menuBuilder';
import screenfull from 'screenfull';
import { Routes } from '../Routes';

function App() {
    function onClick() {
        if (screenfull.isEnabled) {
            screenfull.request();
        }
    }

    return (
        <div className="App-container">
            <div className="menu">
                <SideMenu data={menuData} groups={dataGroups} />
                <div className="icon-fullscreen" onClick={onClick}>
                    <Icon iconName="fullscreen" />
                </div>
            </div>
            <Routes />
        </div>
    );
}

export default App;
