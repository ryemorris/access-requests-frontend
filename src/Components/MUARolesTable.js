import React from 'react';
import {
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Select,
  Dropdown,
  SelectOption,
  DropdownItem,
  DropdownToggle,
  InputGroup,
  TextInput,
  Button,
  Pagination,
  ChipGroup,
  Chip,
  DropdownToggleCheckbox,
  Spinner,
} from '@patternfly/react-core';
import { TableComposable, Thead, Tbody, Tr, Th, Td, TableText } from '@patternfly/react-table';
import FilterIcon from '@patternfly/react-icons/dist/js/icons/filter-icon';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';
import { capitalize } from '@patternfly/react-core/dist/esm/helpers/util';
import { css } from '@patternfly/react-styles';
import { useDispatch } from 'react-redux'
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

let rolesCache = [];
let applicationsCache = [];

const MUARolesTable = ({ roles: selectedRoles, setRoles: setSelectedRoles }) => {
  const columns = ['Role name', 'Role description', 'Permissions'];
  const [rows, setRows] = React.useState(Array.from(rolesCache));
  const [applications, setApplications] = React.useState([]);
  React.useEffect(() => {
    if (rolesCache.length === 0 || applicationsCache.length === 0) {
      fetch(`${API_BASE}/roles/?limit=9999&order_by=display_name&add_fields=groups_in_count`)
        .then(res => res.json())
        .then(({ data }) => {
          data.forEach(role => {
            role.isExpanded = false;
            role.permissions = role.accessCount;
          });
          rolesCache = data.map(role => Object.assign({}, role));
          setRows(data);

          // Build application filter from data
          const apps = Array.from(
            data
              .map(role => role.applications)
              .flat()
              .reduce((acc, cur) => {
                acc.add(cur);
                return acc;
              }, new Set())
          ).sort();
          applicationsCache = apps;
          setApplications(apps);
        })
        .catch(err => dispatch(addNotification({
          variant: 'danger',
          title: 'Could not fetch roles list',
          description: err.message,
          dismissable: true
        })));
    }
  }, []);

  // Filtering
  const [activeSortIndex, setActiveSortIndex] = React.useState('name');
  const [activeSortDirection, setActiveSortDirection] = React.useState('asc');
  const onSort = (_ev, index, direction) => {
    setActiveSortIndex(index);
    setActiveSortDirection(direction);
    // sorts the rows
    const updatedRows = rows;
    setRows(updatedRows);
  };

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [filterColumn, setFilterColumn] = React.useState(columns[0]);
  const [isSelectOpen, setIsSelectOpen] = React.useState(false);
  const [appSelections, setAppSelections] = React.useState([]);
  const [nameFilter, setNameFilter] = React.useState('');
  const [nameFilters, setNameFilters] = React.useState([]);
  const selectLabelId = 'filter-application';
  const selectPlaceholder = 'Filter by application';

  const filteredRows = rows
    .filter(row => appSelections.length > 0 ? row.applications.find(app => appSelections.includes(app)) : true)
    .filter(row => nameFilters.length > 0 ? nameFilters.some(name => row.name.toLowerCase().includes(name)) : true);

  // Pagination
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const AccessRequestsPagination = ({ id }) => (
    <Pagination
      itemCount={filteredRows.length}
      perPage={perPage}
      page={page}
      onSetPage={(_ev, pageNumber) => setPage(pageNumber)}
      id={'access-requests-roles-table-pagination-' + id}
      variant={id}
      onPerPageSelect={(_ev, perPage) => { setPage(1); setPerPage(perPage); }}
      isCompact={id === 'top'}
    />
  );
  const pagedRows = filteredRows
    .sort((a, b) => {
      if (typeof a[activeSortIndex] === 'number') {
        // numeric sort
        if (activeSortDirection === 'asc') {
          return a[activeSortIndex] - b[activeSortIndex];
        }

        return b[activeSortIndex] - a[activeSortIndex];
      } else {
        // string sort
        if (activeSortDirection === 'asc') {
          return a[activeSortIndex].localeCompare(b[activeSortIndex]);
        }

        return b[activeSortIndex].localeCompare(a[activeSortIndex]);
      }
    })
    .slice((page - 1) * perPage, page * perPage);

  // Selecting
  const [isBulkSelectOpen, setIsBulkSelectOpen] = React.useState(false);
  const anySelected = selectedRoles.length > 0;
  const someChecked = anySelected ? null : false;
  const isChecked = selectedRoles.length === filteredRows.length ? true : someChecked;
  const onSelect = (_ev, isSelected, rowId) => {
    const changed = pagedRows[rowId].display_name;
    if (isSelected) {
      setSelectedRoles(selectedRoles.concat(changed));
    }
    else {
      setSelectedRoles(selectedRoles.filter(role => role !== changed));
    }
  };

  const onSelectAll = (_ev, isSelected) => {
    if (isSelected) {
      setSelectedRoles(filteredRows.map(row => row.display_name));
    }
    else {
      setSelectedRoles([]);
    }
  };

  const isReadOnly = setSelectedRoles === undefined
  const roleToolbar = isReadOnly ? null : (
    <Toolbar id="access-requests-roles-table-toolbar">
      <ToolbarContent>
        <ToolbarItem>
          <Dropdown
            onSelect={() => setIsBulkSelectOpen(!isBulkSelectOpen)}
            position="left"
            toggle={
              <DropdownToggle
                splitButtonItems={[
                  <DropdownToggleCheckbox
                    key="a"
                    id="example-checkbox-2"
                    aria-label={anySelected ? 'Deselect all' : 'Select all'}
                    isChecked={isChecked}
                    onClick={() => onSelectAll(null, !anySelected)}
                  />
                ]}
                onToggle={isOpen => setIsBulkSelectOpen(isOpen)}
              >
                {selectedRoles.length !== 0 && <React.Fragment>{selectedRoles.length} selected</React.Fragment>}
              </DropdownToggle>
            }
            isOpen={isBulkSelectOpen}
            dropdownItems={[
              <DropdownItem key="0" onClick={() => onSelectAll(null, false)}>
                Select none (0 items)
              </DropdownItem>,
              <DropdownItem key="1" onClick={() => setSelectedRoles(selectedRoles.concat(pagedRows.map(r => r.display_name)))}>
                Select page ({Math.min(pagedRows.length, perPage)} items)
              </DropdownItem>,
              <DropdownItem key="2" onClick={() => onSelectAll(null, true)}>
                Select all ({filteredRows.length} items)
              </DropdownItem>
            ]}
          />
        </ToolbarItem>
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
              dropdownItems={['Role name', 'Application'].map(colName =>
                // Filterable columns are RequestID, AccountID, and Status
                <DropdownItem key={colName} value={colName} component="button">
                  {capitalize(colName)}
                </DropdownItem>
              )}
            />
            {filterColumn === 'Application' ?
              <React.Fragment>
                <span id={selectLabelId} hidden>{selectPlaceholder}</span>
                <Select
                  aria-labelledby={selectLabelId}
                  variant="checkbox"
                  aria-label="Select applications"
                  onToggle={isOpen => setIsSelectOpen(isOpen)}
                  onSelect={(_ev, selection) => {
                    if (appSelections.includes(selection)) {
                      setAppSelections(appSelections.filter(s => s !== selection));
                    }
                    else {
                      setAppSelections([...appSelections, selection]);
                    }
                  }}
                  isOpen={isSelectOpen}
                  selections={Array.from(appSelections)}
                  isCheckboxSelectionBadgeHidden
                  placeholderText={selectPlaceholder}
                  style={{ maxHeight: '400px', overflowY: 'auto' }}
                >
                  {applications.map(app =>
                    <SelectOption key={app} value={app}>{capitalize(app)}</SelectOption>
                  )}
                </Select>
              </React.Fragment>
              : <form
                style={{ display: 'flex' }}
                onSubmit={ev => {
                  ev.preventDefault();
                  setNameFilters(nameFilters.concat(nameFilter));
                  setNameFilter('');
                }}
              >
                <TextInput
                  name="rolesSearch"
                  id="rolesSearch"
                  type="search"
                  aria-label="Search input"
                  value={nameFilter}
                  onChange={val => setNameFilter(val)}
                />
                <Button variant="control" type="submit" aria-label="Search button for roles input">
                  <SearchIcon />
                </Button>
              </form>
            }
          </InputGroup>
        </ToolbarItem>
        <ToolbarItem variant="pagination" align={{ default: 'alignRight' }}>
          <AccessRequestsPagination id="top" />
        </ToolbarItem>
      </ToolbarContent>
      {(appSelections.length > 0 || nameFilters.length > 0) &&
        <ToolbarContent>
          {nameFilters.length > 0 &&
            <ChipGroup categoryName="Role name">
              {nameFilters.map(name =>
                <Chip key={name} onClick={() => setNameFilters(nameFilters.filter(s => s !== name))}>
                  {name}
                </Chip>
              )}
            </ChipGroup>
          }
          {appSelections.length > 0 &&
            <ChipGroup categoryName="Status">
              {appSelections.map(status =>
                <Chip key={status} onClick={() => setAppSelections(appSelections.filter(s => s !== status))}>
                  {status}
                </Chip>
              )}
            </ChipGroup>
          }
          {(appSelections.length > 0 || nameFilters.length > 0) &&
            <Button
              variant="link"
              onClick={() => { setAppSelections([]); setNameFilters([]); }}
            >
              Clear filters
            </Button>
          }
        </ToolbarContent>
      }
    </Toolbar>
  );

  const expandedColumns = ['Application', 'Resource type', 'Operation'];
  const dispatch = useDispatch();
  const onExpand = row => {
    row.isExpanded = !row.isExpanded;
    setRows([...rows]);
    if (!row.access) {
      fetch(`${API_BASE}/roles/${row.uuid}/`)
        .then(res => res.json())
        .then(res => {
          row.access = res.access.map(a => a.permission.split(':'));
          setRows([...rows]);
        })
        .catch(err => dispatch(addNotification({
          variant: 'danger',
          title: `Could not fetch permission list for ${row.name}.`,
          description: err.message,
          dismissable: true
        })));
    }
  };
  const roleTable = (
    <TableComposable aria-label="My user access roles" variant="compact">
      <Thead>
        <Tr>
          <Th />
          <Th
            width={30}
            sort={{ sortBy: { index: activeSortIndex, direction: activeSortDirection }, onSort, columnIndex: 'name' }}
          >
            {columns[0]}
          </Th>
          <Th
            width={50}
            sort={{ sortBy: { index: activeSortIndex, direction: activeSortDirection }, onSort, columnIndex: 'description' }}
          >
            {columns[1]}
          </Th>
          <Th
            width={10}
            sort={{ sortBy: { index: activeSortIndex, direction: activeSortDirection }, onSort, columnIndex: 'permissions' }}
            modifier="nowrap"
          >
            {columns[2]}
          </Th>
        </Tr>
      </Thead>
      {pagedRows.map((row, rowIndex) => (
        <Tbody key={rowIndex}>
          <Tr>
            <Td
              {...isReadOnly ? {} : {select:{
                rowIndex,
                onSelect,
                isSelected: selectedRoles.find(r => r === row.display_name)
              }}}
            />
            <Td dataLabel={columns[0]}>
              {row.display_name}
            </Td>
            <Td dataLabel={columns[1]}>
              <TableText wrapModifier="truncate">
                {row.description}
              </TableText>
            </Td>
            <Td dataLabel={columns[2]} className={css("pf-c-table__compound-expansion-toggle", row.isExpanded && "pf-m-expanded")}>
              <button type="button" className="pf-c-table__button" onClick={() => onExpand(row)}>
                {row.permissions}
              </button>
            </Td>
          </Tr>
          <Tr isExpanded={row.isExpanded} borders={false}>
            <Td />
            <Td colSpan={3}>
              <TableComposable isCompact className="pf-m-no-border-rows">
                <Thead>
                  <Tr>
                    {expandedColumns.map(col =>
                      <Th key={col}>{col}</Th>
                    )}
                  </Tr>
                </Thead>
                <Tbody>
                  {Array.isArray(row.access)
                    ? row.access.map(permissions =>
                        <Tr key={permissions.join(':')}>
                          <Td dataLabel={expandedColumns[0]}>
                            {permissions[0]}
                          </Td>
                          <Td dataLabel={expandedColumns[1]}>
                            {permissions[1]}
                          </Td>
                          <Td dataLabel={expandedColumns[2]}>
                            {permissions[2]}
                          </Td>
                        </Tr>
                    )
                    : <Spinner size="lg" />
                  }
                </Tbody>
              </TableComposable>
            </Td>
          </Tr>
        </Tbody>
      ))}
    </TableComposable>
  );

  return (
    <React.Fragment>
      {!isReadOnly && 
        <React.Fragment>
          <Title headingLevel="h2">Select roles</Title>
          <p>Select the roles you would like access to.</p>
        </React.Fragment>
      }
      {rows.length > 0
        ? <React.Fragment>
            {roleToolbar}
            {roleTable}
            {isReadOnly && <AccessRequestsPagination id="bottom" />}
          </React.Fragment>
        : <Spinner size="lg" />
      }
    </React.Fragment>
  );
};

MUARolesTable.displayName = 'MUARolesTable';

export default MUARolesTable;

