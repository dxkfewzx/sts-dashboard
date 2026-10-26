/**
 * Toast Notifications for STS Dashboard
 * Re-exports from swal.js for backward compatibility
 * Uses the new design system theme via swal.js
 */

import {
  swalToast as toastSuccess,
  swalToastError as toastError,
  swalToastWarning as toastWarning,
  swalToastInfo as toastInfo,
  swalLoading as toastLoading,
  swalClose as toastClose,
  swalConfirm as toastConfirm,
  swalInput as toastInput,
} from './swal';

// Re-export with original names for backward compatibility
export const success = (title, text) => toastSuccess({ title, text });
export const error = (title, text) => toastError({ title, text });
export const warning = (title, text) => toastWarning({ title, text });
export const info = (title, text) => toastInfo({ title, text });
export const loading = (title, text) => toastLoading(title, text);
export const close = toastClose;

// Confirm dialog (backward compatibility)
export const confirm = (options = {}) => toastConfirm({
  title: options.title || 'ยืนยันการดำเนินการ?',
  text: options.text || '',
  icon: options.icon || 'question',
  confirmButtonText: options.confirmButtonText || 'ยืนยัน',
  cancelButtonText: options.cancelButtonText || 'ยกเลิก',
  reverseButtons: true,
});

// Input dialog (backward compatibility)
export const input = (options = {}) => toastInput({
  title: options.title || 'กรอกข้อมูล',
  text: options.text || '',
  inputPlaceholder: options.inputPlaceholder || '',
  confirmButtonText: options.confirmButtonText || 'ตกลง',
});

// Specific operation toasts (backward compatibility)
export const operationToast = {
  // Create operations
  created: (entityName = 'รายการ') => toastSuccess({ title: `เพิ่ม${entityName}สำเร็จ` }),
  createError: (entityName = 'รายการ', error = '') => toastError({ title: `เพิ่ม${entityName}ล้มเหลว`, text: error }),

  // Update operations
  updated: (entityName = 'รายการ') => toastSuccess({ title: `อัปเดต${entityName}สำเร็จ` }),
  updateError: (entityName = 'รายการ', error = '') => toastError({ title: `อัปเดต${entityName}ล้มเหลว`, text: error }),

  // Delete operations
  deleted: (entityName = 'รายการ') => toastSuccess({ title: `ลบ${entityName}สำเร็จ` }),
  deleteError: (entityName = 'รายการ', error = '') => toastError({ title: `ลบ${entityName}ล้มเหลว`, text: error }),

  // Withdraw/Return
  withdrawn: () => toastSuccess({ title: 'บันทึกการเบิกอุปกรณ์สำเร็จ' }),
  withdrawError: (error = '') => toastError({ title: 'บันทึกการเบิกอุปกรณ์ล้มเหลว', text: error }),
  returned: () => toastSuccess({ title: 'บันทึกการรับคืนอุปกรณ์สำเร็จ' }),
  returnError: (error = '') => toastError({ title: 'บันทึกการรับคืนอุปกรณ์ล้มเหลว', text: error }),

  // Generic
  saved: () => toastSuccess({ title: 'บันทึกข้อมูลสำเร็จ' }),
  saveError: (error = '') => toastError({ title: 'บันทึกข้อมูลล้มเหลว', text: error }),
  networkError: () => toastError({ title: 'เกิดข้อผิดพลาด', text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้' }),
  validationError: (message = 'กรุณากรอกข้อมูลให้ครบถ้วน') => toastWarning({ title: 'ข้อมูลไม่ครบ', text: message }),
};

// Export as default for backward compatibility
const toast = {
  success,
  error,
  warning,
  info,
  loading,
  close,
  confirm,
  input,
  operationToast,
};

export default toast;