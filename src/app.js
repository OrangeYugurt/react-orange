import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import './index.css';

if (module.hot) {
    // 实现热更新
    module.hot.accept();
}
ReactDOM.render(<App />,document.getElementById('root'))
// ReactDOM.hydrate(<App />,document.getElementById('root'))