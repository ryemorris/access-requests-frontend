import React from 'react';
import {
  Label,
  Toolbar,
  ToolbarItem,
  ToolbarContent,
  Button,
  InputGroup,
  TextInput,
  Pagination,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  Select,
  SelectOption,
  ChipGroup,
  Chip,
  Bullseye,
  Spinner,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Title
} from '@patternfly/react-core';
import { TableComposable, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import CancelRequestModal from '../CancelRequestModal';
import EditRequestModal from '../EditRequestModal';
import { capitalize } from '@patternfly/react-core/dist/esm/helpers/util';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';
import FilterIcon from '@patternfly/react-icons/dist/js/icons/filter-icon';
import PlusCircleIcon from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';
import { useDispatch } from 'react-redux'
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { Link } from 'react-router-dom';
import { getInternalActions, StatusLabel } from '../../Helpers/getActions';

const statuses = [
  'pending',
  'approved',
  'denied',
  'cancelled',
  'expired'
];

const AccessRequestsTable = ({ isInternal }) => {
  const columns = isInternal
    ? ['Request ID', 'Account number', 'Start date', 'End date', 'Created', 'Status']
    : ['Request ID', 'First name', 'Last name', 'Start date', 'End date', 'Created', 'Decision'];

  // Sorting
  const [activeSortIndex, setActiveSortIndex] = React.useState(4);
  const [activeSortDirection, setActiveSortDirection] = React.useState('desc');
  const onSort = (_ev, index, direction) => {
    setActiveSortIndex(index);
    setActiveSortDirection(direction);
  };

  // Pagination
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const AccessRequestsPagination = ({ id }) => (
    <Pagination
      itemCount={numRows}
      perPage={perPage}
      page={page}
      onSetPage={(_ev, pageNumber) => setPage(pageNumber)}
      id={'access-requests-table-pagination-' + id}
      variant={id}
      onPerPageSelect={(_ev, perPage) => setPerPage(perPage)}
    />
  );

  // Filtering
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [filterColumn, setFilterColumn] = React.useState(isInternal ? columns[0] : columns[1]);
  const [isSelectOpen, setIsSelectOpen] = React.useState(false);
  const [statusSelections, setStatusSelections] = React.useState([]);
  const [idFilter, setIdFilter] = React.useState('');
  const [accountFilter, setAccountFilter] = React.useState('');
  // For external view only
  const [firstNameFilter, setFirstNameFilter] = React.useState('');
  const [lastNameFilter, setLastNameFilter] = React.useState('');

  // Row loading
  const [isLoading, setIsLoading] = React.useState(true);
  const [numRows, setNumRows] = React.useState(0);
  const [rows, setRows] = React.useState([]);
  const dispatch = useDispatch();
  const fetchAccessRequests = () => {
    setIsLoading(true);
    const listUrl = new URL(`${window.location.origin}${API_BASE}/cross-account-requests/`);
    if (isInternal) {
      listUrl.searchParams.append('query_by', 'user_id');
    }
    listUrl.searchParams.append('offset', (page - 1) * perPage);
    listUrl.searchParams.append('limit', perPage);
    // Currently unsupported :(
    if (firstNameFilter) {
      listUrl.searchParams.append('first_name', firstNameFilter);
    }
    if (lastNameFilter) {
      listUrl.searchParams.append('last_name', lastNameFilter);
    }
    if (idFilter) {
      listUrl.searchParams.append('id', idFilter);
    }
    if (accountFilter) {
      listUrl.searchParams.append('account_number', accountFilter);
    }
    if (statusSelections.length > 0) {
      listUrl.searchParams.append('status', statusSelections.join(','));
    }
    // Currently unsupported :(
    listUrl.searchParams.append('sort_by', columns[activeSortIndex].toLowerCase());
    listUrl.searchParams.append('sort_direction', activeSortDirection);

    fetch(listUrl.href)
      .then(res => res.json())
      .then(res => {
        setNumRows(res.meta.count);
        setRows(res.data.map(d => isInternal
          ? [
            d.request_id,
            d.target_account,
            d.start_date,
            d.end_date,
            d.created,
            d.status
          ]
          : [
            d.request_id,
            d.first_name,
            d.last_name,
            d.start_date,
            d.end_date,
            d.created,
            d.status
          ]));
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        dispatch(addNotification({
          variant: 'danger',
          title: 'Could not list access requests',
          description: err.message
        }));
      });
  };
  React.useEffect(() => { fetchAccessRequests() }, [
    firstNameFilter,
    lastNameFilter,
    idFilter,
    accountFilter,
    statusSelections,
    activeSortIndex,
    activeSortDirection,
    perPage,
    page
  ]);

  // Modal actions
  const [openModal, setOpenModal] = React.useState({ type: null });
  const onModalClose = isChanged => {
    setOpenModal({ type: null });
    if (isChanged) {
      console.log('isChanged', isChanged);
      fetchAccessRequests();
    }
  };
  const modals = (
    <React.Fragment>
      {openModal.type === 'cancel' &&
        <CancelRequestModal
          requestId={openModal.requestId}
          onClose={onModalClose}
        />}
      {['edit', 'renew', 'create'].includes(openModal.type) &&
        <EditRequestModal
          variant={openModal.type}
          requestId={openModal.requestId}
          onClose={onModalClose}
        />}
    </React.Fragment>
  );

  // Rendering
  const createButton = isInternal && (
    <Button variant="primary" onClick={() => setOpenModal({ type: 'create' })}>
      Create request
    </Button>
  );
  if (rows.length === 0) {
    return (
      <Bullseye style={{ height: 'auto' }} className="pf-u-mt-lg">
        {isLoading
          ? <Spinner size="xl" />
          : <EmptyState variant="large">
              <EmptyStateIcon icon={PlusCircleIcon} />
              <Title headingLevel="h3" size="lg">
                {isInternal
                  ? 'No access requests'
                  : 'You have no access requests'}
              </Title>
              <EmptyStateBody>
                {isInternal
                  ? 'Click the button below to create an access request.'
                  : 'You have no pending Red Hat access requests.'}
              </EmptyStateBody>
              {createButton}
            </EmptyState>
        }
        {modals}
      </Bullseye>
    );
  }

  const selectLabelId = 'filter-status';
  const selectPlaceholder = `Filter by ${columns[columns.length - 1].toLowerCase()}`;
  const FilterTextForm = ({ colName, value, setValue }) => {
    const [inputValue, setInputValue] = React.useState(value);
    return (
      <form
        style={{ display: 'flex' }}
        onSubmit={ev => {
          ev.preventDefault();
          setValue(inputValue);
        }}
      >
        <TextInput
          name={`${colName}-filter`}
          id={`${colName}-filter`}
          type="search"
          placeholder={`Filter by ${colName}`}
          aria-label={`${colName} search input`}
          value={inputValue}
          onChange={val => setInputValue(val)}
        />
        <Button variant="control" type="submit" aria-label={`Search button for ${colName} filter`}>
          <SearchIcon />
        </Button>
      </form>
    );
  }
  const toolbar = (
    <Toolbar id="access-requests-table-toolbar">
      <ToolbarContent>
        <ToolbarItem>
          <InputGroup>
            <Dropdown
              isOpen={isDropdownOpen}
              onSelect={ev => { setIsDropdownOpen(false); setFilterColumn(ev.target.value); setIsSelectOpen(false); }}
              toggle={
                <DropdownToggle onToggle={isOpen => setIsDropdownOpen(isOpen)}>
                  <FilterIcon /> {filterColumn}
                </DropdownToggle>
              }
              // https://marvelapp.com/prototype/257je526/screen/74764732
              dropdownItems={(isInternal ? [0, 1, 5] : [1, 2, 6]).map(i => columns[i]).map(colName =>
                // Filterable columns are RequestID, AccountID, and Status
                <DropdownItem key={colName} value={colName} component="button">
                  {capitalize(colName)}
                </DropdownItem>
              )}
            />
            {['Status', 'Decision'].includes(filterColumn) &&
              <React.Fragment>
                <span id={selectLabelId} hidden>{selectPlaceholder}</span>
                <Select
                  aria-labelledby={selectLabelId}
                  variant="checkbox"
                  aria-label="Select statuses"
                  onToggle={isOpen => setIsSelectOpen(isOpen)}
                  onSelect={(_ev, selection) => {
                    if (statusSelections.includes(selection)) {
                      setStatusSelections(statusSelections.filter(s => s !== selection));
                    }
                    else {
                      setStatusSelections([...statusSelections, selection]);
                    }
                  }}
                  isOpen={isSelectOpen}
                  selections={Array.from(statusSelections)}
                  isCheckboxSelectionBadgeHidden
                  placeholderText={selectPlaceholder}
                >
                  {statuses.map(status =>
                    <SelectOption key={status} value={status}>{capitalize(status)}</SelectOption>
                  )}
                </Select>
              </React.Fragment>
            }
            {filterColumn === 'First name' &&
              <FilterTextForm colName={filterColumn} value={firstNameFilter} setValue={setFirstNameFilter} />
            }
            {filterColumn === 'Last name' &&
              <FilterTextForm colName={filterColumn} value={lastNameFilter} setValue={setLastNameFilter} />
            }
            {filterColumn === 'Request ID' &&
              <FilterTextForm colName={filterColumn} value={idFilter} setValue={setIdFilter} />
            }
            {filterColumn === 'Account number' &&
              <FilterTextForm colName={filterColumn} value={accountFilter} setValue={setAccountFilter} />
            }
          </InputGroup>
        </ToolbarItem>
        <ToolbarItem>
          {createButton}
        </ToolbarItem>
        <ToolbarItem variant="pagination" align={{ default: 'alignRight' }}>
          <AccessRequestsPagination id="top" />
        </ToolbarItem>
      </ToolbarContent>
      <ToolbarContent>
        <ChipGroup categoryName="Status">
          {statusSelections.map(status =>
            <Chip key={status} onClick={() => setStatusSelections(statusSelections.filter(s => s !== status))}>
              {status}
            </Chip>
          )}
        </ChipGroup>
        {firstNameFilter && 
          <ChipGroup categoryName="First name">
            <Chip onClick={() => setFirstNameFilter('')}>
              {firstNameFilter}
            </Chip>
          </ChipGroup>
        }
        {lastNameFilter && 
          <ChipGroup categoryName="Last name">
            <Chip onClick={() => setLastNameFilter('')}>
              {lastNameFilter}
            </Chip>
          </ChipGroup>
        }
        {idFilter && 
          <ChipGroup categoryName="Request ID">
            <Chip onClick={() => setIdFilter('')}>
              {idFilter}
            </Chip>
          </ChipGroup>
        }
        {accountFilter &&
          <ChipGroup categoryName="Account number">
            <Chip onClick={() => setAccountFilter('')}>
              {accountFilter}
            </Chip>
          </ChipGroup>
        }
        {(statusSelections.length > 0 || idFilter || accountFilter) &&
          <Button
            variant="link"
            onClick={() => { setStatusSelections([]); setIdFilter(''); setAccountFilter(''); }}
          >
            Clear filters
          </Button>}
      </ToolbarContent>
    </Toolbar>
  );
  function getColumnWidth(columnIndex) {
    if (isInternal) {
      return columnIndex === 0 ? 30 : 15;
    }

    return [0, 6].includes(columnIndex) ? 20 : 10;
  }
  const table = (
    <TableComposable aria-label="Access requests table" variant="compact">
      <Thead>
        <Tr>
          {columns.map((column, columnIndex) => 
            <Th
              key={columnIndex}
              sort={{ sortBy: { index: activeSortIndex, direction: activeSortDirection }, onSort, columnIndex }}
              width={getColumnWidth(columnIndex)}
            >
              {column}
            </Th>
          )}
          {isInternal && <Th />}
        </Tr>
      </Thead>
      <Tbody>
        {isLoading
          ?
            <Tr colSpan={6}>
              <Bullseye>
                <Spinner size="xl" />
              </Bullseye>
            </Tr>
          : rows.map((row, rowIndex) =>
            <Tr key={rowIndex}>
              <Td dataLabel={columns[0]}>
                <Link to={`/${row[0]}`}>{row[0]}</Link>
              </Td>
              <Td dataLabel={columns[1]}>
                {row[1]}
              </Td>
              <Td dataLabel={columns[2]}>
                {row[2]}
              </Td>
              <Td dataLabel={columns[3]}>
                {row[3]}
              </Td>
              <Td dataLabel={columns[4]}>
                {row[4]}
              </Td>
              {isInternal
                ? <Td dataLabel={columns[5]}>
                    <StatusLabel
                      requestId={row[0]}
                      status={row[5]}
                      onLabelClick={() => setStatusSelections([...statusSelections.filter(s => s !== status), status])}
                      hideActions
                    />
                  </Td>
                : <Td dataLabel={columns[5]}>
                    {row[5]}
                  </Td>
              }
              {isInternal
                // Different actions based on status
                ? <Td actions={getInternalActions(row[5], row[0], setOpenModal)} />
                : <Td dataLabel={columns[6]}>
                    <StatusLabel
                      requestId={row[0]}
                      status={row[6]}
                    />
                  </Td>
              }
            </Tr>
          )}
      </Tbody>
    </TableComposable>
  );

  return (
    <React.Fragment>
      {toolbar}
      {table}
      <AccessRequestsPagination id="bottom" />
      {modals}
    </React.Fragment>
  );
};

AccessRequestsTable.displayName = 'AccessRequestsTable';

export default AccessRequestsTable;
