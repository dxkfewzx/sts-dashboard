import React from 'react';
import './IconButton.css';

/**
 * IconButton Component
 * For icon-only action buttons (36x36 desktop, 40x40 mobile)
 *
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon element (Bootstrap Icons, etc.)
 * @param {'primary'|'secondary'|'ghost'|'danger'} [props.variant='ghost'] - Visual style
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Size variant
 * @param {Function} [props.onClick] - Click handler
 * @param {string} props.ariaLabel - Required ARIA label for accessibility
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 */
const IconButton = React.forwardRef(({
  icon,
  variant = 'ghost',
  size = 'md',
  onClick,
  ariaLabel,
  disabled = false,
  className = '',
  ...rest
}, ref) => {
  if (!ariaLabel) {
    console.warn('IconButton: ariaLabel is required for accessibility');
  }

  const classNames = [
    'ui-icon-button',
    `ui-icon-button--${variant}`,
    `ui-icon-button--${size}`,
    disabled ? 'ui-icon-button--disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      type="button"
      className={classNames}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      aria-expanded={rest['aria-expanded']}
      {...rest}
    >
      <span className="ui-icon-button__icon" aria-hidden="true">
        {icon}
      </span>
    </button>
  );
});

IconButton.displayName = 'IconButton';

export default IconButton;