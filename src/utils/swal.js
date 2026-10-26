/**
 * SweetAlert2 Helper for STS Dashboard
 * Pre-configured with design system theme and Thai language support
 * Usage: import { swalConfirm, swalAlert, swalSuccess, swalError, swalWarning, swalLoading } from '@/utils/swal'
 */

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Import our custom theme (CSS variables from design tokens)
// This ensures SweetAlert2 uses our design system colors, spacing, typography
import '../styles/sweetalert2-theme.css';

/**
 * Default configuration for all SweetAlert2 dialogs
 * Uses our design tokens via CSS variables
 */
const defaultOptions = {
  // Use our custom CSS classes (buttonsStyling: false = use our CSS)
  customClass: {
    popup: 'swal2-popup-custom',
    title: 'swal2-title-custom',
    htmlContainer: 'swal2-html-container-custom',
    confirmButton: 'swal2-confirm-custom btn btn-primary',
    cancelButton: 'swal2-cancel-custom btn btn-secondary',
    denyButton: 'swal2-deny-custom btn btn-danger',
    input: 'swal2-input-custom form-control',
    textarea: 'swal2-textarea-custom form-control',
    select: 'swal2-select-custom form-select',
    checkbox: 'swal2-checkbox-custom form-check-input',
    radio: 'swal2-radio-custom form-check-input',
    validationMessage: 'swal2-validation-message-custom text-danger small',
    actions: 'swal2-actions-custom',
    closeButton: 'swal2-close-custom btn-close',
    loader: 'swal2-loader-custom',
    icon: 'swal2-icon-custom',
    footer: 'swal2-footer-custom',
  },

  // Disable SweetAlert2's built-in button styling (we use our CSS)
  buttonsStyling: false,

  // Animation (works with animate.css if available, otherwise uses our CSS animations)
  showClass: {
    popup: 'animate__animated animate__fadeInDown animate__faster swal2-show',
    backdrop: 'animate__animated animate__fadeIn swal2-backdrop-show',
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutUp animate__faster swal2-hide',
    backdrop: 'animate__animated animate__fadeOut swal2-backdrop-hide',
  },

  // Default Thai text
  confirmButtonText: 'ยืนยัน',
  cancelButtonText: 'ยกเลิก',
  denyButtonText: 'ไม่ยืนยัน',

  // Reverse buttons (cancel on left, confirm on right - more natural for Thai users)
  reverseButtons: true,

  // Focus management
  focusConfirm: true,
  focusCancel: false,
  focusDeny: false,

  // Keyboard
  allowEnterKey: true,
  allowEscapeKey: true,
  allowOutsideClick: true,

  // Timer progress bar (for auto-close alerts)
  timerProgressBar: true,

  // Default width (responsive via CSS)
  width: 'auto',

  // Padding (handled by CSS)
  padding: '0',

  // Background (handled by CSS)
  background: 'transparent',

  // RTL support for future
  // target: document.body, // Can be overridden per call
};

/**
 * Merge default options with user options
 * @param {Object} options - User options
 * @returns {Object} Merged options
 */
const mergeOptions = (options = {}) => ({
  ...defaultOptions,
  ...options,
  customClass: {
    ...defaultOptions.customClass,
    ...(options.customClass || {}),
  },
});

/**
 * Confirmation Dialog
 * For actions that need user confirmation (delete, withdraw, etc.)
 * @param {Object} options - SweetAlert2 options
 * @returns {Promise<SweetAlertResult>}
 */
export const swalConfirm = (options = {}) => Swal.fire(
  mergeOptions({
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: options.confirmButtonText || 'ยืนยัน',
    cancelButtonText: options.cancelButtonText || 'ยกเลิก',
    reverseButtons: true,
    ...options,
  })
);

/**
 * Alert/Info Dialog
 * For simple information messages
 * @param {Object} options - SweetAlert2 options
 * @returns {Promise<SweetAlertResult>}
 */
export const swalAlert = (options = {}) => Swal.fire(
  mergeOptions({
    icon: 'info',
    confirmButtonText: options.confirmButtonText || 'ตกลง',
    showCancelButton: false,
    ...options,
  })
);

/**
 * Success Dialog
 * For successful operations
 * @param {Object} options - SweetAlert2 options
 * @returns {Promise<SweetAlertResult>}
 */
