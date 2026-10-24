import React, { useMemo, useState, useCallback } from 'react';
import './Table.css';

/**
 * Table Component
 * Sortable, responsive, with loading skeleton
 *
 * @param {Object} props
 * @param {Array} props.columns - Column definitions: [{ key, label, sortable, render, className, width }]
 * @param {Array} props.data - Row data array
 * @param {string} props.rowKey - Unique key field for rows
 * @param {Function} [props.onSort] - Sort handler: (key, direction) => void
 * @param {Object} [props.sortState] - Current sort: { key, direction }
 * @param {string} [props.emptyState] - Empty state message
 * @param {Function} [props.rowClassName] - Function to get row class: (row) => string
 * @param {boolean} [props.loading] - Show loading skeleton
 * @param {number} [props.skeletonRows=5] - Number of skeleton rows
 * @param {boolean} [props.striped] - Striped rows
 * @param {boolean} [props.hoverable] - Hover effect
 * @param {boolean} [props.responsive] - Horizontal scroll on mobile
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 */
const Table = ({
  columns = [],
  data = [],
  rowKey = 'id',
  onSort,
  sortState,
  emptyState = 'ไม่พบข้อมูล',
  rowClassName,
  loading = false,
  skeletonRows = 5,
  striped = true,
  hoverable = true,
  responsive = true,
  className = '',
  ...rest
}) => {
  const [sortKey, setSortKey] = useState(sortState?.key || null);
  const [sortDirection, setSortDirection] = useState(sortState?.direction || 'asc');

  const handleSort = useCallback((key) => {
    if (!onSort) return;

    let direction = 'asc';
    if (sortKey === key && sortDirection === 'asc') {
      direction = 'desc';
    }
    setSortKey(key);
    setSortDirection(direction);
    onSort(key, direction);
  }, [onSort, sortKey, sortDirection]);

  const sortedData = useMemo(() => {
    if (!sortKey || !onSort) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      const comparison = aVal > bVal ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortKey, sortDirection, onSort]);

  const getSortIcon = (key) => {
    if (sortKey !== key) return <i className="bi bi-arrow-down-up text-muted" aria-hidden="true"></i>;
    return sortDirection === 'asc'
      ? <i className="bi bi-arrow-up text-primary" aria-hidden="true"></i>
      : <i className="bi bi-arrow-down text-primary" aria-hidden="true"></i>;
  };

  if (loading) {
    return (
      <div className={`ui-table-wrapper ${responsive ? 'ui-table-wrapper--responsive' : ''} ${className}`} {...rest}>
        <div className="ui-table__skeleton">
          {Array.from({ length: skeletonRows }, (_, i) => (
            <div key={i} className="ui-table__skeleton-row">
              {columns.map((col, j) => (
                <div key={j} className="ui-table__skeleton-cell" style={{ width: col.width }}></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`ui-table-wrapper ${responsive ? 'ui-table-wrapper--responsive' : ''} ${className}`} {...rest}>
      <table className={`ui-table ${striped ? 'ui-table--striped' : ''} ${hoverable ? 'ui-table--hoverable' : ''}`}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`ui-table__th ${column.className || ''} ${column.sortable ? 'ui-table__th--sortable' : ''}`}
                style={{ width: column.width }}
                onClick={() => column.sortable && handleSort(column.key)}
                aria-sort={sortKey === column.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <div className="ui-table__th-content">
                  <span>{column.label}</span>
                  {column.sortable && getSortIcon(column.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="ui-table__empty">
                {emptyState}
              </td>
            </tr>
          ) : (
            sortedData.map((row) => (
              <tr key={row[rowKey]} className={rowClassName ? rowClassName(row) : ''}>
                {columns.map((column) => (
                  <td key={column.key} className={column.className || ''}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

Table.displayName = 'Table';

export default Table;