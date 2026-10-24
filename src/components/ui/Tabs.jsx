import React, { useRef, useEffect, useCallback } from 'react';
import './Tabs.css';

/**
 * Tabs Component
 * Keyboard navigable, mobile scrollable, line/enclosed variants
 *
 * @param {Object} props
 * @param {Array} props.tabs - Tab items: [{ id, label, icon, disabled, count }]
 * @param {string} props.activeTab - Active tab ID
 * @param {Function} props.onChange - Change handler: (id) => void
 * @param {'line'|'enclosed'} [props.variant='line'] - Visual variant
 * @param {boolean} [props.fullWidth] - Stretch tabs to fill width
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 */
const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  variant = 'line',
  fullWidth = false,
  className = '',
  ...rest
}) => {
  const tabListRef = useRef(null);
  const tabRefs = useRef({});

  // Scroll active tab into view on mobile
  useEffect(() => {
    if (tabRefs.current[activeTab]) {
      tabRefs.current[activeTab].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeTab]);

  const handleKeyDown = useCallback((e, tabId) => {
    const enabledTabs = tabs.filter(t => !t.disabled).map(t => t.id);
    const currentIndex = enabledTabs.indexOf(tabId);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % enabledTabs.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = enabledTabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    const nextTabId = enabledTabs[nextIndex];
    onChange?.(nextTabId);
    tabRefs.current[nextTabId]?.focus();
  }, [tabs, onChange]);

  return (
    <div className={`ui-tabs ui-tabs--${variant} ${fullWidth ? 'ui-tabs--full-width' : ''} ${className}`} {...rest}>
      <div
        className="ui-tabs__list"
        role="tablist"
        ref={tabListRef}
        aria-orientation="horizontal"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[tab.id] = el; }}
            role="tab"
            id={`tab-${tab.id}`}
            aria-controls={`panel-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-disabled={tab.disabled}
            tabIndex={activeTab === tab.id ? 0 : -1}
            className={`ui-tabs__tab ${activeTab === tab.id ? 'ui-tabs__tab--active' : ''} ${tab.disabled ? 'ui-tabs__tab--disabled' : ''}`}
            onClick={() => !tab.disabled && onChange?.(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
            disabled={tab.disabled}
          >
            {tab.icon && <span className="ui-tabs__icon" aria-hidden="true">{tab.icon}</span>}
            <span className="ui-tabs__label">{tab.label}</span>
            {tab.count !== undefined && tab.count !== null && (
              <span className="ui-tabs__count" aria-label={`${tab.count} รายการ`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

Tabs.displayName = 'Tabs';

export default Tabs;