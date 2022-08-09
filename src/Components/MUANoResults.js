import React from 'react';
import {
  Title,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
} from '@patternfly/react-core';
import { Tbody, Tr, Td } from '@patternfly/react-table';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';
import PropTypes from 'prop-types';

const MUANoResults = ({ columns, clearFiltersButton }) => {
  return (
    <Tbody>
      <Tr>
        <Td colSpan={columns.length}>
          <EmptyState variant="small">
            <EmptyStateIcon icon={SearchIcon} />
            <Title headingLevel="h2" size="lg">
              No matching requests found
            </Title>
            <EmptyStateBody>
              No results match the filter criteria. Remove all filters or clear
              all filters to show results.
            </EmptyStateBody>
            {clearFiltersButton}
          </EmptyState>
        </Td>
      </Tr>
    </Tbody>
  );
};

MUANoResults.propTypes = {
  columns: PropTypes.array,
  clearFiltersButton: PropTypes.object,
};

export default MUANoResults;
