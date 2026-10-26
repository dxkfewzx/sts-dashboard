import { useData } from '../context/DataContext';

/**
 * Hook for accessing items data and operations
 */
export function useItems() {
  const { items, addItem, updateItem, deleteItem, refetch } = useData();
  return {
    items,
    addItem,
    updateItem,
    deleteItem,
    refetch,
  };
}

/**
 * Hook for accessing serial numbers data and operations
 */
export function useSerialNumbers() {
  const { serialNumbers, addSerialNumber, updateSerialNumber, deleteSerialNumber, refetch } = useData();
  return {
    serialNumbers,
    addSerialNumber,
    updateSerialNumber,
    deleteSerialNumber,
    refetch,
  };
}

/**
 * Hook for accessing repair records data and operations
 */
export function useRepairs() {
  const { repairs, addRepair, updateRepair, deleteRepair, refetch } = useData();
  return {
    repairs,
    addRepair,
    updateRepair,
    deleteRepair,
    refetch,
  };
}

/**
 * Hook for accessing withdrawal logs data
 */
export function useWithdrawalLogs() {
  const { withdrawalLogs, refetch } = useData();
  return {
    withdrawalLogs,
    refetch,
  };
}

/**
 * Hook for accessing reference data (departments, buildings, floors)
 */
export function useReferenceData() {
  const { departments, buildings, floors, refetch } = useData();
  return {
    departments,
    buildings,
    floors,
    refetch,
  };
}

/**
 * Hook for withdraw/return operations
 */
export function useWithdrawReturn() {
  const { onWithdraw, onReturn, serialNumbers } = useData();
  return {
    onWithdraw,
    onReturn,
    serialNumbers,
  };
}

/**
 * Hook for getting filtered serial numbers by item and status
 */
export function useFilteredSerialNumbers(itemId, status) {
  const { serialNumbers } = useData();

  if (!itemId) return [];

  return serialNumbers.filter(sn =>
    sn.item_id === itemId && (!status || sn.status === status)
  );
}

/**
 * Hook for getting item stats
 */
export function useItemStats(itemId) {
  const { serialNumbers } = useData();

  if (!itemId) return { total: 0, available: 0, withdrawn: 0, repair: 0, remaining: 0 };

  const itemSerialNumbers = serialNumbers.filter(sn => sn.item_id === itemId);

  return {
    total: itemSerialNumbers.length,
    available: itemSerialNumbers.filter(sn => sn.status === 'Available').length,
    withdrawn: itemSerialNumbers.filter(sn => sn.status === 'Withdrawn').length,
    repair: itemSerialNumbers.filter(sn => sn.status === 'Repair').length,
    remaining: itemSerialNumbers.filter(sn => sn.status === 'Available').length,
  };
}

/**
 * Hook for dashboard statistics
 */
export function useDashboardStats() {
  const { items, serialNumbers } = useData();

  const totalItems = items.length;
  const totalSNs = serialNumbers.length;
  const totalAvailable = serialNumbers.filter(sn => sn.status === 'Available').length;
  const totalWithdrawn = serialNumbers.filter(sn => sn.status === 'Withdrawn').length;
  const totalRepair = serialNumbers.filter(sn => sn.status === 'Repair').length;

  const lowStockItems = items.filter(item => {
    const withdrawn = serialNumbers.filter(sn => sn.item_id === item.id && sn.status === 'Withdrawn').length;
    const remaining = item.total_qty - withdrawn;
    return remaining < 3 && remaining >= 0;
  }).length;

  return {
    totalItems,
    totalSNs,
    totalAvailable,
    totalWithdrawn,
    totalRepair,
    lowStockItems,
  };
}

/**
 * Hook for report statistics
 */
export function useReportStats() {
  const { items, serialNumbers } = useData();

  const totalItems = items.length;
  const availableSN = serialNumbers.filter(sn => sn.status === 'Available').length;
  const withdrawnSN = serialNumbers.filter(sn => sn.status === 'Withdrawn').length;

  const lowStockItems = items.filter(item => {
    const withdrawn = serialNumbers.filter(sn => sn.item_id === item.id && sn.status === 'Withdrawn').length;
    const remaining = item.total_qty - withdrawn;
    return remaining < 3 && remaining >= 0;
  }).length;

  const withdrawnSerialNumbers = serialNumbers
    .filter(sn => sn.status === 'Withdrawn')
    .sort((a, b) => new Date(b.withdraw_date || b.created_at) - new Date(a.withdraw_date || a.created_at));

  const getItemName = (itemId) => {
    const item = items.find(i => i.id === itemId);
    return item ? item.item_name : 'ไม่ระบุ';
  };

  return {
    totalItems,
    availableSN,
    withdrawnSN,
    lowStockItems,
    withdrawnSerialNumbers,
    getItemName,
  };
}