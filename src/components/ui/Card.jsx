import React from 'react';
import './Card.css';

/**
 * Card Component
 * Consistent container with header, body, footer
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.header] - Header content
 * @param {React.ReactNode} [props.footer] - Footer content
 * @param {React.ReactNode} props.children - Main content
 * @param {'default'|'elevated'|'outlined'} [props.variant='default'] - Visual variant
 * @param {'none'|'sm'|'md'|'lg'} [props.padding='md'] - Internal padding
 * @param {boolean} [props.hoverable] - Hover elevation effect
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.as='div'] - HTML element type
 * @returns {JSX.Element}
 */
const Card = ({
  header,
  footer,
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className = '',
  as: Component = 'div',
  ...rest
}) => {
  const variantClasses = {
    default: 'ui-card--default',
    elevated: 'ui-card--elevated',
    outlined: 'ui-card--outlined',
  };

  const paddingClasses = {
    none: 'ui-card--no-padding',
    sm: 'ui-card--padding-sm',
    md: 'ui-card--padding-md',
    lg: 'ui-card--padding-lg',
  };

  return (
    <Component
      className={`ui-card ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverable ? 'ui-card--hoverable' : ''} ${className}`}
      {...rest}
    >
      {header && (
        <div className="ui-card__header">
          {header}
        </div>
      )}
      <div className="ui-card__body">
        {children}
      </div>
      {footer && (
        <div className="ui-card__footer">
          {footer}
        </div>
      )}
    </Component>
  );
};

Card.displayName = 'Card';

export default Card;