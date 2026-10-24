import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

/**
 * Modal Component
 * Portal-based, focus trap, ESC close, backdrop click
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close handler
 * @param {string} [props.title] - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.size='md'] - Modal size
 * @param {React.ReactNode} [props.footer] - Footer content (buttons)
 * @param {boolean} [props.closeOnBackdrop=true] - Close on backdrop click
 * @param {boolean} [props.closeOnEscape=true] - Close on ESC key
 * @param {boolean} [props.showCloseButton=true] - Show close button
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element|null}
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
  ...rest
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement;

    // Focus first focusable element
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements?.[0];
    const lastFocusable = focusableElements?.[focusableElements.length - 1];

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    firstFocusable?.focus();

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleTab);
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    };
  }, [isOpen]);

  // ESC key handler
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={`ui-modal-overlay ${className}`}
      onClick={(e) => {
        if (e.target === e.currentTarget && closeOnBackdrop) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'ui-modal-title' : undefined}
      {...rest}
    >
      <div
        ref={modalRef}
        className={`ui-modal ui-modal--${size}`}
        role="document"
      >
        {(title || showCloseButton) && (
          <div className="ui-modal__header">
            {title && (
              <h2 id="ui-modal-title" className="ui-modal__title">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                className="ui-modal__close"
                onClick={onClose}
                aria-label="ปิดหน้าต่าง"
              >
                <i className="bi bi-x-lg" aria-hidden="true"></i>
              </button>
            )}
          </div>
        )}
        <div className="ui-modal__body">
          {children}
        </div>
        {footer && (
          <div className="ui-modal__footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Render to portal (document.body)
  return createPortal(modalContent, document.body);
};

Modal.displayName = 'Modal';

export default Modal;