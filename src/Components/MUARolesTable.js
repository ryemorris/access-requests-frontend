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
  DropdownToggleCheckbox
} from '@patternfly/react-core';
import { TableComposable, Thead, Tbody, Tr, Th, Td, TableText } from '@patternfly/react-table';
import roleList from './roles.js';
import FilterIcon from '@patternfly/react-icons/dist/js/icons/filter-icon';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';
import { capitalize } from '@patternfly/react-core/dist/esm/helpers/util';

roleList.forEach(role => role.permissions = role.applications.length);
const applications = Array.from(
  roleList
  .map(role => role.applications)
  .flat()
  .reduce((acc, cur) => {
    acc.add(cur);
    return acc;
  }, new Set())
).sort();

const MUARolesTable = ({ roles, setRoles }) => {
  const columns = ['Role name', 'Role description', 'Permissions'];
  const [rows, setRows] = React.useState(roleList);
  // TODO: fetch('/api/rbac/v1/roles/?limit=1000&order_by=display_name').then(res => res.json()).then(j => console.log(j))

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
      onPerPageSelect={(_ev, perPage) => setPerPage(perPage)}
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
  const anySelected = roles.length > 0;
  const someChecked = anySelected ? null : false;
  const isChecked = roles.length === filteredRows.length ? true : someChecked;
  const onSelect = (_ev, isSelected, rowId) => {
    if (isSelected) {
      setRoles(roles.concat(filteredRows[rowId]));
    }
    else {
      const unselectedUUID = filteredRows[rowId].uuid;
      setRoles(roles.filter(role => role.uuid !== unselectedUUID));
    }
  };

  const onSelectAll = (_ev, isSelected) => {
    if (isSelected) {
      setRoles([...filteredRows]);
    }
    else {
      setRoles([]);
    }
  };

  return (
    <React.Fragment>
      <Title headingLevel="h2">Select roles</Title>
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
                  {roles.length !== 0 && <React.Fragment>{roles.length} selected</React.Fragment>}
                </DropdownToggle>
              }
              isOpen={isBulkSelectOpen}
              dropdownItems={[
                <DropdownItem key="0" onClick={() => onSelectAll(null, false)}>
                  Select none (0 items)
                </DropdownItem>,
                <DropdownItem key="1" onClick={() => setRoles(roles.concat(pagedRows))}>
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
                  <Button variant="control" type="submit" aria-label="Search button for search input">
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
        <Tbody>
          {pagedRows.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              <Td
                select={{
                  rowIndex,
                  onSelect,
                  isSelected: roles.find(r => r.uuid === row.uuid)
                }}
              />
              <Td dataLabel={columns[0]}>
                {row.name}
              </Td>
              <Td dataLabel={columns[1]}>
                <TableText wrapModifier="truncate">
                  {row.description}
                </TableText>
              </Td>
              <Td dataLabel={columns[2]}>
                {row.permissions}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </TableComposable>
    </React.Fragment>
  );
};

MUARolesTable.displayName = 'MUARolesTable';

export default MUARolesTable;

