import React from 'react';
import { Helmet } from 'react-helmet';
import { Sketch } from './sketch';

import Page from './components/page';

const App = ({
  sketch,
  title = 'Code Sketch',
  description = 'HTML Canvas sketch made by code',
}: {
  sketch: Sketch;
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
