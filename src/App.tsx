import { Helmet } from 'react-helmet';

import { FullPageSketch } from './components/index.js';
import type { ControlPanelElements } from './control-panel/types/controlPanel.js';
import { SketchDefinition } from './sketch/index.js';

const App = <TParameters extends ControlPanelElements, DataModel extends object>({
	sketch,
	title = 'Code Sketch',
	description = 'HTML Canvas sketch made by code',
}: {
	sketch: SketchDefinition<TParameters, DataModel>;
	title?: string;
	description?: string;
}) => {
	return (
		<>
			<Helmet>
				<title>{title}</title>
				<meta name="description" content={description} />
			</Helmet>
			<FullPageSketch sketch={sketch}></FullPageSketch>
		</>
	);
};
export default App;
