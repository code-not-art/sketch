import { FullPageSketchCanvas, ControlPanelElements, SketchDefinition } from '@code-not-art/sketch';

import sketch from './demos/basic.js';

const App = <TParameters extends ControlPanelElements, DataModel extends object>() => (
	<>
		<title>Code Sketch</title>
		<meta name="description" content="HTML Canvas sketch made by code" />
		<FullPageSketchCanvas sketch={sketch}></FullPageSketchCanvas>
	</>
);

export default App;
