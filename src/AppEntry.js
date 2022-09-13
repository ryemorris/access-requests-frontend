import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import registry, { RegistryContext } from './store';
import App from './App';
import { getBaseName } from '@redhat-cloud-services/frontend-components-utilities/helpers/helpers';

// the UI has to be accessible from both /internal and /internal/access-requests. The basename has to be /internal always
const basename = getBaseName(window.location.pathname, 2);

const AppEntry = () => (
  <RegistryContext.Provider
    value={{
      getRegistry: () => registry,
    }}
  >
    <Provider store={registry.getStore()}>
      <Router basename={basename}>
        <App basename={basename} />
      </Router>
    </Provider>
  </RegistryContext.Provider>
);

export default AppEntry;
