import React from 'react';
import './Badge.css';

/**
 * Badge Component
 * Status indicators with consistent variants
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Badge content
 * @param {'success'|'warning'|'danger'|'info'|'secondary'|'primary'} [props.variant='secondary'] - Color variant
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Badge size
 * @param {React.ReactNode} [props.icon] - Leading icon
 * @param {boolean} [props.dot] - Show dot indicator instead of full badge
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 */
const Badge = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  dot = false,
  className = '',
  ...rest
}) => {
  const variantClasses = {
    success: 'ui-badge--success',
    warning: 'ui-badge--warning',
    danger: 'ui-badge--danger',
    info: 'ui-badge--info',
    secondary: 'ui-badge--secondary',
    primary: 'ui-badge--primary',
  };

  const sizeClasses = {
    sm: 'ui-badge--sm',
    md: 'ui-badge--md',
    lg: 'ui-badge--lg',
  };

  return (
    <span
      className={`ui-badge ${variantClasses[variant]} ${sizeClasses[size]} ${dot ? 'ui-badge--dot' : ''} ${className}`}
      {...rest}
    >
      {dot ? (
        <span className="ui-badge__dot" aria-hidden="true"></span>
      ) : (
        <>
          {icon && <span className="ui-badge__icon" aria-hidden="true">{icon}</span>}
          <span className="ui-badge__text">{children}</span>
        </>
      )}
    </span>
  );
};

Badge.displayName = 'Badge';

export default Badge;