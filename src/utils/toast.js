import Swal from 'sweetalert2';

// Toast configuration
const toastConfig = {
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
};

/**
 * Show success toast
 * @param {string} title - Toast title
 * @param {string} text - Optional description text
 */
export function success(title, text = '') {
  return Swal.fire({
    ...toastConfig,
    icon: 'success',
    title,
    text,
    iconColor: '#28a745',
    background: '#fff',
    color: '#212529',
    customClass: {
      popup: 'swal2-toast-success',
    },
  });
}

/**
 * Show error toast
 * @param {string} title - Toast title
 * @param {string} text - Optional description text
 */
export function error(title, text = '') {
  return Swal.fire({
    ...toastConfig,
    icon: 'error',
    title,
    text,
    iconColor: '#dc3545',
    background: '#fff',
    color: '#212529',
    customClass: {
      popup: 'swal2-toast-error',
    },
  });
}

/**
 * Show warning toast
 * @param {string} title - Toast title
 * @param {string} text - Optional description text
 */
export function warning(title, text = '') {
  return Swal.fire({
    ...toastConfig,
    icon: 'warning',
    title,
    text,
    iconColor: '#ffc107',
    background: '#fff',
    color: '#212529',
    customClass: {
      popup: 'swal2-toast-warning',
    },
  });
}

/**
 * Show info toast
 * @param {string} title - Toast title
 * @param {string} text - Optional description text
 */
export function info(title, text = '') {
  return Swal.fire({
    ...toastConfig,
    icon: 'info',
    title,
    text,
    iconColor: '#17a2b8',
    background: '#fff',
    color: '#212529',
    customClass: {
      popup: 'swal2-toast-info',
    },
  });
}

/**
 * Show loading toast (no timer, manual close)
 * @param {string} title - Toast title
 * @param {string} text - Optional description text
 */
export function loading(title, text = '') {
  return Swal.fire({
    ...toastConfig,
    icon: 'info',
    title,
    text,
    iconColor: '#4e73df',
    background: '#fff',
    color: '#212529',
    timer: null,
    timerProgressBar: false,
    didOpen: () => {
      Swal.showLoading();
    },
    customClass: {
      popup: 'swal2-toast-loading',
    },
  });
}

/**
 * Close any open toast
 */
export function close() {
  Swal.close();
}

/**
 * Show confirmation dialog (not a toast, but a modal)
 * @param {Object} options - Confirmation options
 * @param {string} options.title - Dialog title
 * @param {string} options.text - Dialog text
 * @param {string} options.confirmButtonText - Confirm button text
 * @param {string} options.cancelButtonText - Cancel button text
 * @param {string} options.icon - Icon type ('warning', 'question', 'info')
 * @returns {Promise<boolean>} - True if confirmed
 */
export function confirm({
  title = 'ยืนยันการดำเนินการ?',
  text = '',
  confirmButtonText = 'ยืนยัน',
  cancelButtonText = 'ยกเลิก',
  icon = 'question',
} = {}) {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: '#4e73df',
    cancelButtonColor: '#6c757d',
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
  }).then(result => result.isConfirmed);
}

/**
 * Show input dialog
 * @param {Object} options - Input dialog options
 * @param {string} options.title - Dialog title
 * @param {string} options.text - Dialog text
 * @param {string} options.inputPlaceholder - Input placeholder
 * @param {string} options.confirmButtonText - Confirm button text
 * @returns {Promise<string|null>} - Input value or null if cancelled
 */
export function input({
  title = 'กรอกข้อมูล',
  text = '',
  inputPlaceholder = '',
  confirmButtonText = 'ตกลง',
} = {}) {
  return Swal.fire({
    title,
    text,
    input: 'text',
    inputPlaceholder,
    showCancelButton: true,
    confirmButtonColor: '#4e73df',
    cancelButtonColor: '#6c757d',
    confirmButtonText,
    cancelButtonText: 'ยกเลิก',
    inputValidator: (value) => {
      if (!value) {
        return 'กรุณากรอกข้อมูล';
      }
      return null;
    },
  }).then(result => result.value || null);
}

/**
 * Pre-configured toast for common operations
 */
export const toast = {
  success,
  error,
  warning,
  info,
  loading,
  close,
  confirm,
  input,
};

// Specific operation toasts
export const operationToast = {
  // Create operations
  created: (entityName = 'รายการ') => success(`เพิ่ม${entityName}สำเร็จ`),
  createError: (entityName = 'รายการ', error = '') => error(`เพิ่ม${entityName}ล้มเหลว`, error),

  // Update operations
  updated: (entityName = 'รายการ') => success(`อัปเดต${entityName}สำเร็จ`),
  updateError: (entityName = 'รายการ', error = '') => error(`อัปเดต${entityName}ล้มเหลว`, error),

  // Delete operations
  deleted: (entityName = 'รายการ') => success(`ลบ${entityName}สำเร็จ`),
  deleteError: (entityName = 'รายการ', error = '') => error(`ลบ${entityName}ล้มเหลว`, error),

  // Withdraw/Return
  withdrawn: () => success('บันทึกการเบิกอุปกรณ์สำเร็จ'),
  withdrawError: (error = '') => error('บันทึกการเบิกอุปกรณ์ล้มเหลว', error),
  returned: () => success('บันทึกการรับคืนอุปกรณ์สำเร็จ'),
  returnError: (error = '') => error('บันทึกการรับคืนอุปกรณ์ล้มเหลว', error),

  // Generic
  saved: () => success('บันทึกข้อมูลสำเร็จ'),
  saveError: (error = '') => error('บันทึกข้อมูลล้มเหลว', error),
  networkError: () => error('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'),
  validationError: (message = 'กรุณากรอกข้อมูลให้ครบถ้วน') => warning('ข้อมูลไม่ครบ', message),
};

export default toast;