import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Swal from 'sweetalert2';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'ออกจากระบบ?',
      text: 'คุณต้องการออกจากระบบหรือไม่?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ออกจากระบบ',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      await logout();
    }
  };

  return (
    <aside className="sidebar d-flex flex-column" id="sidebar">
      <div className="sidebar-brand">
        <i className="bi bi-shield-lock-fill fs-3"></i>
        <span>SYSTEMS IT</span>
      </div>
      <nav className="flex-grow-1">
        <Link to="/" className={`nav-link-custom ${location.pathname === '/' ? 'active' : ''}`}>
          <i className="bi bi-grid-fill"></i> แดชบอร์ด
        </Link>
        <Link to="/inventory" className={`nav-link-custom ${location.pathname === '/inventory' ? 'active' : ''}`}>
          <i className="bi bi-laptop"></i> รายการอุปกรณ์
        </Link>
        <Link to="/report" className={`nav-link-custom ${location.pathname === '/report' ? 'active' : ''}`}>
          <i className="bi bi-file-earmark-bar-graph-fill"></i> รายงาน
        </Link>
        <Link to="/repair" className={`nav-link-custom ${location.pathname === '/repair' ? 'active' : ''}`}>
          <i className="bi bi-wrench-adjustable-circle-fill"></i> ประวัติแจ้งซ่อม
        </Link>
      </nav>
      {/* User info and logout at bottom */}
      <div className="sidebar-user p-3 border-top">
        <div className="d-flex align-items-center mb-2">
          <div className="user-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '36px', height: '36px', fontSize: '14px', fontWeight: 'bold' }}>
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div className="flex-grow-1 overflow-hidden">
            <div className="fw-bold small text-truncate">{user?.email}</div>
            <div className="text-muted x-small">ผู้ดูแลระบบ</div>
          </div>
        </div>
        <button className="btn btn-outline-danger btn-sm w-100" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-1"></i> ออกจากระบบ
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;