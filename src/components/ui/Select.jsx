import React from 'react';
import './Select.css';

/**
 * Select Component
 * Wraps form-select + label + error + helper text
 *
 * @param {Object} props
 * @param {Array<{value: string, label: string}>} props.options - Options array
 * @param {string} [props.placeholder] - Placeholder option text
 * @param {string} [props.label] - Label text
 * @param {string} [props.error] - Error message
 * @param {string} [props.helperText] - Helper text
 * @param {boolean} [props.required=false] - Required indicator
 * @param {string} [props.value] - Controlled value
 * @param {Function} [props.onChange] - Change handler
 * @param {Function} [props.onBlur] - Blur handler
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {string} [props.id] - Select ID (auto-generated if not provided)
 * @param {string} [props.name] - Select name
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 */
const Select = React.forwardRef(({
  options = [],
  placeholder,
  label,
  error,
  helperText,
  required = false,
  value,
  onChange,
  onBlur,
  disabled = false,
  id,
  name,
  className = '',
  ...rest
}, ref) => {
  const selectId = id || `select-${React.useId()}`;
  const errorId = error ? `${selectId}-error` : undefined;
  const helperId = helperText ? `${selectId}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`ui-select-wrapper ${className}`}>
      {label && (
        <label htmlFor={selectId} className="ui-select__label">
          {label}
          {required && <span className="ui-select__required" aria-hidden="true">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        name={name}
        className={`ui-select ${error ? 'ui-select--error' : ''} ${disabled ? 'ui-select--disabled' : ''}`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        aria-required={required}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <div id={errorId} className="ui-select__error" role="alert" aria-live="polite">
          {error}
        </div>
      )}
      {helperText && !error && (
        <div id={helperId} className="ui-select__helper">
          {helperText}
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;