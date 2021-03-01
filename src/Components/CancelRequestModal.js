import React from 'react';
import { Modal, Button } from '@patternfly/react-core';

const CancelRequestModal = ({ requestId, onClose }) => {
  return (
    <Modal
      title="Cancel request?"
      isOpen
      variant="small"
      onClose={onClose}
      actions={[
        <Button key="confirm" variant="danger" onClick={onClose}>Yes, cancel</Button>,
        <Button key="cancel" variant="link" onClick={onClose}>No, keep</Button>
      ]}
    >
      Request <b>{requestId}</b> will be withdrawn.
    </Modal>
  );
};

CancelRequestModal.displayName = 'CancelRequestModal';

export default CancelRequestModal;
