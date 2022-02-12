import React from 'react';
import './App.scss';
import SoundBoard from '../SoundBoard/SoundBoard';
import Log from '../Log/Log';

function App() {
    return (
        <div className="App-container">
            <SoundBoard />
            <Log />
        </div>
    );
}

export default App;
