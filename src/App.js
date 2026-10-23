import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Swal from 'sweetalert2';
import './App.css';
import Sidebar from './components/Sidebar';
import DashboardContent from './components/DashboardContent';
import InventoryList from './components/InventoryList';
import Report from './components/Report';
import RepairDetails from './components/RepairDetails';
import Details from './components/Details';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './components/Login';

// Supabase configuration
const SUPABASE_URL = 'https://jmzrvccldldcpzyycowj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptenJ2Y2NsZGxkY3B6eXljb3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxNjE5ODAsImV4cCI6MjEwNzczNzk4MH0.zyPzZf-_a-zNYuRrqNlKo27PhjYa9qYoo4lr7OV_knE';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function AppContent({
  items, serialNumbers, repairs, withdrawalLogs, departments, buildings, floors, loading,
  onAddItem, onUpdateItem, onDeleteItem,
  onAddSerialNumber, onUpdateSerialNumber, onDeleteSerialNumber,
  onAddRepair, onUpdateRepair, onDeleteRepair,
  onWithdraw, onReturn
}) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (loading) {
    return (
      <div className="App">
        <div className="loading">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  // If all data is empty, show a message
  if (items.length === 0 && serialNumbers.length === 0 && repairs.length === 0) {
    return (
      <div className="App">
        <div className="text-center py-5">
          <h4>ไม่พบข้อมูลในระบบ</h4>
          <p>กรุณาตรวจสอบการเชื่อมต่อกับฐานข้อมูล Supabase</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {!isLoginPage && (
        <Sidebar
          items={items}
          serialNumbers={serialNumbers}
          repairs={repairs}
          onAddItem={onAddItem}
          onUpdateItem={onUpdateItem}
          onDeleteItem={onDeleteItem}
          onAddSerialNumber={onAddSerialNumber}
          onUpdateSerialNumber={onUpdateSerialNumber}
          onDeleteSerialNumber={onDeleteSerialNumber}
          onAddRepair={onAddRepair}
          onUpdateRepair={onUpdateRepair}
          onDeleteRepair={onDeleteRepair}
        />
      )}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardContent
                  items={items}
                  serialNumbers={serialNumbers}
                  repairs={repairs}
                  withdrawalLogs={withdrawalLogs}
                  departments={departments}
                  buildings={buildings}
                  floors={floors}
                  onAddItem={onAddItem}
                  onUpdateItem={onUpdateItem}
                  onDeleteItem={onDeleteItem}
                  onAddSerialNumber={onAddSerialNumber}
                  onUpdateSerialNumber={onUpdateSerialNumber}
                  onDeleteSerialNumber={onDeleteSerialNumber}
                  onAddRepair={onAddRepair}
                  onUpdateRepair={onUpdateRepair}
                  onDeleteRepair={onDeleteRepair}
                  onWithdraw={onWithdraw}
                  onReturn={onReturn}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <InventoryList
                  items={items}
                  serialNumbers={serialNumbers}
                  withdrawalLogs={withdrawalLogs}
                  onAddItem={onAddItem}
                  onUpdateItem={onUpdateItem}
                  onDeleteItem={onDeleteItem}
                  onAddSerialNumber={onAddSerialNumber}
                  onUpdateSerialNumber={onUpdateSerialNumber}
                  onDeleteSerialNumber={onDeleteSerialNumber}
                  onWithdraw={onWithdraw}
                  onReturn={onReturn}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <Report
                  items={items}
                  serialNumbers={serialNumbers}
                  repairs={repairs}
                  withdrawalLogs={withdrawalLogs}
                  onAddItem={onAddItem}
                  onUpdateItem={onUpdateItem}
                  onDeleteItem={onDeleteItem}
                  onAddSerialNumber={onAddSerialNumber}
                  onUpdateSerialNumber={onUpdateSerialNumber}
                  onDeleteSerialNumber={onDeleteSerialNumber}
                  onAddRepair={onAddRepair}
                  onUpdateRepair={onUpdateRepair}
                  onDeleteRepair={onDeleteRepair}
                  onWithdraw={onWithdraw}
                  onReturn={onReturn}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/repair"
            element={
              <ProtectedRoute>
                <RepairDetails
                  repairs={repairs}
                  onAddRepair={onAddRepair}
                  onUpdateRepair={onUpdateRepair}
                  onDeleteRepair={onDeleteRepair}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/details/:id"
            element={
              <ProtectedRoute>
                <Details
                  items={items}
                  serialNumbers={serialNumbers}
                  withdrawalLogs={withdrawalLogs}
                  departments={departments}
                  buildings={buildings}
                  floors={floors}
                  onAddItem={onAddItem}
                  onUpdateItem={onUpdateItem}
                  onDeleteItem={onDeleteItem}
                  onAddSerialNumber={onAddSerialNumber}
                  onUpdateSerialNumber={onUpdateSerialNumber}
                  onDeleteSerialNumber={onDeleteSerialNumber}
                  onWithdraw={onWithdraw}
                  onReturn={onReturn}
                />
              </ProtectedRoute>
            }
          />
          {/* Redirect authenticated users away from login */}
          <Route
            path="/login"
            element={
              <ProtectedRoute>
                <Navigate to="/" replace />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const [items, setItems] = useState([]);
  const [serialNumbers, setSerialNumbers] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [withdrawalLogs, setWithdrawalLogs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch inventory items
        const { data: itemsData, error: itemsError } = await supabase
          .from('inventory_items')
          .select('*')
          .order('created_at', { ascending: false });

        if (itemsError) throw itemsError;

        // Fetch serial numbers
        const { data: snData, error: snError } = await supabase
          .from('serial_numbers')
          .select('*')
          .order('created_at', { ascending: false });

        if (snError) throw snError;

        // Fetch repair records
        const { data: repairsData, error: repairsError } = await supabase
          .from('repair_records')
          .select('*')
          .order('created_at', { ascending: false });

        if (repairsError) throw repairsError;

        // Fetch withdrawal logs
        const { data: logsData, error: logsError } = await supabase
          .from('withdrawal_logs')
          .select('*')
          .order('performed_at', { ascending: false });

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
    };

    fetchData();
  }, []);

  // Function to add a new item
  const addItem = async (item) => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([item])
        .select();

      if (error) throw error;
      setItems(prev => [...prev, data[0]]);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  // Function to update an item
  const updateItem = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      setItems(prev => prev.map(item => item.id === id ? data[0] : item));
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  // Function to delete an item
  const deleteItem = async (id) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // Function to add a serial number
  const addSerialNumber = async (sn) => {
    try {
      const { data, error } = await supabase
        .from('serial_numbers')
        .insert([sn])
        .select();

      if (error) throw error;
      setSerialNumbers(prev => [...prev, data[0]]);
    } catch (error) {
      console.error('Error adding serial number:', error);
    }
  };

  // Function to update a serial number
  const updateSerialNumber = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('serial_numbers')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      setSerialNumbers(prev => prev.map(sn => sn.id === id ? data[0] : sn));
    } catch (error) {
      console.error('Error updating serial number:', error);
    }
  };

  // Function to delete a serial number
  const deleteSerialNumber = async (id) => {
    try {
      const { error } = await supabase
        .from('serial_numbers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSerialNumbers(prev => prev.filter(sn => sn.id !== id));
    } catch (error) {
      console.error('Error deleting serial number:', error);
    }
  };

  // Function to add a repair record
  const addRepair = async (repair) => {
    try {
      const { data, error } = await supabase
        .from('repair_records')
        .insert([repair])
        .select();

      if (error) throw error;
      setRepairs(prev => [...prev, data[0]]);
    } catch (error) {
      console.error('Error adding repair record:', error);
    }
  };

  // Function to update a repair record
  const updateRepair = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('repair_records')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      setRepairs(prev => prev.map(repair => repair.id === id ? data[0] : repair));
    } catch (error) {
      console.error('Error updating repair record:', error);
    }
  };

  // Function to delete a repair record
  const deleteRepair = async (id) => {
    try {
      const { error } = await supabase
        .from('repair_records')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRepairs(prev => prev.filter(repair => repair.id !== id));
    } catch (error) {
      console.error('Error deleting repair record:', error);
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
      setWithdrawalLogs(prev => [logData[0], ...prev]);

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
      setWithdrawalLogs(prev => [logData[0], ...prev]);

      return { success: true, data: snData[0] };
    } catch (error) {
      console.error('Error returning:', error);
      return { success: false, error };
    }
  };

  return (
    <AuthProvider supabase={supabase}>
      <Router>
        <AppContent
          items={items}
          serialNumbers={serialNumbers}
          repairs={repairs}
          withdrawalLogs={withdrawalLogs}
          departments={departments}
          buildings={buildings}
          floors={floors}
          loading={loading}
          onAddItem={addItem}
          onUpdateItem={updateItem}
          onDeleteItem={deleteItem}
          onAddSerialNumber={addSerialNumber}
          onUpdateSerialNumber={updateSerialNumber}
          onDeleteSerialNumber={deleteSerialNumber}
          onAddRepair={addRepair}
          onUpdateRepair={updateRepair}
          onDeleteRepair={deleteRepair}
          onWithdraw={onWithdraw}
          onReturn={onReturn}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;