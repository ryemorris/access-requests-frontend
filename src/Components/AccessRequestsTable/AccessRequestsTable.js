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
import { getLabelProps } from '../../Helpers/getLabelProps';

const statuses = [
  'pending',
  'approved',
  'denied',
  'cancelled',
  'expired'
];
function getActions(row, setOpenModal) {
  const status = row[5];
  const items = [];
  if (status === 'pending') {
    items.push({
      title: 'Edit',
      onClick: () => setOpenModal({ type: 'edit', row })
    });
    items.push({
      title: 'Cancel',
      onClick: () => setOpenModal({ type: 'cancel', row })
    });
  }
  else if (status === 'expired') {
    items.push({
      title: 'Renew',
      onClick: () => setOpenModal({ type: 'renew', row })
    });
  }

  return { items, disable: items.length === 0 };
}



const AccessRequestsTable = ({ isApprover }) => {
  const columns = ['Request ID', 'Account number', 'Start date', 'End date', 'Created', 'Status'];

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
      itemCount={rows.length}
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
  const [filterColumn, setFilterColumn] = React.useState(columns[0]);
  const [isSelectOpen, setIsSelectOpen] = React.useState(false);
  const [statusSelections, setStatusSelections] = React.useState([]);
  const [idFilter, setIdFilter] = React.useState('');
  const [idFilters, setIdFilters] = React.useState([]);
  const [accountFilter, setAccountFilter] = React.useState('');
  const [accountFilters, setAccountFilters] = React.useState([]);
  const selectLabelId = 'filter-status';
  const selectPlaceholder = 'Filter by status';

  // Row loading
  const [isLoading, setIsLoading] = React.useState(true);
  const [rows, setRows] = React.useState([
    // ['0004', '84282', '2020-04-24', '2021-04-24', '2029-02-13T11:24:03.591Z', 'pending'],
    // ['0003', '87654', '2020-02-13', '2021-04-24', '2029-02-12T11:24:03.591Z', 'approved'],
    // ['0002', '114470', '2019-04-24', '2020-04-24', '2020-02-13T11:24:03.591Z', 'denied'],
    // ['0001', '169280', '2019-04-24', '2020-04-24', '2019-02-13T11:24:03.591Z', 'expired'],
    // ['0000', '169280', '2019-04-24', '2020-04-24', '2018-02-13T11:24:03.591Z', 'cancelled']
  ]);
  const dispatch = useDispatch();
  const fetchAccessRequests = () => {
    setIsLoading(true);
    const listUrl = new URL(`${window.location.origin}${API_BASE}/cross-account-requests/`);
    listUrl.searchParams.append('query_by', 'user_id');
    listUrl.searchParams.append('offset', (page - 1) * perPage);
    listUrl.searchParams.append('limit', perPage);
    // Currently unsupported :(
    if (statusSelections.length > 0) {
      listUrl.searchParams.append('status', statusSelections.join(','));
    }
    // Currently unsupported :(
    listUrl.searchParams.append('sort_by', columns[activeSortIndex].toLowerCase());
    listUrl.searchParams.append('sort_direction', activeSortDirection);

    fetch(listUrl.href)
      .then(res => res.json())
      .then(res => {
        setRows(res.data.map(d => [
          d.request_id,
          d.target_account,
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
  React.useEffect(() => {
    fetchAccessRequests();
  }, [statusSelections, activeSortIndex, activeSortDirection, perPage, page]);

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
          requestId={openModal.row[0]}
          onClose={onModalClose}
        />}
      {['edit', 'renew', 'create'].includes(openModal.type) &&
        <EditRequestModal
          variant={openModal.type}
          row={openModal.row}
          onClose={onModalClose}
        />}
    </React.Fragment>
  );

  // Rendering
  const createButton = !isApprover && (
    <Button variant="primary" onClick={() => setOpenModal({ type: 'create' })}>
      Create request
    </Button>
  );
  if (rows.length === 0) {
    return (
      <Bullseye>
        {isLoading
          ? <Spinner size="xl" />
          : <EmptyState variant="large">
              <EmptyStateIcon icon={PlusCircleIcon} />
              <Title headingLevel="h3" size="lg">
                {isApprover
                  ? 'You have no access requests'
                  : 'No access requests'}
              </Title>
              <EmptyStateBody>
                {isApprover
                  ? 'You have no pending Red Hat access requests.'
                  : 'Click the button below to create an access request.'}
              </EmptyStateBody>
              {createButton}
            </EmptyState>
        }
        {modals}
      </Bullseye>
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
              dropdownItems={[0, 1, 5].map(i => columns[i]).map(colName =>
                // Filterable columns are RequestID, AccountID, and Status
                <DropdownItem key={colName} value={colName} component="button">
                  {capitalize(colName)}
                </DropdownItem>
              )}
            />
            {filterColumn === 'Status' &&
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
            {filterColumn === 'Request ID' &&
              <form
                style={{ display: 'flex' }}
                onSubmit={ev => {
                  ev.preventDefault();
                  setIdFilters(idFilters.concat(idFilter));
                  setIdFilter('');
                }}
              >
                <TextInput
                  name="idSearch"
                  id="idSearch"
                  type="search"
                  aria-label="Request id search input"
                  value={idFilter}
                  onChange={val => setIdFilter(val)}
                />
                <Button variant="control" type="submit" aria-label="Search button for request id input">
                  <SearchIcon />
                </Button>
              </form>
            }
            {filterColumn === 'Account number' &&
              <form
                style={{ display: 'flex' }}
                onSubmit={ev => {
                  ev.preventDefault();
                  setAccountFilters(accountFilters.concat(accountFilter));
                  setAccountFilter('');
                }}
              >
                <TextInput
                  name="idSearch"
                  id="idSearch"
                  type="search"
                  aria-label="Account number search input"
                  value={accountFilter}
                  onChange={val => setAccountFilter(val)}
                />
                <Button variant="control" type="submit" aria-label="Search button for account number input">
                  <SearchIcon />
                </Button>
              </form>
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
        <ChipGroup categoryName="Request ID">
          {idFilters.map(id =>
            <Chip key={id} onClick={() => setIdFilters(idFilters.filter(i => i !== id))}>
              {id}
            </Chip>
          )}
        </ChipGroup>
        <ChipGroup categoryName="Account number">
          {accountFilters.map(acc =>
            <Chip key={acc} onClick={() => setAccountFilters(accountFilters.filter(a => a !== acc))}>
              {acc}
            </Chip>
          )}
        </ChipGroup>
        {(statusSelections.length > 0 || idFilters.length > 0 || accountFilters.length > 0) &&
          <Button
            variant="link"
            onClick={() => { setStatusSelections([]); setIdFilters([]); setAccountFilters([]); }}
          >
            Clear filters
          </Button>}
      </ToolbarContent>
    </Toolbar>
  );
  const table = (
    <TableComposable aria-label="Access requests table" variant="compact">
      <Thead>
        <Tr>
          {columns.map((column, columnIndex) => 
            <Th
              key={columnIndex}
              sort={{ sortBy: { index: activeSortIndex, direction: activeSortDirection }, onSort, columnIndex }}
              width={columnIndex === 0 ? 30 : 15}
            >
              {column}
            </Th>
          )}
          <Th />
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
              <Td dataLabel={columns[5]}>
                <Label {...getLabelProps(row[5])} render={({ content, className }) =>
                  <button className={className} onClick={() => setStatusSelections([...statusSelections.filter(s => s !== row[5]), row[5]])}>
                    {content}
                  </button>
                }>
                  {capitalize(row[5])}
                </Label>
              </Td>
              {/* Different actions based on status */}
              <Td actions={getActions(row, setOpenModal)} />
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
