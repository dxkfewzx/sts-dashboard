import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ items, serialNumbers, repairs, onAddItem, onUpdateItem, onDeleteItem, onAddSerialNumber, onUpdateSerialNumber, onDeleteSerialNumber, onAddRepair, onUpdateRepair, onDeleteRepair }) => {
  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-brand">
        <i className="bi bi-shield-lock-fill fs-3"></i>
        <span>SYSTEMS IT</span>
      </div>
      <nav>
        <Link to="/" className="nav-link-custom active">
          <i className="bi bi-grid-fill"></i> แดชบอร์ด
        </Link>
        <Link to="/inventory" className="nav-link-custom">
          <i className="bi bi-laptop"></i> รายการอุปกรณ์
        </Link>
        <Link to="/report" className="nav-link-custom">
          <i className="bi bi-file-earmark-bar-graph-fill"></i> รายงาน
        </Link>
        <Link to="/repair" className="nav-link-custom">
          <i className="bi bi-wrench-adjustable-circle-fill"></i> ประวัติแจ้งซ่อม
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;