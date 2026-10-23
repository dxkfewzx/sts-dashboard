// Serial Number Status
export const SN_STATUS_CONFIG = {
  Available: { label: 'พร้อมใช้งาน', badgeClass: 'badge-success', icon: 'bi-check-circle-fill', color: 'success' },
  Withdrawn: { label: 'เบิกออกแล้ว', badgeClass: 'badge-warning', icon: 'bi-box-arrow-right', color: 'warning' },
  Repair: { label: 'อยู่ระหว่างซ่อม', badgeClass: 'badge-danger', icon: 'bi-tools', color: 'danger' },
};

export function getSNStatusBadgeClass(status) {
  return SN_STATUS_CONFIG[status]?.badgeClass || 'badge-secondary';
}

export function getSNStatusText(status) {
  return SN_STATUS_CONFIG[status]?.label || status;
}

export function getSNStatusIcon(status) {
  return SN_STATUS_CONFIG[status]?.icon || 'bi-question-circle';
}

export function getSNStatusColor(status) {
  return SN_STATUS_CONFIG[status]?.color || 'secondary';
}

// Repair Status
export const REPAIR_STATUS_CONFIG = {
  Pending: { label: 'รอซ่อม', badgeClass: 'badge-secondary', icon: 'bi-clock-history', color: 'secondary' },
  Repairing: { label: 'กำลังซ่อม', badgeClass: 'badge-warning', icon: 'bi-tools', color: 'warning' },
  Fixed: { label: 'ซ่อมเสร็จ', badgeClass: 'badge-success', icon: 'bi-check-circle-fill', color: 'success' },
  Returned: { label: 'ส่งคืนแล้ว', badgeClass: 'badge-info', icon: 'bi-box-arrow-left', color: 'info' },
};

export function getRepairStatusBadgeClass(status) {
  return REPAIR_STATUS_CONFIG[status]?.badgeClass || 'badge-light';
}

export function getRepairStatusText(status) {
  return REPAIR_STATUS_CONFIG[status]?.label || status;
}

export function getRepairStatusIcon(status) {
  return REPAIR_STATUS_CONFIG[status]?.icon || 'bi-question-circle';
}

export function getRepairStatusColor(status) {
  return REPAIR_STATUS_CONFIG[status]?.color || 'secondary';
}

// Withdrawal Log Action
export const WITHDRAWAL_ACTION_CONFIG = {
  withdraw: { label: 'เบิก', badgeClass: 'badge-warning', icon: 'bi-box-arrow-right', color: 'warning' },
  return: { label: 'คืน', badgeClass: 'badge-success', icon: 'bi-box-arrow-left', color: 'success' },
};

export function getWithdrawalActionBadgeClass(action) {
  return WITHDRAWAL_ACTION_CONFIG[action]?.badgeClass || 'badge-light';
}

export function getWithdrawalActionText(action) {
  return WITHDRAWAL_ACTION_CONFIG[action]?.label || action;
}

export function getWithdrawalActionIcon(action) {
  return WITHDRAWAL_ACTION_CONFIG[action]?.icon || 'bi-question-circle';
}

export function getWithdrawalActionColor(action) {
  return WITHDRAWAL_ACTION_CONFIG[action]?.color || 'secondary';
}