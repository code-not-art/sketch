import React from 'react';
import { Helmet } from 'react-helmet';

import Page from './components/Page';
import art from './art';

const App = () => {
  return (
    <>
      <Helmet>
        <title>Make Code Sketch</title>
        <meta name="description" content="Canvas sketch made by code" />
      </Helmet>
      <Page sketch={art}></Page>
    </>
  );
};
export default App;
