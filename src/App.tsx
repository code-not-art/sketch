import React from 'react';
import { Helmet } from 'react-helmet';

import Page from './components/page';
import sketch from './demos/sketch';
import loop from './demos/loop';

const App = () => {
  return (
    <>
      <Helmet>
        <title>Make Code Sketch</title>
        <meta name="description" content="Canvas sketch made by code" />
      </Helmet>
      <Page sketch={sketch}></Page>
    </>
  );
};
export default App;
