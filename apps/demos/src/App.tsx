import { FullPageSketchCanvas, ControlPanelElements, SketchDefinition } from '@code-not-art/sketch';
import { Helmet } from 'react-helmet';

import sketch from './demos/basic.js';

const App = <TParameters extends ControlPanelElements, DataModel extends object>() => (
	<>
		<Helmet>
			<title>Code Sketch</title>
			<meta name="description" content="HTML Canvas sketch made by code" />
		</Helmet>
		<FullPageSketchCanvas sketch={sketch}></FullPageSketchCanvas>
	</>
);

export default App;
