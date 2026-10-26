import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { SidebarProvider, useSidebar } from './context/SidebarContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Sidebar from './components/ui/Sidebar';
import DashboardContent from './components/DashboardContent';
import InventoryList from './components/InventoryList';
import Report from './components/Report';
import RepairDetails from './components/RepairDetails';
import Details from './components/Details';
import Login from './components/Login';
import { useAuth } from './hooks/useAuth';
import { initTheme } from './utils/theme';
import './App.css';

// Supabase configuration
const SUPABASE_URL = 'https://jmzrvccldldcpzyycowj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptenJ2Y2NsZGxkY3B6eXljb3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxNjE5ODAsImV4cCI6MjEwNzczNzk4MH0.zyPzZf-_a-zNYuRrqNlKo27PhjYa9qYoo4lr7OV_knE';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Navigation items for Sidebar
const NAV_ITEMS = [
  { id: '/', label: 'แดชบอร์ด', icon: <i className="bi bi-grid-fill" aria-hidden="true"></i> },
  { id: '/inventory', label: 'รายการอุปกรณ์', icon: <i className="bi bi-laptop" aria-hidden="true"></i> },
  { id: '/report', label: 'รายงาน', icon: <i className="bi bi-file-earmark-bar-graph-fill" aria-hidden="true"></i> },
  { id: '/repair', label: 'ประวัติแจ้งซ่อม', icon: <i className="bi bi-wrench-adjustable-circle-fill" aria-hidden="true"></i> },
];

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isLoginPage = location.pathname === '/login';
  const [collapsed, setCollapsed] = useState(false);

  // Use SidebarContext for mobile state (for page header toggle buttons)
  const { isMobile, isSidebarOpen, closeSidebar } = useSidebar();

  const handleNavClick = (id) => {
    if (id && id !== '__close__') {
      navigate(id);
      // Close sidebar on mobile after navigation
      if (isMobile) {
        closeSidebar();
      }
    }
  };

  return (
    <div className="App">
      {!isLoginPage && (
        <Sidebar
          items={NAV_ITEMS}
          activeItem={location.pathname}
          onItemClick={handleNavClick}
          user={user ? { name: user.email, email: user.email, role: 'ผู้ดูแลระบบ' } : null}
          onLogout={logout}
          collapsed={collapsed}
          onCollapseChange={setCollapsed}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          isMobile={isMobile}
        />
      )}
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
  // Initialize theme on app startup
  useEffect(() => {
    initTheme();
  }, []);

  return (
    <AuthProvider supabase={supabase}>
      <DataProvider supabase={supabase}>
        <Router>
          <SidebarProvider>
            <AppContent />
          </SidebarProvider>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
