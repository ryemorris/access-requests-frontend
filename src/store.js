import { createContext } from 'react';
import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';

export const RegistryContext = createContext({
  getRegistry: () => {},
});

const registry = new ReducerRegistry({}, [
  notificationsMiddleware({
    errorTitleKey: ['message'],
    errorDescriptionKey: ['errors', 'stack'],
  }),
]);

registry.register({
  notifications: notificationsReducer,
});

export default registry;
