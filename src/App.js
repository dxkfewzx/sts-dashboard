import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import Sidebar from './components/Sidebar';
import DashboardContent from './components/DashboardContent';
import InventoryList from './components/InventoryList';
import Report from './components/Report';
import RepairDetails from './components/RepairDetails';
import Details from './components/Details';

// Supabase configuration
const SUPABASE_URL = 'https://jmzrvccldldcpzyycowj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptenJ2Y2NsZGxkY3B6eXljb3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxNjE5ODAsImV4cCI6MjEwNzczNzk4MH0.zyPzZf-_a-zNYuRrqNlKo27PhjYa9qYoo4lr7OV_knE';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function App() {
  const [items, setItems] = useState([]);
  const [serialNumbers, setSerialNumbers] = useState([]);
  const [repairs, setRepairs] = useState([]);
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

        // Fetch reference data from single table
        let allRefData = [];
        let referenceError = null;

        try {
          const { data: refData, error: refError } = await supabase
            .from('reference_data')
            .select('*')
            .order('type, name');

          if (refError) throw refError;
          allRefData = refData;
        } catch (refError) {
          console.warn('Failed to fetch reference data table, falling back to computed values:', refError);
          referenceError = refError;
        }

        // Separate data by type
        let deptData = [];
        let buildData = [];
        let floorData = [];
        if (!referenceError && allRefData && allRefData.length > 0) {
          deptData = allRefData.filter(item => item.type === 'department').map(item => ({
            id: item.id,
            name: item.name,
            building_default: item.building_default,
            floor_default: item.floor_default
          }));
          buildData = allRefData.filter(item => item.type === 'building').map(item => ({
            id: item.id,
            name: item.name
          }));
          floorData = allRefData.filter(item => item.type === 'floor').map(item => ({
            id: item.id,
            floor_name: item.name
          }));
        }

        // Compute fallback from serialNumbers if reference data is empty or fetch failed
        let fallbackDepartments = [];
        let fallbackBuildings = [];
        let fallbackFloors = [];
        if (snData && snData.length > 0) {
          fallbackDepartments = [...new Set(snData.map(sn => sn.dept_used).filter(Boolean))];
          fallbackBuildings = [...new Set(snData.map(sn => sn.building).filter(Boolean))];
          fallbackFloors = [...new Set(snData.map(sn => sn.floor).filter(Boolean))];
          // Sort fallback arrays
          fallbackDepartments.sort();
          fallbackBuildings.sort();
          // For floors, try to sort numerically if possible, otherwise alphabetically
          fallbackFloors.sort((a, b) => {
            const numA = parseInt(a);
            const numB = parseInt(b);
            if (!isNaN(numA) && !isNaN(numB)) {
              return numA - numB;
            }
            return a.localeCompare(b);
          });
        }

        // Set state: use reference data if not empty and fetch succeeded, otherwise fallback
        setDepartments(
          (referenceError === null && deptData.length > 0)
            ? deptData
            : fallbackDepartments.map((d, index) => ({ id: index + 1, name: d }))
        );
        setBuildings(
          (referenceError === null && buildData.length > 0)
            ? buildData
            : fallbackBuildings.map((b, index) => ({ id: index + 1, name: b }))
        );
        setFloors(
          (referenceError === null && floorData.length > 0)
            ? floorData
            : fallbackFloors.map((f, index) => ({ id: index + 1, floor_name: f }))
        );

        setItems(itemsData || []);
        setSerialNumbers(snData || []);
        setRepairs(repairsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Show error to user instead of silently failing
        alert('ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและลองใหม่อีกครั้ง');
        // Fallback to empty arrays if Supabase fails
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
    <Router>
      <div className="App">
        <Sidebar
          items={items}
          serialNumbers={serialNumbers}
          repairs={repairs}
          onAddItem={addItem}
          onUpdateItem={updateItem}
          onDeleteItem={deleteItem}
          onAddSerialNumber={addSerialNumber}
          onUpdateSerialNumber={updateSerialNumber}
          onDeleteSerialNumber={deleteSerialNumber}
          onAddRepair={addRepair}
          onUpdateRepair={updateRepair}
          onDeleteRepair={deleteRepair}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <DashboardContent
                items={items}
                serialNumbers={serialNumbers}
                repairs={repairs}
                departments={departments}
                buildings={buildings}
                floors={floors}
                onAddItem={addItem}
                onUpdateItem={updateItem}
                onDeleteItem={deleteItem}
                onAddSerialNumber={addSerialNumber}
                onUpdateSerialNumber={updateSerialNumber}
                onDeleteSerialNumber={deleteSerialNumber}
                onAddRepair={addRepair}
                onUpdateRepair={updateRepair}
                onDeleteRepair={deleteRepair}
              />
            } />
            <Route path="/inventory" element={
              <InventoryList
                items={items}
                serialNumbers={serialNumbers}
                onAddItem={addItem}
                onUpdateItem={updateItem}
                onDeleteItem={deleteItem}
                onAddSerialNumber={addSerialNumber}
                onUpdateSerialNumber={updateSerialNumber}
                onDeleteSerialNumber={deleteSerialNumber}
              />
            } />
            <Route path="/report" element={
              <Report
                items={items}
                serialNumbers={serialNumbers}
                repairs={repairs}
                onAddItem={addItem}
                onUpdateItem={updateItem}
                onDeleteItem={deleteItem}
                onAddSerialNumber={addSerialNumber}
                onUpdateSerialNumber={updateSerialNumber}
                onDeleteSerialNumber={deleteSerialNumber}
                onAddRepair={addRepair}
                onUpdateRepair={updateRepair}
                onDeleteRepair={deleteRepair}
              />
            } />
            <Route path="/repair" element={
              <RepairDetails
                repairs={repairs}
                onAddRepair={addRepair}
                onUpdateRepair={updateRepair}
                onDeleteRepair={deleteRepair}
              />
            } />
            <Route path="/details/:id" element={
              <Details
                items={items}
                serialNumbers={serialNumbers}
                departments={departments}
                buildings={buildings}
                floors={floors}
                onAddItem={addItem}
                onUpdateItem={updateItem}
                onDeleteItem={deleteItem}
                onAddSerialNumber={addSerialNumber}
                onUpdateSerialNumber={updateSerialNumber}
                onDeleteSerialNumber={deleteSerialNumber}
              />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;