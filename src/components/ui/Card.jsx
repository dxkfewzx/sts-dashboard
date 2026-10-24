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

/**
 * Card.Header - Header section of the card
 */
const CardHeader = ({ children, className = '', ...rest }) => (
  <div className={`ui-card__header ${className}`} {...rest}>
    {children}
  </div>
);
CardHeader.displayName = 'Card.Header';

/**
 * Card.Body - Body/content section of the card
 */
const CardBody = ({ children, className = '', padding = 'md', ...rest }) => {
  const paddingClasses = {
    none: 'ui-card--no-padding',
    sm: 'ui-card--padding-sm',
    md: 'ui-card--padding-md',
    lg: 'ui-card--padding-lg',
  };
  return (
    <div className={`ui-card__body ${paddingClasses[padding] || ''} ${className}`} {...rest}>
      {children}
    </div>
  );
};
CardBody.displayName = 'Card.Body';

/**
 * Card.Footer - Footer section of the card
 */
const CardFooter = ({ children, className = '', ...rest }) => (
  <div className={`ui-card__footer ${className}`} {...rest}>
    {children}
  </div>
);
CardFooter.displayName = 'Card.Footer';

/**
 * Card.Title - Title element for card header
 */
const CardTitle = ({ children, className = '', level = 3, ...rest }) => {
  const Tag = `h${level}`;
  return <Tag className={`ui-card__title ${className}`} {...rest}>{children}</Tag>;
};
CardTitle.displayName = 'Card.Title';

// Attach sub-components to Card
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;

export default Card;