import { Redirect, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';

const AccessRequestsPage = lazy(() => import('./Routes/AccessRequestsPage'));
const AccessRequestDetailsPage = lazy(() => import('./Routes/AccessRequestDetailsPage'));

const AccessRequestDetailsPageWrapper = ({ match }) =>
  <AccessRequestDetailsPage requestId={match.params.requestId} canApprove={false} />;
export const Routes = () => (
  <Suspense fallback={<Bullseye><Spinner /></Bullseye>}>
    <Switch>
      <Route path="/" exact component={AccessRequestsPage} />
      <Route path="/:requestId" exact component={AccessRequestDetailsPageWrapper} />
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  </Suspense>
);

