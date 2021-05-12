import React from 'react';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import ErrorCircleOIcon from '@patternfly/react-icons/dist/js/icons/error-circle-o-icon';
import PendingIcon from '@patternfly/react-icons/dist/js/icons/in-progress-icon';
import ClockIcon from '@patternfly/react-icons/dist/js/icons/history-icon';

export function getLabelProps(status) {
  let color = null;
  let icon = null;
  if (status === 'pending') {
    color = 'blue';
    icon = <PendingIcon />;
  } else if (status === 'approved') {
    color = 'green';
    icon = <CheckCircleIcon />;
  } else if (status === 'denied') {
    color = 'red';
    icon = <ExclamationCircleIcon />;
  } else if (status === 'cancelled') {
    color = 'orange';
    icon = <ErrorCircleOIcon />;
  } else if (status === 'expired') {
    color = 'grey';
    icon = <ClockIcon />;
  }

  return { color, icon };
}
