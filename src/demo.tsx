import React from 'react';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader';
import sketch from './demos/sketch';
// import sketch from './demos/loop';

import App from './App';

declare const module: any;
export default hot(module)(App);

const root = document.getElementById('root');

ReactDOM.render(
  <React.StrictMode>
    <App sketch={sketch} />
  </React.StrictMode>,
  root,
);
