import {
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  InputGroup,
  TextInput,
  ChipGroup,
  Chip,
  Select,
  SelectOption,
  DropdownToggleCheckbox,
} from '@patternfly/react-core';
import FilterIcon from '@patternfly/react-icons/dist/js/icons/filter-icon';
import { capitalize } from '@patternfly/react-core/dist/esm/helpers/util';
import PropTypes from 'prop-types';
import React, { useReducer } from 'react';

const selectLabelId = 'filter-application';
const selectPlaceholder = 'Filter by application';

const RoleToolbar = ({
  selectedRoles,
  setSelectedRoles,
  isChecked,
  appSelections,
  setAppSelections,
  columns,
  rows,
  filteredRows,
  pagedRows,
  anySelected,
  clearFiltersButton,
  perPage,
  nameFilter,
  setNameFilter,
  AccessRequestsPagination,
  applications,
}) => {
  const initialValue = {
    isDropdownOpen: false,
    isSelectOpen: false,
    isBulkSelectOpen: false,
    filterColumn: columns[0],
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'set':
        return {
          ...state,
          [action.payload.key]: action.payload.value,
        };
      case 'reset':
        return initialValue;
      default:
        throw new Error('Unknown action type: ${action.type}');
    }
  };
  const [state, dispatch] = useReducer(reducer, initialValue);
  const setActions = (name, value) => {
    dispatch({
      type: 'set',
      payload: { key: name, value: value },
    });
  };
  const hasFilters = appSelections.length > 0 || nameFilter;
  const onSelectAll = (_ev, isSelected) => {
    if (isSelected) {
      setSelectedRoles(filteredRows.map((row) => row.display_name));
    } else {
      setSelectedRoles([]);
    }
  };

  return (
    <React.Fragment>
      <Toolbar id="access-requests-roles-table-toolbar">
        <ToolbarContent>
          <ToolbarItem>
            <Dropdown
              onSelect={() =>
                setActions('isBulkSelectOpen', !state.isBulkSelectOpen)
              }
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
                    />,
                  ]}
                  onToggle={(isOpen) => setActions('isBulkSelectOpen', isOpen)}
                  isDisabled={rows.length === 0}
                >
                  {selectedRoles.length !== 0 && (
                    <React.Fragment>
                      {selectedRoles.length} selected
                    </React.Fragment>
                  )}
                </DropdownToggle>
              }
              isOpen={state.isBulkSelectOpen}
              dropdownItems={[
                <DropdownItem key="0" onClick={() => onSelectAll(null, false)}>
                  Select none (0 items)
                </DropdownItem>,
                <DropdownItem
                  key="1"
                  onClick={() =>
                    setSelectedRoles(
                      selectedRoles.concat(pagedRows.map((r) => r.display_name))
                    )
                  }
                >
                  Select page ({Math.min(pagedRows.length, perPage)} items)
                </DropdownItem>,
                <DropdownItem key="2" onClick={() => onSelectAll(null, true)}>
                  Select all ({filteredRows.length} items)
                </DropdownItem>,
              ]}
            />
          </ToolbarItem>
          <ToolbarItem>
            <InputGroup>
              <Dropdown
                isOpen={state.isDropdownOpen}
                onSelect={(ev) => {
                  setActions('isDropdownOpen', false);
                  setActions('isSelectOpen', false);
                  setActions('filterColumn', ev.target.value);
                }}
                toggle={
                  <DropdownToggle
                    onToggle={(isOpen) => setActions('isDropdownOpen', isOpen)}
                  >
                    <FilterIcon /> {state.filterColumn}
                  </DropdownToggle>
                }
                dropdownItems={['Role name', 'Application'].map((colName) => (
                  // Filterable columns are RequestID, AccountID, and Status
                  <DropdownItem
                    key={colName}
                    value={colName}
                    component="button"
                  >
                    {capitalize(colName)}
                  </DropdownItem>
                ))}
              />
              {state.filterColumn === 'Application' ? (
                <React.Fragment>
                  <span id={selectLabelId} hidden>
                    {selectPlaceholder}
                  </span>
                  <Select
                    aria-labelledby={selectLabelId}
                    variant="checkbox"
                    aria-label="Select applications"
                    onToggle={(isOpen) => setActions('isSelectOpen', isOpen)}
                    onSelect={(_ev, selection) => {
                      if (appSelections.includes(selection)) {
                        setAppSelections(
                          appSelections.filter((s) => s !== selection)
                        );
                      } else {
                        setAppSelections([...appSelections, selection]);
                      }
                    }}
                    isOpen={state.isSelectOpen}
                    selections={appSelections}
                    isCheckboxSelectionBadgeHidden
                    placeholderText={selectPlaceholder}
                    className="select-toolbar"
                  >
                    {applications.map((app) => (
                      <SelectOption key={app} value={app}>
                        {capitalize(app.replace(/-/g, ' '))}
                      </SelectOption>
                    ))}
                  </Select>
                </React.Fragment>
              ) : (
                <TextInput
                  name="rolesSearch"
                  id="rolesSearch"
                  type="search"
                  iconVariant="search"
                  aria-label="Search input"
                  placeholder="Filter by role name"
                  value={nameFilter}
                  onChange={(val) => setNameFilter(val)}
                />
              )}
            </InputGroup>
          </ToolbarItem>
          <ToolbarItem variant="pagination" align={{ default: 'alignRight' }}>
            <AccessRequestsPagination id="top" />
          </ToolbarItem>
        </ToolbarContent>
        {hasFilters && (
          <ToolbarContent>
            {nameFilter && (
              <ChipGroup categoryName="Role name">
                <Chip onClick={() => setNameFilter('')}>{nameFilter}</Chip>
              </ChipGroup>
            )}
            {appSelections.length > 0 && (
              <ChipGroup categoryName="Status">
                {appSelections.map((status) => (
                  <Chip
                    key={status}
                    onClick={() =>
                      setAppSelections(
                        appSelections.filter((s) => s !== status)
                      )
                    }
                  >
                    {status}
                  </Chip>
                ))}
              </ChipGroup>
            )}
            {clearFiltersButton}
          </ToolbarContent>
        )}
      </Toolbar>
    </React.Fragment>
  );
};

RoleToolbar.propTypes = {
  selectedRoles: PropTypes.array,
  setSelectedRoles: PropTypes.func,
  isChecked: PropTypes.bool,
  appSelections: PropTypes.any,
  setAppSelections: PropTypes.func,
  columns: PropTypes.array,
  rows: PropTypes.array,
  filteredRows: PropTypes.array,
  pagedRows: PropTypes.array,
  anySelected: PropTypes.bool,
  clearFiltersButton: PropTypes.object,
  perPage: PropTypes.number,
  nameFilter: PropTypes.string,
  setNameFilter: PropTypes.func,
  AccessRequestsPagination: PropTypes.func,
  applications: PropTypes.array,
};

export default RoleToolbar;
