import { PropsWithChildren } from 'react';

import App from '../App.js';
import sketch from '../demos/basic.js';

const FullpageSketch = (_props: PropsWithChildren<{}>) => {
	return <App sketch={sketch} />;
};

export default FullpageSketch;
