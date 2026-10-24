import React from 'react';
import { Button } from './Button';
import './PageHeader.css';

/**
 * PageHeader Component
 * Consistent page header with title, subtitle, actions, and optional back link
 *
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} [props.subtitle] - Page subtitle/description
 * @param {React.ReactNode} [props.actions] - Action buttons (recommended: Button components)
 * @param {Object} [props.backLink] - Back link: { href, label, onClick }
 * @param {React.ReactNode} [props.breadcrumb] - Breadcrumb component
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 */
const PageHeader = ({
  title,
  subtitle,
  actions,
  backLink,
  breadcrumb,
  className = '',
  ...rest
}) => {
  return (
    <header className={`ui-page-header ${className}`} {...rest}>
      {breadcrumb && (
        <nav className="ui-page-header__breadcrumb" aria-label="Breadcrumb">
          {breadcrumb}
        </nav>
      )}
      <div className="ui-page-header__content">
        {backLink && (
          <a
            href={backLink.href}
            onClick={backLink.onClick}
            className="ui-page-header__back"
            aria-label="ย้อนกลับ"
          >
            <i className="bi bi-arrow-left" aria-hidden="true"></i>
            <span>{backLink.label || 'ย้อนกลับ'}</span>
          </a>
        )}
        <div className="ui-page-header__titles">
          <h1 className="ui-page-header__title">{title}</h1>
          {subtitle && (
            <p className="ui-page-header__subtitle">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="ui-page-header__actions">
          {actions}
        </div>
      )}
    </header>
  );
};

PageHeader.displayName = 'PageHeader';

export default PageHeader;