import React from 'react';
import {Button} from 'antd';
import logo from './logo.svg';
import './App.css';

const {ipcRenderer}=window.require('electron')

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <Button onClick={() => {
                    ipcRenderer.send('window-min');
                }}>
                    最小化
                </Button>
                <Button onClick={() => {
                    ipcRenderer.send('window-max');
                }}>
                    最大化
                </Button>
                <Button onClick={() => {
                    ipcRenderer.send('window-close');
                }}>
                    关闭
                </Button>

                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
