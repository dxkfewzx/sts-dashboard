import React from 'react';
import { useItems, useSerialNumbers } from '../hooks/useSupabase';
import { useSidebar } from '../context/SidebarContext';
import {
  PageHeader,
  StatCard,
  Table,
  Card,
  Badge,
  Button,
} from '../components/ui';

const Report = () => {
  const { isMobile, isSidebarOpen, toggleSidebar } = useSidebar();

  const MobileMenuToggle = () => {
    if (!isMobile) return null;
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
        aria-expanded={isSidebarOpen}
        className="mobile-menu-toggle"
      >
        <i className={isSidebarOpen ? 'bi bi-x-lg' : 'bi bi-list'} style={{ fontSize: '1.25rem' }} />
      </Button>
    );
  };

  const { items } = useItems();
  const { serialNumbers } = useSerialNumbers();

  // Calculate statistics
  const totalItems = items.length;
  const availableSN = serialNumbers.filter(sn => sn.status === 'Available').length;
  const withdrawnSN = serialNumbers.filter(sn => sn.status === 'Withdrawn').length;

  // Calculate items with low stock (less than 3 remaining)
  const lowStockItems = items.filter(item => {
    const withdrawn = serialNumbers.filter(sn => sn.item_id === item.id && sn.status === 'Withdrawn').length;
    const remaining = item.total_qty - withdrawn;
    return remaining < 3 && remaining >= 0;
  }).length;

  // Get withdrawn serial numbers (equipment withdrawal data)
  const withdrawnSerialNumbers = serialNumbers
    .filter(sn => sn.status === 'Withdrawn')
    .sort((a, b) => new Date(b.withdraw_date || b.created_at) - new Date(a.withdraw_date || a.created_at));

  // Get item name from item_id
  const getItemName = (itemId) => {
    const item = items.find(i => i.id === itemId);
    return item ? item.item_name : 'ไม่ระบุ';
  };

  const statsCards = [
    { label: 'รายการอุปกรณ์', value: totalItems, icon: 'bi-boxes', variant: 'primary' },
    { label: 'คงเหลือในสต็อก', value: availableSN, icon: 'bi-check-circle-fill', variant: 'success' },
    { label: 'เบิกออก', value: withdrawnSN, icon: 'bi-box-arrow-right', variant: 'warning' },
    { label: 'สินค้าคงเหลือน้อย', value: lowStockItems, icon: 'bi-exclamation-triangle-fill', variant: 'danger' },
  ];

  // Table 1: Withdrawal Details
  const withdrawalColumns = [
    { key: 'index', header: '#', width: '50px', minWidth: '50px', render: (_, index) => String(index + 1).padStart(2, '0'), className: 'text-muted fw-bold text-center' },
    { key: 'item_name', header: 'ชื่ออุปกรณ์', render: (sn) => <span className="fw-bold">{getItemName(sn.item_id)}</span> },
    { key: 'serial_number', header: 'Serial Number', render: (sn) => sn.serial_number || '-' },
    { key: 'job_number', header: 'เลข Job', render: (sn) => sn.job_number || '-' },
    { key: 'withdrawer_name', header: 'ผู้เบิก', render: (sn) => sn.withdrawer_name || '-' },
    { key: 'dept_used', header: 'หน่วยงาน / แผนก', render: (sn) => sn.dept_used || '-' },
    { key: 'building_floor', header: 'อาคาร / ชั้น', width: '140px', minWidth: '120px', render: (sn) => `${sn.building ? sn.building + ' ' : ''}${sn.floor ? '/ ' + sn.floor : ''}` || '-' },
    { key: 'withdraw_date', header: 'วันที่เบิก', width: '140px', minWidth: '120px', className: 'text-center', render: (sn) => <span className="text-muted small">{sn.withdraw_date ? new Date(sn.withdraw_date).toLocaleDateString('th-TH') : (sn.created_at ? new Date(sn.created_at).toLocaleDateString('th-TH') : '-')}</span> },
  ];

  // Table 2: Outstanding Withdrawals
  const outstandingColumns = [
    { key: 'index', header: '#', width: '50px', minWidth: '50px', render: (_, index) => String(index + 1).padStart(2, '0'), className: 'text-muted fw-bold text-center' },
    { key: 'item_name', header: 'ชื่ออุปกรณ์', render: (sn) => <span className="fw-bold">{getItemName(sn.item_id)}</span> },
    { key: 'serial_number', header: 'Serial Number', render: (sn) => sn.serial_number || '-' },
    { key: 'job_number', header: 'เลข Job', render: (sn) => sn.job_number || '-' },
    { key: 'withdrawer_name', header: 'ผู้เบิก', render: (sn) => sn.withdrawer_name || '-' },
    { key: 'dept_used', header: 'หน่วยงาน / แผนก', render: (sn) => sn.dept_used || '-' },
    { key: 'building_floor', header: 'อาคาร / ชั้น', render: (sn) => `${sn.building ? sn.building + ' ' : ''}${sn.floor ? '/ ' + sn.floor : ''}` || '-' },
    { key: 'withdraw_date', header: 'วันที่เบิก', width: '140px', minWidth: '120px', className: 'text-center', render: (sn) => <span className="text-muted small">{sn.withdraw_date ? new Date(sn.withdraw_date).toLocaleDateString('th-TH') : (sn.created_at ? new Date(sn.created_at).toLocaleDateString('th-TH') : '-')}</span> },
    { key: 'days_outstanding', header: 'อายุ (วัน)', width: '100px', minWidth: '90px', className: 'text-center', render: (sn) => {
      const withdrawDate = sn.withdraw_date ? new Date(sn.withdraw_date) : (sn.created_at ? new Date(sn.created_at) : null);
      const daysOutstanding = withdrawDate ? Math.floor((new Date() - withdrawDate) / (1000 * 60 * 60 * 24)) : 0;
      const isOverdue = daysOutstanding > 7;
      return <span className={isOverdue ? 'fw-bold text-danger' : 'fw-bold text-warning'}>{daysOutstanding} วัน</span>;
    }},
    { key: 'return_status', header: 'สถานะคืน', width: '140px', minWidth: '120px', className: 'text-center', render: (sn) => {
      const withdrawDate = sn.withdraw_date ? new Date(sn.withdraw_date) : (sn.created_at ? new Date(sn.created_at) : null);
      const daysOutstanding = withdrawDate ? Math.floor((new Date() - withdrawDate) / (1000 * 60 * 60 * 24)) : 0;
      const isOverdue = daysOutstanding > 7;
      return <Badge variant={isOverdue ? 'danger' : 'warning'}>{isOverdue ? 'เกินกำหนด' : 'รอรับคืน'}</Badge>;
    }},
  ];

  return (
    <div>
      <PageHeader
        title="รายงานสรุป"
        subtitle="ภาพรวมสถานะคลังอุปกรณ์และการเบิกจ่าย"
        actions={
          <MobileMenuToggle />
        }
      />

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {statsCards.map((stat, index) => (
          <div key={index} className="col-6 col-md-3">
            <StatCard
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              variant={stat.variant}
            />
          </div>
        ))}
      </div>

      {/* Withdrawal Details Table */}
      <Card variant="outlined">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <Card.Title>รายละเอียดการเบิกอุปกรณ์</Card.Title>
            <Badge variant="secondary">{withdrawnSerialNumbers.length} รายการ</Badge>
          </div>
        </Card.Header>
        <Card.Body padding="none">
          <Table
            columns={withdrawalColumns}
            data={withdrawnSerialNumbers}
            emptyState={
              <div className="text-center text-muted py-4">
                ยังไม่มีข้อมูลการเบิกอุปกรณ์ในระบบ
              </div>
            }
            striped
            hoverable
            responsive
            minWidth={900}
          />
        </Card.Body>
      </Card>

      {/* Outstanding Withdrawals - Items not yet returned */}
      <Card variant="outlined" className="mt-4">
        <Card.Header>
          <Card.Title>อุปกรณ์ที่ยังไม่ได้รับคืน (Outstanding)</Card.Title>
        </Card.Header>
        <Card.Body padding="none">
          <Table
            columns={outstandingColumns}
            data={withdrawnSerialNumbers}
            emptyState={
              <div className="text-center text-muted py-4">
                ไม่มีอุปกรณ์ที่ยังไม่ได้รับคืน
              </div>
            }
            striped
            hoverable
            responsive
            minWidth={1000}
            getRowClass={(sn) => {
              const withdrawDate = sn.withdraw_date ? new Date(sn.withdraw_date) : (sn.created_at ? new Date(sn.created_at) : null);
              const daysOutstanding = withdrawDate ? Math.floor((new Date() - withdrawDate) / (1000 * 60 * 60 * 24)) : 0;
              return daysOutstanding > 7 ? 'table-danger' : '';
            }}
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default Report;