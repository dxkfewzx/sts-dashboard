// Initial form state สำหรับ Serial Number
export const INITIAL_SN_FORM = {
  serial_number: '',
  brand: '',
  status: 'Available',
  job_number: '',
  withdrawer_name: '',
  dept_used: '',
  building: '',
  floor: '',
  receive_date: '',
  withdraw_date: '',
};

// Initial form state สำหรับ Bulk Add
export const INITIAL_BULK_FORM = {
  serial_numbers: '',
  brand: '',
  status: 'Available',
  job_number: '',
  withdrawer_name: '',
  dept_used: '',
  building: '',
  floor: '',
  receive_date: '',
  withdraw_date: '',
};

// Initial form state สำหรับ Return
export const INITIAL_RETURN_FORM = {
  receiver_name: '',
  return_condition: 'good',
  return_note: '',
  job_number: '',
  dept_used: '',
  building: '',
  floor: '',
};

// Serial Number status options
export const SN_STATUS_OPTIONS = [
  { value: 'Available', label: 'พร้อมใช้งาน' },
  { value: 'Withdrawn', label: 'เบิกออกแล้ว' },
  { value: 'Repair', label: 'อยู่ระหว่างซ่อม' },
];

// Return condition options
export const RETURN_CONDITION_OPTIONS = [
  { value: 'good', label: 'ดี (ใช้งานได้ปกติ)' },
  { value: 'damaged', label: 'ชำรุด' },
  { value: 'need_repair', label: 'ต้องซ่อม' },
];

// Helper สร้าง SN form data สำหรับ submit
export function createSNFormData(formState, itemId) {
  return {
    item_id: itemId,
    serial_number: formState.serial_number,
    brand: formState.brand || '',
    status: formState.status || 'Available',
    job_number: formState.job_number || '',
    withdrawer_name: formState.withdrawer_name || '',
    dept_used: formState.dept_used || '',
    building: formState.building || '',
    floor: formState.floor || '',
    receive_date: formState.receive_date || null,
    withdraw_date: formState.withdraw_date || null,
  };
}

// Helper สร้าง bulk SN array
export function createBulkSNArray(bulkForm, itemId) {
  const snList = bulkForm.serial_numbers
    .split('\n')
    .map(sn => sn.trim())
    .filter(sn => sn.length > 0);

  return snList.map(sn => ({
    item_id: itemId,
    serial_number: sn,
    brand: bulkForm.brand || '',
    status: bulkForm.status || 'Available',
    job_number: bulkForm.job_number || '',
    withdrawer_name: bulkForm.withdrawer_name || '',
    dept_used: bulkForm.dept_used || '',
    building: bulkForm.building || '',
    floor: bulkForm.floor || '',
    receive_date: bulkForm.receive_date || null,
    withdraw_date: bulkForm.withdraw_date || null,
  }));
}

// Helper สร้าง return form data
export function createReturnFormData(returnForm, returnSN, performedBy = 'current_user') {
  return {
    receiver_name: returnForm.receiver_name,
    return_condition: returnForm.return_condition,
    return_note: returnForm.return_note,
    job_number: returnForm.job_number || '',
    dept_used: returnForm.dept_used || '',
    building: returnForm.building || '',
    floor: returnForm.floor || '',
    performed_by: performedBy,
  };
}