import { Redirect, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import { Bullseye, Spinner, Switch as ToggleSwitch } from '@patternfly/react-core';

const AccessRequestsPage = lazy(() => import('./Routes/AccessRequestsPage'));
const AccessRequestDetailsPage = lazy(() => import('./Routes/AccessRequestDetailsPage'));

const isDev = process.env.NODE_ENV !== 'production';

export const Routes = () => {
  const [isInternal, setIsInternal] = React.useState(true);
  const AccessRequestDetailsPageWrapper = ({ match }) =>
    <AccessRequestDetailsPage requestId={match.params.requestId} isInternal={isInternal} />;
  const AccessRequestsPageWrapper = () =>
    <AccessRequestsPage isInternal={isInternal} />;

  return (
    <Suspense fallback={<Bullseye><Spinner /></Bullseye>}>
    {isDev &&
      <ToggleSwitch
        id="toggle-view"
        label="Internal view"
        labelOff="External view"
        isChecked={isInternal}
        onChange={() => setIsInternal(!isInternal)} />
    }
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

