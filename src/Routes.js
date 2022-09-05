import { Redirect, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy, useContext, useState, useEffect } from 'react';
import {
  Bullseye,
  Spinner,
  Switch as ToggleSwitch,
} from '@patternfly/react-core';

const AccessRequestsPage = lazy(() => import('./Routes/AccessRequestsPage'));
const AccessRequestDetailsPage = lazy(() =>
  import('./Routes/AccessRequestDetailsPage')
);
import { RegistryContext } from './store';
const isDev = process.env.NODE_ENV !== 'production';

const fallback = (
  <Bullseye>
    <Spinner />
  </Bullseye>
);

export const Routes = () => {
  const { getRegistry } = useContext(RegistryContext);
  const [userReady, setUserReady] = useState(false);
  const [isInternal, setIsInternal] = useState(true);

  useEffect(() => {
    insights.chrome.init();
    Promise.resolve(insights.chrome.auth.getUser()).then((user) => {
      setIsInternal(user?.identity?.user?.is_internal);
      setUserReady(true);
    });
  }, []);

  if (!userReady) {
    return fallback;
  }

  return (
    <Suspense fallback={fallback}>
      {isDev && (
        <ToggleSwitch
          id="toggle-view"
          label="Internal view"
          labelOff="External view"
          checked={isInternal}
          onChange={() => setIsInternal((prev) => !prev)}
        />
      )}
      <Switch>
        <Route path="/" exact>
          <AccessRequestsPage
            isInternal={isInternal}
            getRegistry={getRegistry}
          />
        </Route>
        <Route path="/:requestId" exact>
          <AccessRequestDetailsPage
            isInternal={isInternal}
            getRegistry={getRegistry}
          />
        </Route>
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </Suspense>
  );
};