export const swalSuccess = (options = {}) => Swal.fire(
  mergeOptions({
    icon: 'success',
    confirmButtonText: options.confirmButtonText || 'ตกลง',
    timer: options.timer || 3000,
    timerProgressBar: true,
    showCancelButton: false,
    ...options,
  })
);

/**
 * Error Dialog
 * For error messages
 * @param {Object} options - SweetAlert2 options
 * @returns {Promise<SweetAlertResult>}
 */
export const swalError = (options = {}) => Swal.fire(
  mergeOptions({
    icon: 'error',
    confirmButtonText: options.confirmButtonText || 'ตกลง',
    showCancelButton: false,
    ...options,
  })
);

/**
 * Warning Dialog
 * For warnings with optional confirmation
 * @param {Object} options - SweetAlert2 options
 * @returns {Promise<SweetAlertResult>}
 */
export const swalWarning = (options = {}) => Swal.fire(
  mergeOptions({
    icon: 'warning',
    showCancelButton: options.showCancelButton !== false,
    confirmButtonText: options.confirmButtonText || 'ยืนยัน',
    cancelButtonText: options.cancelButtonText || 'ยกเลิก',
    reverseButtons: true,
    ...options,
  })
);

/**
 * Loading Dialog
 * For async operations
 * @param {string} title - Loading title
 * @param {string} text - Loading text
 * @returns {void} - Call swalClose() to close
 */
export const swalLoading = (title = 'กำลังดำเนินการ...', text = 'กรุณารอสักครู่') => {
  Swal.fire(
    mergeOptions({
      title,
      text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    })
  );
};

/**
 * Close any open SweetAlert2 dialog
 * @returns {void}
 */
export const swalClose = () => Swal.close();

/**
 * Toast Notification (top-right, auto-dismiss)
 * For non-blocking notifications
 * @param {Object} options - Toast options
 * @returns {Promise<SweetAlertResult>}
 */
export const swalToast = (options = {}) => Swal.fire(
  mergeOptions({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: options.timer || 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    customClass: {
      ...defaultOptions.customClass,
      popup: 'swal2-toast-custom',
    },
    ...options,
  })
);

/**
 * Toast Success
 * @param {string} title - Success message
 * @param {Object} options - Additional options
 */
export const swalToastSuccess = (title, options = {}) => swalToast({
  icon: 'success',
  title,
  ...options,
});

/**
 * Toast Error
 * @param {string} title - Error message
 * @param {Object} options - Additional options
 */
export const swalToastError = (title, options = {}) => swalToast({
  icon: 'error',
  title,
  ...options,
});

/**
 * Toast Warning
 * @param {string} title - Warning message
 * @param {Object} options - Additional options
 */
export const swalToastWarning = (title, options = {}) => swalToast({
  icon: 'warning',
  title,
  ...options,
});

/**
 * Toast Info
 * @param {string} title - Info message
 * @param {Object} options - Additional options
 */
export const swalToastInfo = (title, options = {}) => swalToast({
  icon: 'info',
  title,
  ...options,
});

/**
 * Input Dialog
 * For getting user input
 * @param {Object} options - SweetAlert2 options
 * @returns {Promise<SweetAlertResult>}
 */
export const swalInput = (options = {}) => Swal.fire(
  mergeOptions({
    input: 'text',
    inputPlaceholder: options.inputPlaceholder || 'กรุณากรอกข้อมูล',
    inputValidator: options.inputValidator || ((value) => {
      if (!value || !value.trim()) {
        return 'กรุณากรอกข้อมูลให้ครบถ้วน';
      }
      return null;
    }),
    showCancelButton: true,
    confirmButtonText: options.confirmButtonText || 'ยืนยัน',
    cancelButtonText: options.cancelButtonText || 'ยกเลิก',
    reverseButtons: true,
    ...options,
  })
);

/**
 * Textarea Dialog
 * For multi-line input
 * @param {Object} options - SweetAlert2 options
 * @returns {Promise<SweetAlertResult>}
 */
