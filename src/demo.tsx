import React from 'react';
import ReactDOM from 'react-dom';
import sketch from './demos/basic.js';
import App from './App.js';

const root = document.getElementById('root');

ReactDOM.render(
  <React.StrictMode>
    <App sketch={sketch} />
  </React.StrictMode>,
  root,
);
