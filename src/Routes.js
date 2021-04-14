import { Redirect, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import { Bullseye, Spinner, Switch as ToggleSwitch } from '@patternfly/react-core';

const AccessRequestsPage = lazy(() => import('./Routes/AccessRequestsPage'));
const AccessRequestDetailsPage = lazy(() => import('./Routes/AccessRequestDetailsPage'));

export const Routes = () => {
  const isInternal = true;
  const AccessRequestDetailsPageWrapper = ({ match }) =>
    <AccessRequestDetailsPage requestId={match.params.requestId} isInternal={isInternal} />;
  const AccessRequestsPageWrapper = () =>
    <AccessRequestsPage isInternal={isInternal} />;

  return (
    <Suspense fallback={<Bullseye><Spinner /></Bullseye>}>
      <Switch>
        <Route path="/" exact component={AccessRequestsPageWrapper} />
        <Route path="/:requestId" exact component={AccessRequestDetailsPageWrapper} />
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </Suspense>
  );
}

