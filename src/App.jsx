import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApplicationProvider } from './providers/applicationProvider';
import Router from './routes';
import { GlobalStyle, ResetStyle } from './globalStyles';

function App() {
  return (
    <BrowserRouter>
      <ApplicationProvider>
          <ResetStyle />
          <GlobalStyle />
          <Router />
      </ApplicationProvider>
    </BrowserRouter>
  );
}

export default App;
