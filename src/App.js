import React, { Fragment, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Routes } from './Routes';
import { connect } from 'react-redux';
import NotificationPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import './index.css';

const App = (props) => {
  useEffect(() => {
    insights.chrome.init();

    insights.chrome.identifyApp('access-requests');
    return insights.chrome.on('APP_NAVIGATION', (event) =>
      this.props.history.push(`/${event.navId}`)
    );
  }, []);

  return (
    <Fragment>
      <NotificationPortal />
      <Routes childProps={props} />
    </Fragment>
  );
};

/**
 * connect: https://github.com/reactjs/react-redux/blob/master/docs/api.md
 *          https://reactjs.org/docs/higher-order-components.html
 */
export default withRouter(connect()(App));
