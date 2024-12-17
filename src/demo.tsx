import React from 'react';
import ReactDOM from 'react-dom/client';
import sketch from './demos/basic.js';
// import sketch from './demos/basic2.js';
// import sketch from './demos/loop.js';
import App from './App.js';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
	<React.StrictMode>
		<App sketch={sketch} />
	</React.StrictMode>,
);
