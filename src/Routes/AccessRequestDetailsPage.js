import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  PageSection,
  Title,
  Card,
  CardTitle,
  CardBody,
  Flex,
  FlexItem,
  Spinner,
  Button,
  Label
} from '@patternfly/react-core';
import { capitalize } from '@patternfly/react-core/dist/esm/helpers/util';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import MUARolesTable from '../Components/MUARolesTable';
import { getLabelProps } from '../Helpers/getLabelProps';

const AccessRequestDetailsPage = ({ requestId, canApprove }) => {
  const [request, setRequest] = React.useState();
  const dispatch = useDispatch();
  React.useEffect(() => {
    fetch(`${API_BASE}/cross-account-requests/${requestId}/`)
      .then(res => res.json())
      .then(res => {
        if (res.errors) {
          throw Error(details.errors.map(e => e.detail).join('\n'));
        }
        setRequest(res);
      })
      .catch(err => {
        dispatch(addNotification({
          variant: 'danger',
          title: 'Could not load access request',
          description: err.message,
          dismissable: true
        }));
      });
  }, []);
  
  const requestDisplayProps = [
    ...(canApprove
      ? [
          ['first_name', 'First name'],
          ['last_name', 'Last name']
      ]
      : [
          ['request_id', 'Request ID'],
          ['target_account', 'Account number']
      ]),
    ['start_date', 'Start date'],
    ['end_date', 'End date'],
    ['created', 'Submitted']
  ];
  return (
    <React.Fragment>
      <PageSection variant="light">
        <Breadcrumb>
          <BreadcrumbItem render={() => <Link to="/">Red Hat Access Requests</Link>} />
          <BreadcrumbItem>{requestId}</BreadcrumbItem>
        </Breadcrumb>
        <Title headingLevel="h1" size="2xl" className="pf-u-pt-md">
          {requestId}
        </Title>
      </PageSection>
      <PageSection>
        <Flex spaceItems={{ xl: 'spaceItemsLg' }} direction={{ default: 'column', lg: 'row' }}>
          <FlexItem flex={{ default: 'flex_1' }} alignSelf={{ default: 'alignSelfStretch' }}>
            <Card style={{ height: '100%' }}>
              <CardTitle>
                <Title headingLevel="h2" size="xl">
                  Request details
                </Title>
              </CardTitle>
              <CardBody>
                {!request ? <Spinner size="xl" /> :
                  <React.Fragment>
                    <div className="pf-u-pb-md pf-u-pt-md">
                      {canApprove
                        ?
                          <React.Fragment>
                            <label><b>Request decision</b></label>
                            <br />
                            <Button className="pf-u-mr-md">Approve</Button>
                            <Button className="pf-u-mr-md" variant="danger">Deny</Button>
                          </React.Fragment>
                        :
                          <div className="pf-u-pb-sm pf-u-pt-sm">
                            <label><b>Request status</b></label>
                            <br />
                            <Label className="pf-u-mt-sm" {...getLabelProps(request.status)}>
                              {capitalize(request.status)}
                            </Label>
                          </div>
                      }
                    </div>
                    {requestDisplayProps.map(([key, val]) =>
                      <div className="pf-u-pb-sm pf-u-pt-sm">
                        <label><b>{val}</b></label>
                        <br />
                        <div>{request[key]}</div>
                      </div>
                    )}
                  </React.Fragment>
                }
              </CardBody>
            </Card>
          </FlexItem>
          <FlexItem flex={{ default: 'flex_3' }} grow={{ default: 'grow' }} alignSelf={{ default: 'alignSelfStretch' }}>
            <Card style={{ height: '100%' }}>
              <CardTitle>
                <Title headingLevel="h2" size="xl">
                  Roles requested
                </Title>
              </CardTitle>
              <CardBody>
                {!request ? <Spinner size="xl" /> :
                  <MUARolesTable roles={request.roles} />
                }
              </CardBody>
            </Card>
          </FlexItem>
        </Flex>
      </PageSection>
    </React.Fragment>
  );
}

export default AccessRequestDetailsPage;

