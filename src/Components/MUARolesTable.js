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
  Chip
} from '@patternfly/react-core';
import { TableComposable, Thead, Tbody, Tr, Th, Td, TableText } from '@patternfly/react-table';
import roleList from './roles.js';
import FilterIcon from '@patternfly/react-icons/dist/js/icons/filter-icon';
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
  // Selecting
  const onSelect = (_ev, isSelected, rowId) => {
    if (isSelected) {
      setRoles(roles.concat(roleList[rowId]));
    }
    else {
      const unselectedUUID = roleList[rowId].uuid;
      setRoles(roles.filter(role => role.uuid !== unselectedUUID));
    }
  };

  const onSelectAll = (_ev, isSelected) => {
    if (isSelected) {
      setRoles([...roleList]);
    }
    else {
      setRoles([]);
    }
  };

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
  const [filter, setFilter] = React.useState('');
  const selectLabelId = 'filter-application';
  const selectPlaceholder = 'Filter by application';

  const filteredRows = rows
  .filter(row => appSelections.length > 0 ? row.applications.find(app => appSelections.includes(app)) : true)
  .filter(row => row.name.toLowerCase().includes(filter.toLowerCase()));

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
  return (
    <React.Fragment>
      <Title headingLevel="h2">Select roles</Title>
      <p>Select the roles you would like access to.</p>
      <Toolbar id="access-requests-roles-table-toolbar">
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
                  >
                    {applications.map(app =>
                      <SelectOption key={app} value={app}>{capitalize(app)}</SelectOption>
                    )}
                  </Select>
                </React.Fragment>
                : <TextInput
                  name="rolesSearch"
                  id="rolesSearch"
                  type="search"
                  aria-label="Search input"
                  value={filter}
                  onChange={val => setFilter(val)}
                />
              }
            </InputGroup>
          </ToolbarItem>
          <ToolbarItem variant="pagination" align={{ default: 'alignRight' }}>
            <AccessRequestsPagination id="top" />
          </ToolbarItem>
        </ToolbarContent>
        <ToolbarContent>
          <ChipGroup categoryName="Status">
            {appSelections.map(status =>
              <Chip key={status} onClick={() => setAppSelections(appSelections.filter(s => s !== status))}>
                {status}
              </Chip>
            )}
          </ChipGroup>
          {appSelections.length > 0 && <Button variant="link" onClick={() => setAppSelections([])}>Clear filters</Button>}
        </ToolbarContent>
      </Toolbar>
      <TableComposable aria-label="My user access roles" variant="compact">
        <Thead>
          <Tr>
            <Th
              select={{
                onSelect: onSelectAll,
                isSelected: roles.length === rows.length
              }}
              modifier="nowrap"
            />
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
          {filteredRows
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
          .slice((page - 1) * perPage, page * perPage)
          .map((row, rowIndex) => (
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

