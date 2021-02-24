import React from 'react';
import { Label, Toolbar, ToolbarItem, ToolbarContent, Button, InputGroup, TextInput, Pagination, Dropdown, DropdownToggle, DropdownItem, Select, SelectOption, ChipGroup, Chip } from '@patternfly/react-core';
import { TableComposable, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import CancelRequestModal from '../CancelRequestModal';
import EditRequestModal from '../EditRequestModal';
import { capitalize } from '@patternfly/react-core/dist/esm/helpers/util';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';
import FilterIcon from '@patternfly/react-icons/dist/js/icons/filter-icon';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import ErrorCircleOIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
// TODO: where are these designer icons?
import PendingIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import ClockIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';

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
  if (status === 'expired') {
    items.push({
      title: 'Renew',
      onClick: () => setOpenModal({ type: 'renew', row })
    })
  }

  return { items, disable: items.length === 0 };
}

function getLabelProps(status) {
  let color = null;
  let icon = null;
  if (status === 'pending') {
    color = 'blue';
    icon = <PendingIcon />;
  }
  if (status === 'approved') {
    color = 'green';
    icon = <CheckCircleIcon />;
  }
  if (status === 'denied') {
    color = 'red';
    icon = <ExclamationCircleIcon />;
  }
  if (status === 'cancelled') {
    color = 'orange';
    icon = <ErrorCircleOIcon />;
  }
  if (status === 'expired') {
    color = 'grey';
    icon = <ClockIcon />;
  }

  return { color, icon };
}

// TODO: review with designer that this is GB format
const startEndDateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' });
const createdDateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' });

const AccessRequestsTable = () => {
  const columns = ['Request ID', 'Account ID', 'Start date', 'End date', 'Created', 'Status'];
  const [rows, setRows] = React.useState([
    ['0004', '84282', '2020-04-24', '2021-04-24', '2029-02-13T11:24:03.591Z', 'pending'],
    ['0003', '87654', '2020-02-13', '2021-04-24', '2029-02-12T11:24:03.591Z', 'approved'],
    ['0002', '114470', '2019-04-24', '2020-04-24', '2020-02-13T11:24:03.591Z', 'denied'],
    ['0001', '169280', '2019-04-24', '2020-04-24', '2019-02-13T11:24:03.591Z', 'expired'],
    ['0000', '169280', '2019-04-24', '2020-04-24', '2018-02-13T11:24:03.591Z', 'cancelled'],
  ]);
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
      id={"access-requests-table-pagination-" + id}
      variant={id} 
      onPerPageSelect={(_ev, perPage) => setPerPage(perPage)}
    />
  );

  // Filtering
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [filterColumn, setFilterColumn] = React.useState(columns[0]);
  const [isSelectOpen, setIsSelectOpen] = React.useState(false);
  const [statusSelections, setStatusSelections] = React.useState([]);
  const selectLabelId = "filter-status";
  const selectPlaceholder = "Filter by status";

  // Modal actions
  const [openModal, setOpenModal] = React.useState({ type: null });

  return (
    <React.Fragment>
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
              {filterColumn === 'Status' ?
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
                :
                <React.Fragment>
                  <TextInput name="requestsSearch" id="requestsSearch" type="search" aria-label="Search input" />
                  <Button variant="control" aria-label="Search button for search input">
                    <SearchIcon />
                  </Button>
                </React.Fragment>
              }
            </InputGroup>
          </ToolbarItem>
          <ToolbarItem>
            <Button variant="primary" onClick={() => setOpenModal({ type: 'create' })}>Create request</Button>
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
          {statusSelections.length > 0 && <Button variant="link" onClick={() => setStatusSelections([])}>Clear filters</Button>}
        </ToolbarContent>
      </Toolbar>
      <TableComposable
        aria-label="Access requests table"
        variant="compact"
      >
        <Thead>
          <Tr>
            {columns.map((column, columnIndex) => (
              <Th key={columnIndex} sort={{ sortBy: { index: activeSortIndex, direction: activeSortDirection }, onSort, columnIndex }}>{column}</Th>
            ))}
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {rows
            .filter(row => statusSelections.length > 0 ? statusSelections.includes(row[5]) : true)
            .sort((a, b) => {
              if (activeSortDirection === 'asc') {
                return a[activeSortIndex].localeCompare(b[activeSortIndex]);
              }
              return b[activeSortIndex].localeCompare(a[activeSortIndex]);
            })
            .map((row, rowIndex) => (
              <Tr key={rowIndex}>
                <Td dataLabel={columns[0]}>
                  <a href={`/settings/rbac/access-requests/${row[0]}`}>{row[0]}</a>
                </Td>
                <Td dataLabel={columns[1]}>
                  {row[1]}
                </Td>
                <Td dataLabel={columns[2]}>
                  {startEndDateFormat.format(new Date(row[2]))}
                </Td>
                <Td dataLabel={columns[3]}>
                  {startEndDateFormat.format(new Date(row[3]))}
                </Td>
                <Td dataLabel={columns[4]}>
                  {createdDateFormat.format(new Date(row[4]))} UTC
                </Td>
                <Td dataLabel={columns[5]}>
                  <Label {...getLabelProps(row[5])}>{capitalize(row[5])}</Label>
                </Td>
                {/* Different actions based on status */}
                <Td actions={getActions(row, setOpenModal)} />
              </Tr>
            ))}
        </Tbody>
      </TableComposable>
      <AccessRequestsPagination id="bottom" />
      {openModal.type === 'cancel' &&
        <CancelRequestModal
          requestId={openModal.row[0]}
          onClose={() => setOpenModal({ type: null })}
        />}
      {['edit', 'renew', 'create'].includes(openModal.type) &&
        <EditRequestModal
          variant={openModal.type}
          row={openModal.row}
          onClose={() => setOpenModal({ type: null })}
        />}
    </React.Fragment>
  );
};

AccessRequestsTable.displayName = 'AccessRequestsTable';

export default AccessRequestsTable;
