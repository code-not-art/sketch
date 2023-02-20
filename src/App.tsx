import React from 'react';
import { Helmet } from 'react-helmet';

import Page from './components/page';
import { ParameterModel, SketchDefinition } from 'sketch/Sketch';

const App = <PM extends ParameterModel, DataModel>({
  sketch,
  title = 'Code Sketch',
  description = 'HTML Canvas sketch made by code',
}: {
  sketch: SketchDefinition<PM, DataModel>;
  title?: string;
  description?: string;
}) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      <Page sketch={sketch}></Page>
    </>
  );
};
export default App;
