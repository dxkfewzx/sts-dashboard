import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import DashboardContent from './components/DashboardContent';
import InventoryList from './components/InventoryList';
import Report from './components/Report';
import RepairDetails from './components/RepairDetails';
import Details from './components/Details';
import Login from './components/Login';
import './App.css';

// Supabase configuration
const SUPABASE_URL = 'https://jmzrvccldldcpzyycowj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptenJ2Y2NsZGxkY3B6eXljb3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxNjE5ODAsImV4cCI6MjEwNzczNzk4MH0.zyPzZf-_a-zNYuRrqNlKo27PhjYa9qYoo4lr7OV_knE';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="App">
      {!isLoginPage && <Sidebar />}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardContent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <InventoryList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            }
          />
          <Route
            path="/repair"
            element={
              <ProtectedRoute>
                <RepairDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/details/:id"
            element={
              <ProtectedRoute>
                <Details />
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
  return (
    <AuthProvider supabase={supabase}>
      <DataProvider supabase={supabase}>
        <Router>
          <AppContent />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;