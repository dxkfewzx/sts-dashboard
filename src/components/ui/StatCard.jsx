import React from 'react';
import Badge from './Badge';
import './StatCard.css';

/**
 * StatCard Component
 * KPI metric card for dashboard grids
 *
 * @param {Object} props
 * @param {string|number} props.value - Main metric value
 * @param {string} props.label - Metric label
 * @param {React.ReactNode} [props.icon] - Leading icon
 * @param {'default'|'primary'|'success'|'warning'|'danger'|'info'} [props.variant='default'] - Color variant
 * @param {Object} [props.trend] - Trend: { value, label, positive }
 * @param {React.ReactNode} [props.action] - Action element
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 */
const StatCard = ({
  value,
  label,
  icon,
  variant = 'default',
  trend,
  action,
  className = '',
  ...rest
}) => {
  const variantClasses = {
    default: 'ui-stat-card--default',
    primary: 'ui-stat-card--primary',
    success: 'ui-stat-card--success',
    warning: 'ui-stat-card--warning',
    danger: 'ui-stat-card--danger',
    info: 'ui-stat-card--info',
  };

  return (
    <article className={`ui-stat-card ${variantClasses[variant]} ${className}`} {...rest}>
      <div className="ui-stat-card__content">
        <div className="ui-stat-card__header">
          <div className="ui-stat-card__label">{label}</div>
          {action && <div className="ui-stat-card__action">{action}</div>}
        </div>
        <div className="ui-stat-card__main">
          {icon && <div className="ui-stat-card__icon" aria-hidden="true">{icon}</div>}
          <div className="ui-stat-card__value">{value}</div>
        </div>
        {trend && (
          <div className="ui-stat-card__trend">
            <Badge
              variant={trend.positive ? 'success' : 'danger'}
              size="sm"
              dot
            >
              <span className="ui-stat-card__trend-value">
                {trend.value}
              </span>
              <span className="ui-stat-card__trend-label">
                {trend.label}
              </span>
            </Badge>
          </div>
        )}
      </div>
    </article>
  );
};

StatCard.displayName = 'StatCard';

export default StatCard;