export const swalTextarea = (options = {}) => Swal.fire(
  mergeOptions({
    input: 'textarea',
    inputPlaceholder: options.inputPlaceholder || 'กรุณากรอกรายละเอียด',
    inputAttributes: {
      rows: 4,
      ...(options.inputAttributes || {}),
    },
    showCancelButton: true,
    confirmButtonText: options.confirmButtonText || 'ยืนยัน',
    cancelButtonText: options.cancelButtonText || 'ยกเลิก',
    reverseButtons: true,
    ...options,
  })
);

/**
 * Select Dialog
 * For dropdown selection
 * @param {Object} options - Options with inputOptions (required)
 * @returns {Promise<SweetAlertResult>}
 */
export const swalSelect = (options = {}) => {
  if (!options.inputOptions) {
    console.warn('swalSelect requires inputOptions');
  }
  return Swal.fire(
    mergeOptions({
      input: 'select',
      inputOptions: options.inputOptions || {},
      inputPlaceholder: options.inputPlaceholder || 'กรุณาเลือก',
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText || 'ยืนยัน',
      cancelButtonText: options.cancelButtonText || 'ยกเลิก',
      reverseButtons: true,
      ...options,
    })
  );
};

/**
 * Confirm Delete Dialog (Pre-configured for delete actions)
 * @param {Object} options - Additional options
 * @returns {Promise<SweetAlertResult>}
 */
export const swalConfirmDelete = (options = {}) => swalWarning({
  title: options.title || 'ลบรายการนี้?',
  text: options.text || 'การกระทำนี้ไม่สามารถย้อนกลับได้',
  icon: 'warning',
  confirmButtonText: options.confirmButtonText || 'ลบ',
  cancelButtonText: options.cancelButtonText || 'ยกเลิก',
  confirmButtonColor: undefined, // Uses CSS variable
  ...options,
});

/**
 * Confirm Withdraw Dialog (Pre-configured for equipment withdrawal)
 * @param {Object} options - Additional options
 * @returns {Promise<SweetAlertResult>}
 */
export const swalConfirmWithdraw = (options = {}) => swalConfirm({
  title: options.title || 'ยืนยันการเบิกอุปกรณ์?',
  text: options.text || 'กรุณาตรวจสอบข้อมูลให้ครบถ้วนก่อนยืนยัน',
  icon: 'question',
  confirmButtonText: options.confirmButtonText || 'เบิกอุปกรณ์',
  cancelButtonText: options.cancelButtonText || 'ยกเลิก',
  ...options,
});

/**
 * Form Validation Helper
 * Validates form data before submitting
 * @param {HTMLFormElement} form - Form element
 * @returns {boolean} - True if valid
 */
export const validateForm = (form) => {
  if (!form) return false;

  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.classList.add('is-invalid');
      isValid = false;
    } else {
      input.classList.remove('is-invalid');
    }
  });

  return isValid;
};

/**
 * Show validation errors from server response
 * @param {Object} errors - Error object { fieldName: 'message' }
 * @param {HTMLFormElement} form - Form element
 */
export const showValidationErrors = (errors, form) => {
  if (!form || !errors) return;

  Object.entries(errors).forEach(([field, message]) => {
    const input = form.querySelector(`[name="${field}"]`);
    if (input) {
      input.classList.add('is-invalid');

      // Remove existing feedback
      const existingFeedback = input.parentNode.querySelector('.invalid-feedback');
      if (existingFeedback) {
        existingFeedback.remove();
      }

      // Add new feedback
      const feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      feedback.textContent = message;
      input.parentNode.appendChild(feedback);
    }
  });

  // Focus first invalid field
  const firstInvalid = form.querySelector('.is-invalid');
  if (firstInvalid) {
    firstInvalid.focus();
  }
};

/**
 * Clear validation errors
 * @param {HTMLFormElement} form - Form element
 */
export const clearValidationErrors = (form) => {
  if (!form) return;

  form.querySelectorAll('.is-invalid').forEach((input) => {
    input.classList.remove('is-invalid');
  });

  form.querySelectorAll('.invalid-feedback').forEach((feedback) => {
    feedback.remove();
  });
};

/**
 * Fire & Forget - for non-critical notifications
 * @param {Object} options - SweetAlert2 options
 */
export const swalFireAndForget = (options = {}) => {
  Swal.fire(mergeOptions(options)).catch(() => {
    // Ignore errors for fire-and-forget
  });
};

// Named exports for convenience (Swal is also exported as default for advanced usage)
export { Swal };
export default Swal;