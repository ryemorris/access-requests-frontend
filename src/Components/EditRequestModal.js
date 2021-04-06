import React from 'react';
import { Modal, Wizard } from '@patternfly/react-core';
import {
  Form,
  FormGroup,
  TextInput,
  Split,
  SplitItem,
  Popover,
  DatePicker,
  Title,
  Spinner
} from '@patternfly/react-core';
import HelpIcon from '@patternfly/react-icons/dist/js/icons/help-icon';
import { capitalize } from '@patternfly/react-core/dist/esm/helpers/util';
import { isValidDate } from '@patternfly/react-core/dist/esm/components/CalendarMonth';
import { useDispatch } from 'react-redux'
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import MUARolesTable from './MUARolesTable';

const nameHelperText = 'Customers will be able to see this information as part of your request';
const helperTexts = {
  'first name': nameHelperText,
  'last name': nameHelperText,
  'account number': 'This is the account number that you would like to receive read access to',
  'access duration': 'This is the time frame you would like to be granted read access to accounts'
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
today.setDate(today.getDate() - 1);
const dateFormat = date => date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
const dateParse = date => {
  const split = date.split('/');
  if (split.length !== 3) {
    return new Date();
  }
  let month = split[0].padStart(2, '0');
  let day = split[1].padStart(2, '0');
  let year = split[2].padStart(4, '0');
  return new Date(`${year}-${month}-${day}T00:00:00`);
};
const RequestDetailsForm = ({
  user = {},
  targetAccount,
  setTargetAccount,
  start,
  setStart,
  end,
  setEnd,
  disableAccount,
  isLoading
}) => {
  let [startDate, setStartDate] = React.useState();

  const startValidator = date => {
    if (isValidDate(date)) {
      if (date < today) {
        return 'Start date must be today or later';
      }
    }

    return '';
  };

  const endValidator = date => {
    if (isValidDate(startDate)) {
      if (startDate > date) {
        setEnd('');
        return 'End date must be after from date';
      }

      const maxToDate = new Date(startDate);
      maxToDate.setFullYear(maxToDate.getFullYear() + 1);
      if (date > maxToDate) {
        setEnd('');
        return 'Access duration cannot be longer than one year';
      }
    }

    return '';
  };

  const onStartChange = (str, date) => {
    setStartDate(new Date(date));
    setStart(str);
    if (isValidDate(date)) {
      date.setDate(date.getDate() + 7);
      setEnd(dateFormat(date));
    }
    else {
      setEnd('');
    }
  };

  return (
    <Form onSubmit={ev => ev.preventDefault()} isDisabled={isLoading}>
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
      <FormGroup label="Account number" isRequired labelIcon={getLabelIcon('account number')} helperText="Enter the account number you would like access to">
        <TextInput
          id="account-number"
          value={targetAccount}
          onChange={val => setTargetAccount(val)}
          isRequired
          placeholder="865392"
          isDisabled={disableAccount}
        />
      </FormGroup>
      <FormGroup label="Access duration" isRequired labelIcon={getLabelIcon('access duration')}>
        <Split>
          <SplitItem>
            <DatePicker
              width="300px"
              aria-label="Start date"
              value={start}
              dateFormat={dateFormat}
              dateParse={dateParse}
              placeholder="mm/dd/yyyy"
              onChange={onStartChange}
              validators={[startValidator]}
            />
          </SplitItem>
          <SplitItem style={{ padding: '6px 12px 0 12px' }}>
            to
          </SplitItem>
          <SplitItem>
            <DatePicker
              width="300px"
              aria-label="End date"
              value={end}
              dateFormat={dateFormat}
              dateParse={dateParse}
              placeholder="mm/dd/yyyy"
              onChange={date => setEnd(date)}
              validators={[endValidator]}
              rangeStart={start}
            />
          </SplitItem>
        </Split>
      </FormGroup>
    </Form>
  );
};

// Can't use CSS with @redhat-cloud-services/frontend-components-config because it's scoped to <main> content
// rather than Modal content...
const spaceUnderStyle = { paddingBottom: '16px' };
const ReviewStep = ({ targetAccount, start, end, roles, isLoading }) => (
  <React.Fragment>
    <Title headingLevel="h2" style={spaceUnderStyle}>Review details</Title>
    <table>
      <tr>
        <td style={spaceUnderStyle}><b>Account number</b></td>
        <td style={spaceUnderStyle}>{targetAccount}</td>
      </tr>
      <tr>
        <td style={{ paddingRight: '32px' }}><b>Access duration</b></td>
        <td></td>
      </tr>
      <tr>
        <td>From</td>
        <td>{start}</td>
      </tr>
      <tr>
        <td style={spaceUnderStyle}>To</td>
        <td style={spaceUnderStyle}>{end}</td>
      </tr>
      <tr>
        <td><b>Roles</b></td>
        <td>{roles[0]}</td>
      </tr>
      {roles.slice(1).map(role =>
        <tr key={role}>
          <td></td>
          <td>{role}</td>
        </tr>
      )}
    </table>
    {isLoading && <Spinner />}
  </React.Fragment>
);

const EditRequestModal = ({ row = [], variant, onClose }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState();
  const [targetAccount, setTargetAccount] = React.useState();
  const [start, setStart] = React.useState(variant === 'renew' ? dateFormat(new Date()) : undefined);
  const [end, setEnd] = React.useState();
  const [roles, setRoles] = React.useState([]);
  const dispatch = useDispatch();

  const isEdit = variant === 'edit';
  // We need to be logged in (and see the username) which is an async request.
  // If we're editing we also need to fetch the roles
  React.useEffect(() => {
    const userPromise = window.insights.chrome.auth.getUser();
    const detailsPromise = isEdit
      ? fetch(`${API_BASE}/cross-account-requests/${row[0]}/`).then(res => res.json())
      : new Promise(res => res(true));

    Promise.all([
      userPromise,
      detailsPromise
    ])
      .then(([user, details]) => {
        if (user && user.identity && user.identity.user) {
          setUser(user.identity.user);
        }
        else {
          throw Error("Couldn't get current user. Make sure you're logged in");
        }
        if (isEdit) {
          if (details) {
            setTargetAccount(details.target_account);
            setStart(details.start_date);
            setEnd(details.end_date);
            setRoles(details.roles.map(role => role.display_name));
          }
          else {
            if (details.errors) {
              throw Error(details.errors.map(e => e.detail).join('\n'));
            }
            else {
              throw Error(`Could not fetch details for request ${row[0]}`);
            }
          }
        }
        setIsLoading(false);
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

  const onSave = () => {
    setIsLoading(true);
    // https://cloud.redhat.com/docs/api-docs/rbac#operations-CrossAccountRequest-createCrossAccountRequests
    const body = {
      target_account: targetAccount,
      start_date: start,
      end_date: end,
      roles
    };
    fetch(`${API_BASE}/cross-account-requests/${isEdit ? `?uuid=${row[0]}` : ''}`, {
      method: isEdit ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(res => {
        if (res.errors && res.errors.length > 0) {
          throw Error(res.errors[0].detail);
        }
        dispatch(addNotification({
          variant: 'success',
          title: `${capitalize(variant)}d access request`,
          description: res.request_id,
          dismissable: true
        }));
        onClose(true);
      })
      .catch(err => {
        dispatch(addNotification({
          variant: 'danger',
          title: `Could not ${variant} access request`,
          description: err.message,
          dismissable: true
        }));
        setIsLoading(false);
      });
  };

  const step1Complete = [targetAccount, start, end].every(Boolean);
  const step2Complete = roles.length > 0;
  const steps = [
    {
      name: 'Request details',
      component: <RequestDetailsForm
        user={user}
        targetAccount={targetAccount}
        setTargetAccount={setTargetAccount}
        start={start}
        setStart={setStart}
        end={end}
        setEnd={setEnd}
        disableAccount={variant === 'edit' || variant === 'renew'}
        isLoading={isLoading}
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
        targetAccount={targetAccount}
        start={start}
        end={end}
        roles={roles}
        isLoading={isLoading}
      />,
      canJumpTo: step1Complete && step2Complete,
      enableNext: !isLoading,
      nextButtonText: 'Finish'
    }
  ];

  const titleId = `${variant}-request`;
  const descriptionId = `${variant} request`;
  return (
    <Modal
      variant="large"
      style={{ height: '900px' }}
      showClose={false}
      hasNoBodyWrapper
      isOpen
      onClose={() => onClose(false)}
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
    >
      <Wizard
        titleId={titleId}
        descriptionId={descriptionId}
        title={capitalize(variant) + ' request'}
        steps={steps}
        onClose={() => onClose(false)}
        onSave={onSave}
      />
    </Modal>
  );
};

EditRequestModal.displayName = 'EditRequestModal';

export default EditRequestModal;
