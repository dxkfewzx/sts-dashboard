import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';

const DataContext = createContext(null);

export function DataProvider({ children, supabase }) {
  const [items, setItems] = useState([]);
  const [serialNumbers, setSerialNumbers] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [withdrawalLogs, setWithdrawalLogs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      // Fetch inventory items
      const { data: itemsData, error: itemsError } = await supabase
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: true });

      if (itemsError) throw itemsError;

      // Fetch serial numbers
      const { data: snData, error: snError } = await supabase
        .from('serial_numbers')
        .select('*')
        .order('created_at', { ascending: true });

      if (snError) throw snError;

      // Fetch repair records
      const { data: repairsData, error: repairsError } = await supabase
        .from('repair_records')
        .select('*')
        .order('created_at', { ascending: true });

      if (repairsError) throw repairsError;

      // Fetch withdrawal logs
      const { data: logsData, error: logsError } = await supabase
        .from('withdrawal_logs')
        .select('*')
        .order('performed_at', { ascending: true });

      if (logsError) throw logsError;

      // Fetch all data from 'departments' table (single source of truth)
      let deptData = [];
      try {
        const { data: departmentsData, error: deptError } = await supabase
          .from('departments')
          .select('dept_id, dept_name, building_default, floor_default')
          .order('dept_name');

        if (deptError) throw deptError;
        deptData = departmentsData || [];
      } catch (deptError) {
        console.warn('Failed to fetch departments table, falling back to computed values:', deptError);
      }

      // DEBUG: log raw data
      console.log('=== RAW DEPT DATA ===', deptData.length, 'rows');
      console.log('First 5:', deptData.slice(0, 5));
      console.log('Unique buildings:', [...new Set(deptData.map(d => d.building_default).filter(Boolean))]);
      console.log('Unique floors:', [...new Set(deptData.map(d => d.floor_default).filter(Boolean))]);

      // Derive buildings, floors, departments from departments table
      // Buildings: unique building_default
      const uniqueBuildings = [...new Set(
        deptData
          .map(d => d.building_default)
          .filter(Boolean)
      )].sort();

      // Floors: unique combination of building_default + floor_default
      const uniqueFloors = [...new Set(
        deptData
          .filter(d => d.building_default && d.floor_default)
          .map(d => `${d.building_default}||${d.floor_default}`)
      )]
        .sort()
        .map((combo, index) => {
          const [building_name, floor_name] = combo.split('||');
          return { id: index + 1, floor_name, building_name };
        });

      // Departments: map all rows
      const departments = deptData.map(d => ({
        id: d.dept_id,
        name: d.dept_name,
        building_name: d.building_default,
        floor_name: d.floor_default
      }));

      // DEBUG: log derived data
      console.log('=== DERIVED DATA ===');
      console.log('Buildings:', uniqueBuildings);
      console.log('Floors:', uniqueFloors);
      console.log('Departments:', departments.length);

      // Fallback from serialNumbers if departments table empty
      let fallbackDepartments = [];
      let fallbackBuildings = [];
      let fallbackFloors = [];
      if (deptData.length === 0 && snData && snData.length > 0) {
        fallbackDepartments = [...new Set(snData.map(sn => sn.dept_used).filter(Boolean))].sort();
        fallbackBuildings = [...new Set(snData.map(sn => sn.building).filter(Boolean))].sort();
        fallbackFloors = [...new Set(snData.map(sn => sn.floor).filter(Boolean))]
          .sort((a, b) => {
            const numA = parseInt(a);
            const numB = parseInt(b);
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return a.localeCompare(b);
          });
      }

      // Set state
      setBuildings(
        uniqueBuildings.length > 0
          ? uniqueBuildings.map((b, i) => ({ id: i + 1, name: b }))
          : fallbackBuildings.map((b, i) => ({ id: i + 1, name: b }))
      );

      setFloors(
        uniqueFloors.length > 0
          ? uniqueFloors
          : fallbackFloors.map((f, i) => ({ id: i + 1, floor_name: f }))
      );

      setDepartments(
        departments.length > 0
          ? departments
          : fallbackDepartments.map((d, i) => ({ id: i + 1, name: d }))
      );

      setItems(itemsData || []);
      setSerialNumbers(snData || []);
      setRepairs(repairsData || []);
      setWithdrawalLogs(logsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและลองใหม่อีกครั้ง',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#4e73df'
      });
      setItems([]);
      setSerialNumbers([]);
      setRepairs([]);
      setDepartments([]);
      setBuildings([]);
      setFloors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ==========================================
  // CRUD Functions
  // ==========================================

  // Items
  const addItem = async (item) => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([item])
        .select();

      if (error) throw error;
      setItems(prev => [...prev, data[0]]);
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error adding item:', error);
      return { success: false, error };
    }
  };

  const updateItem = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      setItems(prev => prev.map(item => item.id === id ? data[0] : item));
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error updating item:', error);
      return { success: false, error };
    }
  };

  const deleteItem = async (id) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setItems(prev => prev.filter(item => item.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting item:', error);
      return { success: false, error };
    }
  };

  // Serial Numbers
  const addSerialNumber = async (sn) => {
    try {
      const { data, error } = await supabase
        .from('serial_numbers')
        .insert([sn])
        .select();

      if (error) throw error;
      setSerialNumbers(prev => [...prev, data[0]]);
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error adding serial number:', error);
      return { success: false, error };
    }
  };

  const updateSerialNumber = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('serial_numbers')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      setSerialNumbers(prev => prev.map(sn => sn.id === id ? data[0] : sn));
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error updating serial number:', error);
      return { success: false, error };
    }
  };

  const deleteSerialNumber = async (id) => {
    try {
      const { error } = await supabase
        .from('serial_numbers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSerialNumbers(prev => prev.filter(sn => sn.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting serial number:', error);
      return { success: false, error };
    }
  };

  // Repairs
  const addRepair = async (repair) => {
    try {
      const { data, error } = await supabase
        .from('repair_records')
        .insert([repair])
        .select();

      if (error) throw error;
      setRepairs(prev => [...prev, data[0]]);
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error adding repair record:', error);
      return { success: false, error };
    }
  };

  const updateRepair = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('repair_records')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      setRepairs(prev => prev.map(repair => repair.id === id ? data[0] : repair));
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error updating repair record:', error);
      return { success: false, error };
    }
  };

  const deleteRepair = async (id) => {
    try {
      const { error } = await supabase
        .from('repair_records')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRepairs(prev => prev.filter(repair => repair.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting repair record:', error);
      return { success: false, error };
    }
  };

  // ==========================================
  // Withdraw / Return Functions with Logging
  // ==========================================
  const onWithdraw = async (serialNumberId, withdrawData) => {
    const { item_id, serial_number, job_number, withdrawer_name, dept_used, building, floor, withdraw_date } = withdrawData;

    try {
      // 1. Update serial_number status to Withdrawn
      const { data: snData, error: snError } = await supabase
        .from('serial_numbers')
        .update({
          status: 'Withdrawn',
          job_number,
          withdrawer_name,
          dept_used,
          building: building || '',
          floor: floor || '',
          withdraw_date: withdraw_date || new Date().toISOString()
        })
        .eq('id', serialNumberId)
        .select();

      if (snError) throw snError;

      // 2. Insert withdrawal log
      const { data: logData, error: logError } = await supabase
        .from('withdrawal_logs')
        .insert([{
          serial_number_id: serialNumberId,
          item_id,
          action: 'withdraw',
          job_number,
          withdrawer_name,
          dept_used,
          building: building || '',
          floor: floor || '',
          performed_by: 'current_user' // TODO: get from auth
        }])
        .select();

      if (logError) throw logError;

      // 3. Update local state
      setSerialNumbers(prev => prev.map(sn => sn.id === serialNumberId ? snData[0] : sn));
      setWithdrawalLogs(prev => [...prev, logData[0]]);

      return { success: true, data: snData[0] };
    } catch (error) {
      console.error('Error withdrawing:', error);
      return { success: false, error };
    }
  };

  const onReturn = async (serialNumberId, returnData) => {
    const { receiver_name, return_condition, return_note, job_number, dept_used, building, floor, performed_by } = returnData;

    try {
      // 1. Update serial_number status to Available + return info
      const { data: snData, error: snError } = await supabase
        .from('serial_numbers')
        .update({
          status: 'Available',
          receiver_name,
          return_condition,
          return_note,
          return_date: new Date().toISOString()
        })
        .eq('id', serialNumberId)
        .select();

      if (snError) throw snError;

      // 2. Get the serial number for item_id
      const sn = serialNumbers.find(s => s.id === serialNumberId);
      const item_id = sn?.item_id;

      // 3. Insert return log
      const { data: logData, error: logError } = await supabase
        .from('withdrawal_logs')
        .insert([{
          serial_number_id: serialNumberId,
          item_id,
          action: 'return',
          receiver_name,
          condition: return_condition,
          note: return_note,
          job_number: job_number || '',
          dept_used: dept_used || '',
          building: building || '',
          floor: floor || '',
          performed_by: performed_by || 'current_user'
        }])
        .select();

      if (logError) throw logError;

      // 4. Update local state
      setSerialNumbers(prev => prev.map(s => s.id === serialNumberId ? snData[0] : s));
      setWithdrawalLogs(prev => [...prev, logData[0]]);

      return { success: true, data: snData[0] };
    } catch (error) {
      console.error('Error returning:', error);
      return { success: false, error };
    }
  };

  const value = {
    // State
    items,
    serialNumbers,
    repairs,
    withdrawalLogs,
    departments,
    buildings,
    floors,
    loading,
    // CRUD functions
    addItem,
    updateItem,
    deleteItem,
    addSerialNumber,
    updateSerialNumber,
    deleteSerialNumber,
    addRepair,
    updateRepair,
    deleteRepair,
    // Withdraw/Return
    onWithdraw,
    onReturn,
    // Refetch
    refetch: fetchData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}