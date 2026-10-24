import React from 'react';
import './Button.css';

/**
 * Button Component
 * Replaces all .btn-* Bootstrap classes
 *
 * @param {Object} props
 * @param {'primary'|'secondary'|'success'|'danger'|'warning'|'info'|'outline'|'ghost'} [props.variant='primary'] - Visual style variant
 * @param {'sm'|'md'|'lg'|'icon'} [props.size='md'] - Size variant
 * @param {boolean} [props.loading=false] - Loading state
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {React.ReactNode} [props.leftIcon] - Icon to show before text
 * @param {React.ReactNode} [props.rightIcon] - Icon to show after text
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} [props.onClick] - Click handler
 * @param {'button'|'submit'|'reset'} [props.type='button'] - Button type
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.ariaLabel] - ARIA label for accessibility
 * @returns {JSX.Element}
 */
const Button = React.forwardRef(({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  onClick,
  type = 'button',
  className = '',
  ariaLabel,
  ...rest
}, ref) => {
  const classNames = [
    'ui-button',
    `ui-button--${variant}`,
    `ui-button--${size}`,
    loading ? 'ui-button--loading' : '',
    disabled ? 'ui-button--disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={classNames}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading && (
        <span className="ui-button__spinner" aria-hidden="true">
          <span className="ui-button__spinner-inner"></span>
        </span>
      )}
      {!loading && leftIcon && (
        <span className="ui-button__icon ui-button__icon--left" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      <span className="ui-button__text">{children}</span>
      {!loading && rightIcon && (
        <span className="ui-button__icon ui-button__icon--right" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;