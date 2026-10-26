import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import './Table.css';

/**
 * Table Component
 * Sortable, responsive, with loading skeleton and mobile card layout
 *
 * @param {Object} props
 * @param {Array} props.columns - Column definitions: [{ key, label, sortable, render, className, width, cardLabel?, hideInCard? }]
 * @param {Array} props.data - Row data array
 * @param {string} props.rowKey - Unique key field for rows
 * @param {Function} [props.onSort] - Sort handler: (key, direction) => void
 * @param {Object} [props.sortState] - Current sort: { key, direction }
 * @param {string} [props.emptyState] - Empty state message
 * @param {Function} [props.rowClassName] - Function to get row class: (row) => string
 * @param {Function} [props.getRowClass] - Function to get row class based on row data: (row) => string (alias for rowClassName)
 * @param {Function} [props.getRowStyle] - Function to get row style: (row) => object
 * @param {Function} [props.onRowMouseEnter] - Handler for row mouse enter: (row) => void
 * @param {Function} [props.onRowMouseLeave] - Handler for row mouse leave: () => void
 * @param {Function} [props.renderLoadingRow] - Custom skeleton row renderer
 * @param {boolean} [props.loading] - Show loading skeleton
 * @param {number} [props.skeletonRows=5] - Number of skeleton rows
 * @param {boolean} [props.striped] - Striped rows
 * @param {boolean} [props.hoverable] - Hover effect
 * @param {boolean} [props.responsive] - Horizontal scroll on mobile
 * @param {boolean} [props.cardLayout] - Use card layout on mobile (< 768px)
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
  getRowClass,
  getRowStyle,
  onRowMouseEnter,
  onRowMouseLeave,
  renderLoadingRow,
  loading = false,
  skeletonRows = 5,
  striped = true,
  hoverable = true,
  responsive = true,
  cardLayout = false,
  minWidth,
  className = '',
  ...rest
}) => {
  const [sortKey, setSortKey] = useState(sortState?.key || null);
  const [sortDirection, setSortDirection] = useState(sortState?.direction || 'asc');
  const [isMobile, setIsMobile] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const wrapperRef = useRef(null);

  // Detect mobile for card layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Changed from 640 to 768 for better tablet UX
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Detect if table content overflows (show scroll hint)
  useEffect(() => {
    const checkOverflow = () => {
      if (wrapperRef.current && wrapperRef.current.scrollWidth > wrapperRef.current.clientWidth) {
        setShowScrollHint(true);
      } else {
        setShowScrollHint(false);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [data, columns]);

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

  // Handle row mouse events for hover highlighting
  const handleRowMouseEnter = useCallback((row) => {
    if (onRowMouseEnter) {
      onRowMouseEnter(row);
    }
  }, [onRowMouseEnter]);

  const handleRowMouseLeave = useCallback(() => {
    if (onRowMouseLeave) {
      onRowMouseLeave();
    }
  }, [onRowMouseLeave]);

  // Render card layout for mobile
  const renderCardLayout = () => {
    if (!cardLayout || !isMobile) return null;
    if (sortedData.length === 0) return null;

    return (
      <div className="ui-table__cards" role="list" aria-label={`${emptyState} - รายการข้อมูล`}>
        {sortedData.map((row, index) => {
          const rowUniqueKey = row[rowKey];
          return (
            <article key={`card-${rowUniqueKey}`} className="ui-table__card" role="listitem">
              {columns.map((column) => {
                const value = column.render ? column.render(row, index) : row[column.key];
                // Skip action columns in card layout (they'll be rendered separately)
                if (column.key === 'actions' || column.hideInCard) return null;
                return (
                  <div key={`${column.key}-${rowUniqueKey}`} className="ui-table__card-row">
                    <span className="ui-table__card-label">
                      {column.cardLabel || column.label}
                    </span>
                    <span className="ui-table__card-value">
                      {value}
                    </span>
                  </div>
                );
              })}
              {/* Actions at bottom of card */}
              {columns.some(col => col.key === 'actions') && (
                <div key={`actions-${rowUniqueKey}`} className="ui-table__card-actions">
                  {columns
                    .filter(col => col.key === 'actions')
                    .flatMap(col => col.render ? col.render(row, index) : [])}
                </div>
              )}
            </article>
          );
        })}
      </div>
    );
  };

  if (loading) {
    if (renderLoadingRow) {
      return (
        <div className={`ui-table-wrapper ${responsive ? 'ui-table-wrapper--responsive' : ''} ${className}`} {...rest} style={{ minWidth }}>
          <table className={`ui-table ${striped ? 'ui-table--striped' : ''} ${hoverable ? 'ui-table--hoverable' : ''}`}>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`ui-table__th ${column.className || ''} ${column.sortable ? 'ui-table__th--sortable' : ''}`}
                    style={{ width: column.width }}
                  >
                    <div className="ui-table__th-content">
                      <span>{column.header || column.label}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: skeletonRows }, (_, i) => (
                <React.Fragment key={`skeleton-${i}`}>
                  {renderLoadingRow()}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className={`ui-table-wrapper ${responsive ? 'ui-table-wrapper--responsive' : ''} ${className}`} {...rest} style={{ minWidth }}>
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

  const wrapperClassName = [
    'ui-table-wrapper',
    responsive && 'ui-table-wrapper--responsive',
    cardLayout && isMobile && 'ui-table-wrapper--card-layout',
    className
  ].filter(Boolean).join(' ');

  // Use getRowClass if provided, otherwise fall back to rowClassName
  const resolveRowClass = getRowClass || rowClassName;

  return (
    <div
      ref={wrapperRef}
      className={wrapperClassName}
      {...rest}
      data-card-layout={cardLayout && isMobile}
      style={{ minWidth }}
    >
      {/* Scroll hint indicator for horizontal scrolling */}
      {responsive && !isMobile && showScrollHint && (
        <div className="ui-table__scroll-hint" aria-hidden="true">
          <i className="bi bi-arrow-right-short" />
          <span>เลื่อนเพื่อดูเพิ่มเติม</span>
        </div>
      )}
      {/* Traditional table (hidden on mobile when cardLayout is enabled) */}
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
                  <span>{column.header || column.label}</span>
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
            sortedData.map((row, index) => {
              const rowClass = resolveRowClass ? resolveRowClass(row) : '';
              const rowStyle = getRowStyle ? getRowStyle(row) : {};
              const rowUniqueKey = row[rowKey];

              return (
                <tr
                  key={rowUniqueKey}
                  className={rowClass}
                  style={rowStyle}
                  onMouseEnter={() => handleRowMouseEnter(row)}
                  onMouseLeave={handleRowMouseLeave}
                >
                  {columns.map((column) => (
                    <td key={`${column.key}-${rowUniqueKey}`} className={column.className || ''}>
                      {column.render ? column.render(row, index) : row[column.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Card layout for mobile */}
      {renderCardLayout()}
    </div>
  );
};

Table.displayName = 'Table';

export default Table;
