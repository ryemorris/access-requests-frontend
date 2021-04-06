import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';

// https://github.com/RedHatInsights/frontend-components/blob/07332f7ebeaf80cd99b3a7a1a843a43e9e2daf7e/packages/utils/src/helpers/helpers.js
function getBaseName(pathname, level = 2) {
  let release = '/';
  const pathName = pathname.replace(/(#|\?).*/, '').split('/');

  pathName.shift();

  if (pathName[0] === 'beta') {
    pathName.shift();
    release = `/beta/`;
  }

  return [ ...new Array(level) ].reduce((acc, _curr, key) => {
    return `${acc}${pathName[key] || ''}${key < (level - 1) ? '/' : ''}`;
  }, release);
}

const AppEntry = () => (
  <Provider store={store}>
    <Router basename={getBaseName(window.location.pathname)}>
      <App/>
    </Router>
  </Provider>
);

export default AppEntry;
