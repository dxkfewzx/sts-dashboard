import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Sidebar.css';

/**
 * Sidebar Component
 * Mobile drawer with backdrop, auto-close on navigation
 *
 * @param {Object} props
 * @param {Array} props.items - Navigation items: [{ id, label, icon, badge, onClick, active }]
 * @param {string} props.activeItem - Active item ID
 * @param {Function} props.onItemClick - Click handler: (id) => void
 * @param {Object} [props.user] - User info: { name, email, avatar, role }
 * @param {Function} [props.onLogout] - Logout handler
 * @param {boolean} [props.collapsed] - Collapsed state (desktop)
 * @param {Function} [props.onCollapseChange] - Collapse toggle handler
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 */
const Sidebar = ({
  items = [],
  activeItem,
  onItemClick,
  user,
  onLogout,
  collapsed = false,
  onCollapseChange,
  className = '',
  ...rest
}) => {
  const sidebarRef = useRef(null);
  const previousActiveElement = useRef(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  // Mobile: trap focus, prevent body scroll
  useEffect(() => {
    if (!isMobile) return;

    previousActiveElement.current = document.activeElement;
    document.body.style.overflow = 'hidden';

    const focusableElements = sidebarRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements?.[0];
    firstFocusable?.focus();

    return () => {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    };
  }, [isMobile]);

  // Handle escape key on mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onItemClick?.('__close__');
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobile, onItemClick]);

  const sidebarContent = (
    <aside
      ref={sidebarRef}
      className={`ui-sidebar ${collapsed ? 'ui-sidebar--collapsed' : ''} ${isMobile ? 'ui-sidebar--mobile' : ''} ${isMobile && !className.includes('ui-sidebar--open') ? '' : 'ui-sidebar--open'} ${className}`}
      role="navigation"
      aria-label="เมนูหลัก"
      {...rest}
    >
      {/* Desktop collapse toggle */}
      {!isMobile && onCollapseChange && (
        <button
          type="button"
          className="ui-sidebar__collapse-btn"
          onClick={() => onCollapseChange(!collapsed)}
          aria-label={collapsed ? 'ขยายเมนู' : 'ยุบเมนู'}
          aria-expanded={!collapsed}
        >
          <i className={collapsed ? 'bi bi-chevron-right' : 'bi bi-chevron-left'} aria-hidden="true"></i>
        </button>
      )}

      {/* Brand/Logo */}
      <div className="ui-sidebar__brand">
        {!collapsed && (
          <>
            <div className="ui-sidebar__logo" aria-hidden="true">
              <i className="bi bi-box-seam"></i>
            </div>
            <span className="ui-sidebar__title">STS Dashboard</span>
          </>
        )}
        {collapsed && (
          <div className="ui-sidebar__logo-compact" aria-hidden="true">
            <i className="bi bi-box-seam"></i>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="ui-sidebar__nav" aria-label="นำทางหลัก">
        <ul className="ui-sidebar__list" role="list">
          {items.map((item) => (
            <li key={item.id} className="ui-sidebar__item">
              <button
                type="button"
                className={`ui-sidebar__link ${item.active ? 'ui-sidebar__link--active' : ''}`}
                onClick={() => onItemClick?.(item.id)}
                aria-current={item.active ? 'page' : undefined}
                disabled={item.disabled}
              >
                <span className="ui-sidebar__icon" aria-hidden="true">
                  {item.icon || <i className="bi bi-circle" aria-hidden="true"></i>}
                </span>
                {!collapsed && (
                  <>
                    <span className="ui-sidebar__label">{item.label}</span>
                    {item.badge && (
                      <span className="ui-sidebar__badge" aria-label={`${item.badge} รายการ`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User section */}
      {user && !collapsed && (
        <div className="ui-sidebar__user">
          <div className="ui-sidebar__user-info">
            <div className="ui-sidebar__user-avatar" aria-hidden="true">
              {user.avatar ? (
                <img src={user.avatar} alt="" />
              ) : (
                <i className="bi bi-person-fill"></i>
              )}
            </div>
            <div className="ui-sidebar__user-details">
              <div className="ui-sidebar__user-name">{user.name}</div>
              <div className="ui-sidebar__user-role">{user.role || user.email}</div>
            </div>
          </div>
          {onLogout && (
            <button
              type="button"
              className="ui-sidebar__logout"
              onClick={onLogout}
              aria-label="ออกจากระบบ"
            >
              <i className="bi bi-box-arrow-right" aria-hidden="true"></i>
              <span>ออกจากระบบ</span>
            </button>
          )}
        </div>
      )}
    </aside>
  );

  // Mobile: render to portal with backdrop
  if (isMobile) {
    return createPortal(
      <div className="ui-sidebar-mobile">
        <div
          className="ui-sidebar-mobile__backdrop"
          onClick={() => onItemClick?.('__close__')}
          aria-hidden="true"
        />
        {sidebarContent}
      </div>,
      document.body
    );
  }

  return sidebarContent;
};

Sidebar.displayName = 'Sidebar';

export default Sidebar;