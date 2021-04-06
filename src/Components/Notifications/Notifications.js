import React from 'react';
import { AlertGroup } from '@patternfly/react-core';
import NotificationsContext from './NotificationsContext';

const Notifications = () => {
  const { alerts } = React.useContext(NotificationsContext);
  return (
    <AlertGroup isToast>
      {alerts}
    </AlertGroup>
  );
}

export default Notifications;

