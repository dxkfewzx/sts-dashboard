import React from 'react';
import './Input.css';

/**
 * Input Component
 * Wraps form-control + label + error + helper text
 *
 * @param {Object} props
 * @param {string} [props.label] - Label text
 * @param {string} [props.error] - Error message
 * @param {string} [props.helperText] - Helper text below input
 * @param {boolean} [props.required=false] - Required indicator
 * @param {'text'|'email'|'password'|'number'|'tel'|'url'|'date'|'datetime-local'} [props.type='text'] - Input type
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string|number} [props.value] - Controlled value
 * @param {Function} [props.onChange] - Change handler
 * @param {Function} [props.onBlur] - Blur handler
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.readOnly=false] - Read-only state
 * @param {string} [props.id] - Input ID (auto-generated if not provided)
 * @param {string} [props.name] - Input name
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.autoComplete] - Autocomplete attribute
 * @returns {JSX.Element}
 */
const Input = React.forwardRef(({
  label,
  error,
  helperText,
  required = false,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  disabled = false,
  readOnly = false,
  id,
  name,
  className = '',
  autoComplete,
  leftIcon,
  ...rest
}, ref) => {
  const generatedId = React.useId();
  const inputId = id || `input-${generatedId}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`ui-input-wrapper ${className}`}>
      {label && (
        <label htmlFor={inputId} className="ui-input__label">
          {label}
          {required && <span className="ui-input__required" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="ui-input__inner">
        {leftIcon && (
          <span className="ui-input__icon" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          className={`ui-input ${error ? 'ui-input--error' : ''} ${disabled ? 'ui-input--disabled' : ''} ${readOnly ? 'ui-input--readonly' : ''} ${leftIcon ? 'ui-input--has-icon' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          aria-required={required}
          autoComplete={autoComplete}
          {...rest}
        />
      </div>
      {error && (
        <div id={errorId} className="ui-input__error" role="alert" aria-live="polite">
          {error}
        </div>
      )}
      {helperText && !error && (
        <div id={helperId} className="ui-input__helper">
          {helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;