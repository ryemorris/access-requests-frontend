import React from 'react';
import { withRouter } from 'react-router-dom';
import { PageSection, Title } from '@patternfly/react-core';

import AccessRequestsTable from '../../Components/AccessRequestsTable/AccessRequestsTable';

const AccessRequestsPage = () => {
  return (
    <React.Fragment>
      <PageSection variant="light">
        <Title headingLevel="h1">Access Requests</Title>
        <p>Below is a list of all submitted requests for read only account access.</p>
      </PageSection>
      <PageSection variant="light" padding={{ default: "noPadding" }}>
        <AccessRequestsTable />
      </PageSection>
    </React.Fragment>
  );
};

export default withRouter(AccessRequestsPage);
