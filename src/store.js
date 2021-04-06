// I don't fully understand this. It's just for notifications.
import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';

const registry = new ReducerRegistry({}, [
  notificationsMiddleware({
    errorTitleKey: ['message'],
    errorDescriptionKey: ['errors', 'stack'],
  }),
]);

registry.register({
  notifications: notificationsReducer,
});

export default registry.getStore();
