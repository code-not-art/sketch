import { FullPageSketchCanvas } from '@code-not-art/sketch';
import { Helmet } from 'react-helmet';

import sketch from './demos/basic';

const App = () => (
	<>
		<Helmet>
			<title>Code Sketch</title>
			<meta name="description" content="HTML Canvas sketch made by code" />
		</Helmet>
		<FullPageSketchCanvas sketch={sketch}></FullPageSketchCanvas>
	</>
);

export default App;
