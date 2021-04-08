import React from 'react';
import { Modal, Button, Spinner } from '@patternfly/react-core';
import { useDispatch } from 'react-redux'
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

const CancelRequestModal = ({ requestId, onClose }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();
  const onCancel = () => {
    setIsLoading(true);
    // https://ci.cloud.redhat.com/docs/api-docs/rbac#operations-CrossAccountRequest-patchCrossAccountRequest
    fetch(`${API_BASE}/cross-account-requests/${requestId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'cancelled' })
    })
      .then(res => res.json())
      .then(res => {
        if (res.errors && res.errors.length > 0) {
          throw Error(res.errors.map(e => e.detail).join('\n'));
        }
        dispatch(addNotification({
          variant: 'success',
          title: 'Request cancelled successfully',
          dismissable: true
        }));
        setIsLoading(false);
        onClose(true);
      })
      .catch(err => {
        dispatch(addNotification({
          variant: 'danger',
          title: 'There was an error cancelling your request',
          description: err.message,
          dismissable: true
        }));
        setIsLoading(false);
      });
  };
  return (
    <Modal
      title="Cancel request?"
      isOpen
      variant="small"
      onClose={() => onClose(false)}
      actions={[
        <Button key="confirm" variant="danger" onClick={onCancel}>Yes, cancel</Button>,
        <Button key="cancel" variant="link" onClick={() => onClose(false)}>No, keep</Button>
      ]}
    >
      Request <b>{requestId}</b> will be withdrawn.
      {isLoading && <Spinner size="lg" />}
    </Modal>
  );
};

CancelRequestModal.displayName = 'CancelRequestModal';

export default CancelRequestModal;
