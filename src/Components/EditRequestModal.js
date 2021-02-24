import React from 'react';
import { Modal, Wizard } from '@patternfly/react-core';
import { Form, FormGroup, TextInput, Split, SplitItem, Popover, DatePicker, Title } from '@patternfly/react-core';
import HelpIcon from '@patternfly/react-icons/dist/js/icons/help-icon';
import MUARolesTable from './MUARolesTable';
import { capitalize } from '@patternfly/react-core/dist/esm/helpers/util';
import { isValidDate } from '@patternfly/react-core/dist/esm/components/CalendarMonth';
import { yyyyMMddFormat } from '@patternfly/react-core/dist/esm/components/DatePicker';

const nameHelperText = "Customers will be able to see this information as part of your request";
const helperTexts = {
  'first name': nameHelperText,
  'last name': nameHelperText,
  'account id': "This is the account ID(s) that you would like to receive read access to",
  'access duration': "This is the time frame you would like to be granted read access to accounts"
};
const getLabelIcon = field => (
  <Popover bodyContent={<p>{helperTexts[field]}</p>}>
    <button
      type="button"
      aria-label={`More info for ${field}`}
      onClick={e => e.preventDefault()}
      aria-describedby="form-name"
      className="pf-c-form__group-label-help"
    >
      <HelpIcon noVerticalAlign />
    </button>
  </Popover>
);

const today = new Date();
today.setHours(0);
today.setMinutes(0);
today.setSeconds(0);

const RequestDetailsForm = ({ user = {}, accountId, setAccountId, from, setFrom, to, setTo, disableAccount }) => {
  let [fromDate, setFromDate] = React.useState();

  const fromValidator = date => {
    if (isValidDate(date)) {
      if (date < today) {
        return 'From date must be today or later';
      }
    }
    return '';
  };
  const toValidator = date => {
    if (isValidDate(fromDate)) {
      if (fromDate > date) {
        setTo('');
        return 'To date must be after from date';
      }
      const maxToDate = new Date(fromDate);
      maxToDate.setFullYear(maxToDate.getFullYear() + 1);
      if (date > maxToDate) {
        setTo('');
        return "Access duration cannot be longer than one year";
      }
    }
    return '';
  };
  const onFromChange = (str, date) => {
    setFromDate(new Date(date));
    setFrom(str);
    setTo('');
  };

  return (
    <Form>
      <Title headingLevel="h2">Request details</Title>
        <Split hasGutter>
          <SplitItem isFilled>
            <FormGroup label="First name" labelIcon={getLabelIcon('first name')}>
              <TextInput id="first-name" value={user.first_name} isDisabled />
            </FormGroup>
          </SplitItem>
          <SplitItem isFilled>
            <FormGroup label="Last name" labelIcon={getLabelIcon('last name')}>
              <TextInput id="last-name" value={user.last_name} isDisabled />
            </FormGroup>
          </SplitItem>
        </Split>
        <FormGroup label="Account ID" isRequired labelIcon={getLabelIcon('account id')} helperText="Enter the account ID you would like access to">
          <TextInput id="account-id" value={accountId} onChange={val => setAccountId(val)} isRequired placeholder="Example, 865392" isDisabled={disableAccount} />
        </FormGroup>
        <FormGroup label="Access duration" isRequired labelIcon={getLabelIcon('access duration')}>
        <FormGroup label="From" isRequired>
          <DatePicker
            aria-label="Start date"
            value={from}
            onChange={onFromChange}
            validators={[fromValidator]}
          />
        </FormGroup>
        <FormGroup label="To" isRequired>
          <DatePicker
            aria-label="End date"
            value={to}
            onChange={date => setTo(date)}
            validators={[toValidator]}
            rangeStart={from}
          />
        </FormGroup>
      </FormGroup>
    </Form>
  );
}

// Can't use CSS with @redhat-cloud-services/frontend-components-config because it's scoped to <main> content
// rather than Modal content...
const spaceUnderStyle = { paddingBottom: '16px' };

const ReviewStep = ({ accountId, from, to, roles }) => (
  <React.Fragment>
    <Title headingLevel="h2" style={spaceUnderStyle}>Review details</Title>
    <table>
      <tr>
        <td style={spaceUnderStyle}><b>Account ID</b></td>
        <td style={spaceUnderStyle}>{accountId}</td>
      </tr>
      <tr>
        <td style={{ paddingRight: '32px' }}><b>Access duration</b></td>
        <td></td>
      </tr>
      <tr>
        <td>From</td>
        <td>{from}</td>
      </tr>
      <tr>
        <td style={spaceUnderStyle}>To</td>
        <td style={spaceUnderStyle}>{to}</td>
      </tr>
      <tr>
        <td><b>Roles</b></td>
        <td>{roles[0].name}</td>
      </tr>
      {roles.splice(1).map(role => 
        <tr key={role.uuid}>
          <td></td>
          <td>{role.name}</td>
        </tr>
      )}
    </table>
  </React.Fragment>
);

const EditRequestModal = ({ row = [], variant, onClose }) => {
  const [user, setUser] = React.useState();
  const [accountId, setAccountId] = React.useState(row[1]);
  const [from, setFrom] = React.useState(variant === 'renew' ? yyyyMMddFormat(new Date()) : row[2]);
  const [to, setTo] = React.useState(variant === 'renew' ? undefined : row[3]);
  const [roles, setRoles] = React.useState([]);

  React.useEffect(() => {
    window.insights.chrome.auth.getUser().then(user => {
      if (user && user.identity && user.identity.user) {
        setUser(user.identity.user);
      }
      else {
        console.log("couldnt fetch user?", user);
      }
    }, err => console.error("couldnt fetch user", err))
  }, []);

  const step1Complete = true || [accountId, from, to].every(Boolean);
  const step2Complete = roles.length > 0;

  const steps = [
    {
      name: 'Request details',
      component: <RequestDetailsForm
        user={user}
        accountId={accountId}
        setAccountId={setAccountId}
        from={from}
        setFrom={setFrom}
        to={to}
        setTo={setTo}
        disableAccount={variant === 'edit' || variant === 'renew'}
      />,
      enableNext: step1Complete
    },
    {
      name: 'Select roles',
      component: <MUARolesTable roles={roles} setRoles={setRoles} />,
      enableNext: step2Complete,
      canJumpTo: step1Complete
    },
    {
      name: 'Review details',
      component: <ReviewStep
        accountId={accountId}
        from={from}
        to={to}
        roles={roles}
      />,
      canJumpTo: step1Complete && step2Complete,
      nextButtonText: 'Finish'
    }
  ];

  console.log('roles', roles);
  const titleId = `${variant}-request`;
  const descriptionId = `${variant} request`;
  return (
    <Modal
      variant="large"
      showClose={false}
      hasNoBodyWrapper
      isOpen
      onClose={onClose}
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
    >
      <Wizard
        titleId={titleId}
        descriptionId={descriptionId}
        title={capitalize(variant) + ' request'}
        steps={steps}
        onClose={onClose}
        height={400}
      />
    </Modal>
  );
};

EditRequestModal.displayName = 'EditRequestModal';

export default EditRequestModal;
