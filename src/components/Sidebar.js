import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSidebar } from '../context/SidebarContext';
import { swalConfirm } from '../utils/swal';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { isSidebarOpen, closeSidebar } = useSidebar();

  const handleLogout = async () => {
    const result = await swalConfirm({
      title: 'ออกจากระบบ?',
      text: 'คุณต้องการออกจากระบบหรือไม่?',
      icon: 'question',
      confirmButtonText: 'ใช่, ออกจากระบบ',
      cancelButtonText: 'ยกเลิก',
    });

    if (result.isConfirmed) {
      await logout();
      closeSidebar(); // Close sidebar on mobile after logout
    }
  };

  // Close sidebar on mobile when a nav link is clicked
  const handleNavClick = () => {
    closeSidebar();
  };

  return (
    <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`} id="sidebar" role="navigation" aria-label="เมนูหลัก">
      <div className="sidebar-brand">
        <i className="bi bi-box-seam fs-3" aria-hidden="true"></i>
        <span>STS Dashboard</span>
      </div>
      <nav className="flex-grow-1">
        <Link
          to="/"
          className={`nav-link-custom ${location.pathname === '/' ? 'active' : ''}`}
          onClick={handleNavClick}
        >
          <i className="bi bi-grid-fill" aria-hidden="true"></i> แดชบอร์ด
        </Link>
        <Link
          to="/inventory"
          className={`nav-link-custom ${location.pathname === '/inventory' ? 'active' : ''}`}
          onClick={handleNavClick}
        >
          <i className="bi bi-laptop" aria-hidden="true"></i> รายการอุปกรณ์
        </Link>
        <Link
          to="/report"
          className={`nav-link-custom ${location.pathname === '/report' ? 'active' : ''}`}
          onClick={handleNavClick}
        >
          <i className="bi bi-file-earmark-bar-graph-fill" aria-hidden="true"></i> รายงาน
        </Link>
        <Link
          to="/repair"
          className={`nav-link-custom ${location.pathname === '/repair' ? 'active' : ''}`}
          onClick={handleNavClick}
        >
          <i className="bi bi-wrench-adjustable-circle-fill" aria-hidden="true"></i> ประวัติแจ้งซ่อม
        </Link>
      </nav>
      {/* User info and logout at bottom */}
      <div className="sidebar-user p-3 border-top">
        <div className="d-flex align-items-center mb-2">
          <div className="user-avatar me-2" aria-hidden="true">
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div className="user-info flex-grow-1 overflow-hidden">
            <div className="user-email fw-bold small text-truncate">{user?.email}</div>
            <div className="user-role text-muted x-small">ผู้ดูแลระบบ</div>
          </div>
        </div>
        <button className="btn btn-outline-danger btn-sm w-100" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-1" aria-hidden="true"></i> ออกจากระบบ
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;