import { Redirect, Route, Switch } from 'react-router-dom';

import PropTypes from 'prop-types';
import React, { Suspense, lazy } from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';

const AccessRequestsPage = lazy(() => import(/* webpackChunkName: "AccessRequestsPage" */ './Routes/AccessRequests/AccessRequestsPage'));
const OopsPage = lazy(() => import(/* webpackChunkName: "OopsPage" */ './Routes/OopsPage/OopsPage'));
const NoPermissionsPage = lazy(() => import(/* webpackChunkName: "NoPermissionsPage" */ './Routes/NoPermissionsPage/NoPermissionsPage'));

/**
 * the Switch component changes routes depending on the path.
 *
 * Route properties:
 *      exact - path must match exactly,
 *      path - https://prod.foo.redhat.com:1337/insights/advisor/rules
 *      component - component to be rendered when a route has been chosen.
 */
export const Routes = () => (
  <Suspense fallback={<Bullseye>
    <Spinner />
  </Bullseye>}>
    <Switch>
      <Route path="/" exact component={AccessRequestsPage} />
      <Route path="/oops" component={OopsPage} />
      <Route path="/no-permissions" component={NoPermissionsPage} />
      { /* Finally, catch all unmatched routes */}
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  </Suspense>
);

Routes.propTypes = {
  childProps: PropTypes.shape({
    history: PropTypes.shape({
      push: PropTypes.func
    })
  })
};
