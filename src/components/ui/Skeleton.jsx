import React from 'react';
import './Skeleton.css';

/**
 * Skeleton Component
 * Loading placeholders for various content types
 *
 * @param {Object} props
 * @param {'text'|'card'|'table'|'stat'|'avatar'|'button'} [props.variant='text'] - Skeleton variant
 * @param {number} [props.rows=3] - Number of text lines (for text variant)
 * @param {boolean} [props.animate=true] - Enable shimmer animation
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 */
const Skeleton = ({
  variant = 'text',
  rows = 3,
  animate = true,
  className = '',
  borderRadius,
  width,
  height,
  ...rest
}) => {
  const variantClasses = {
    text: 'ui-skeleton--text',
    card: 'ui-skeleton--card',
    table: 'ui-skeleton--table',
    stat: 'ui-skeleton--stat',
    avatar: 'ui-skeleton--avatar',
    button: 'ui-skeleton--button',
  };

  const TextLines = () => (
    <div className="ui-skeleton__text-lines" style={{ width, height }}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="ui-skeleton__line" style={{ width: i === rows - 1 ? '60%' : '100%' }}></div>
      ))}
    </div>
  );

  const CardContent = () => (
    <div className="ui-skeleton__card">
      <div className="ui-skeleton__card-header"></div>
      <div className="ui-skeleton__card-body">
        <div className="ui-skeleton__line" style={{ width: '40%' }}></div>
        <div className="ui-skeleton__line" style={{ width: '80%' }}></div>
        <div className="ui-skeleton__line" style={{ width: '60%' }}></div>
      </div>
    </div>
  );

  const TableContent = () => (
    <div className="ui-skeleton__table">
      <div className="ui-skeleton__table-header">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="ui-skeleton__table-cell"></div>
        ))}
      </div>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="ui-skeleton__table-row">
          {Array.from({ length: 5 }, (_, j) => (
            <div key={j} className="ui-skeleton__table-cell"></div>
          ))}
        </div>
      ))}
    </div>
  );

  const StatContent = () => (
    <div className="ui-skeleton__stat">
      <div className="ui-skeleton__stat-label"></div>
      <div className="ui-skeleton__stat-value"></div>
    </div>
  );

  const AvatarContent = () => (
    <div className="ui-skeleton__avatar"></div>
  );

  const ButtonContent = () => (
    <div className="ui-skeleton__button" style={{ borderRadius, width, height }}></div>
  );

  const renderVariant = () => {
    switch (variant) {
      case 'text': return <TextLines />;
      case 'card': return <CardContent />;
      case 'table': return <TableContent />;
      case 'stat': return <StatContent />;
      case 'avatar': return <AvatarContent />;
      case 'button': return <ButtonContent />;
      default: return <TextLines />;
    }
  };

  return (
    <div
      className={`ui-skeleton ${variantClasses[variant]} ${animate ? 'ui-skeleton--animate' : ''} ${className}`}
      {...rest}
    >
      {renderVariant()}
    </div>
  );
};

Skeleton.displayName = 'Skeleton';

export default Skeleton;