import React, { useState } from 'react';
import { useItems, useDashboardStats, useWithdrawReturn, useReferenceData } from '../hooks/useSupabase';
import { operationToast } from '../utils/toast';
import { useSidebar } from '../context/SidebarContext';
import {
  PageHeader,
  StatCard,
  Table,
  Card,
  Button,
  Modal,
  Input,
  Select,
} from '../components/ui';

const DashboardContent = () => {
  const { isMobile, isSidebarOpen, toggleSidebar } = useSidebar();

  // Fallback check for mobile - use both context and direct window check
  const isMobileFallback = typeof window !== 'undefined' && window.innerWidth <= 1024;
  const shouldShowMobileMenu = isMobile || isMobileFallback;

  const MobileMenuToggle = () => {
    if (!shouldShowMobileMenu) return null;
    return (
      <Button
        variant="outline"
        size="icon"
        leftIcon={<i className={isSidebarOpen ? 'bi bi-x-lg' : 'bi bi-list'} />}
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
        aria-expanded={isSidebarOpen}
        className="mobile-menu-toggle"
      />
    );
  };

  const { items } = useItems();
  const { totalItems, totalAvailable, totalWithdrawn, totalRepair } = useDashboardStats();
  const { onWithdraw, serialNumbers } = useWithdrawReturn();
  const { departments, buildings, floors } = useReferenceData();

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [availableSerialNumbers, setAvailableSerialNumbers] = useState([]);
  const [formData, setFormData] = useState({
    item_id: '',
    serial_number: '',
    job_number: '',
    withdrawer: '',
    dept_info: '',
    building_info: '',
    floor_info: ''
  });

  // Handle item change to fetch available serial numbers
  const handleItemChange = (e) => {
    const itemId = e.target.value;
    setSelectedItemId(itemId);
    setFormData(prev => ({ ...prev, item_id: itemId }));

    if (itemId) {
      // Filter serial numbers directly (can't use hook inside handler)
      const available = serialNumbers.filter(
        sn => sn.item_id === parseInt(itemId) && sn.status === 'Available'
      );
      setAvailableSerialNumbers(available);
    } else {
      setAvailableSerialNumbers([]);
    }
  };

  // Handle serial number change
  const handleSNChange = (e) => {
    setFormData(prev => ({ ...prev, serial_number: e.target.value }));
  };

  // Handle other form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submit - uses new onWithdraw function with logging
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { item_id, serial_number, job_number, withdrawer, dept_info, building_info, floor_info } = formData;

    // Validate
    if (!item_id || !serial_number || !job_number || !withdrawer || !dept_info) {
      operationToast.validationError();
      return;
    }

    // Find the serial number record to update
    const snRecord = serialNumbers.find(
      sn => sn.item_id === parseInt(item_id) && sn.serial_number === serial_number
    );

    if (snRecord) {
      try {
        const result = await onWithdraw(snRecord.id, {
          item_id: parseInt(item_id),
          serial_number,
          job_number,
          withdrawer_name: withdrawer,
          dept_used: dept_info,
          building: building_info || '',
          floor: floor_info || '',
          withdraw_date: new Date().toISOString()
        });

        if (result.success) {
          // Reset form and close modal
          setFormData({
            item_id: '',
            serial_number: '',
            job_number: '',
            withdrawer: '',
            dept_info: '',
            building_info: '',
            floor_info: ''
          });
          setSelectedItemId('');
          setAvailableSerialNumbers([]);
          setShowWithdrawModal(false);
          operationToast.withdrawn();
        } else {
          operationToast.withdrawError(result.error?.message);
        }
      } catch (error) {
        console.error('Error withdrawing:', error);
        operationToast.withdrawError();
      }
    } else {
      operationToast.validationError('ไม่พบข้อมูลหมายเลขเครื่อง');
    }
  };

  // Calculate withdrawn count for an item
  const getWithdrawnCount = (itemId) => {
    return serialNumbers.filter(
      sn => sn.item_id === itemId && sn.status === 'Withdrawn'
    ).length;
  };

  // Calculate remaining count for an item
  const getRemainingCount = (item) => {
    const withdrawn = getWithdrawnCount(item.id);
    return item.total_qty - withdrawn;
  };

  // Calculate repair count for an item
  const getRepairCount = (itemId) => {
    return serialNumbers.filter(
      sn => sn.item_id === itemId && sn.status === 'Repair'
    ).length;
  };

  const statsCards = [
    { label: 'รายการอุปกรณ์', value: totalItems, icon: 'bi-boxes', variant: 'primary' },
    { label: 'พร้อมใช้งาน', value: totalAvailable, icon: 'bi-check-circle-fill', variant: 'success' },
    { label: 'เบิกออกแล้ว', value: totalWithdrawn, icon: 'bi-box-arrow-right', variant: 'warning' },
    { label: 'อยู่ระหว่างซ่อม', value: totalRepair, icon: 'bi-tools', variant: 'danger' },
  ];

  // Table columns for Items table
  const itemColumns = [
    { key: 'index', header: '#', width: '50px', minWidth: '50px', render: (_, index) => String(index + 1).padStart(2, '0'), className: 'text-muted fw-bold', hideInCard: true },
    { key: 'item_name', header: 'รายการ', className: 'fw-medium', cardLabel: 'รายการ' },
    { key: 'responsible', header: 'ผู้ดูแล', width: '130px', minWidth: '120px', render: (item) => <span className="badge badge-secondary"><i className="bi bi-person me-1"></i>{item.responsible || '-'}</span>, cardLabel: 'ผู้ดูแล' },
    { key: 'total_qty', header: 'ทั้งหมด', width: '80px', minWidth: '70px', render: (item) => <span className="fw-bold text-primary">{item.total_qty}</span>, className: 'text-center', cardLabel: 'จำนวนทั้งหมด' },
    { key: 'available', header: 'พร้อมใช้', width: '80px', minWidth: '70px', render: (item) => <span className="fw-bold text-success">{item.total_qty - getWithdrawnCount(item.id) - getRepairCount(item.id)}</span>, className: 'text-center', cardLabel: 'พร้อมใช้' },
    { key: 'withdrawn', header: 'เบิกออก', width: '80px', minWidth: '70px', render: (item) => <span className="fw-bold text-warning">{getWithdrawnCount(item.id)}</span>, className: 'text-center', cardLabel: 'เบิกออก' },
    { key: 'repair', header: 'ซ่อม', width: '80px', minWidth: '70px', render: (item) => <span className="fw-bold text-danger">{getRepairCount(item.id)}</span>, className: 'text-center', cardLabel: 'ซ่อม' },
    { key: 'remaining', header: 'คงเหลือ', width: '80px', minWidth: '70px', render: (item) => <span className="fw-bold">{getRemainingCount(item)}</span>, className: 'text-center', cardLabel: 'คงเหลือ' },
    {
      key: 'actions',
      header: 'การจัดการ',
      width: '120px',
      minWidth: '110px',
      className: 'text-center',
      render: (item) => (
        <div className="d-flex justify-content-center gap-1">
          <a
            href={`/details/${item.id}`}
            className="btn-action"
            title="ดูรายละเอียด"
          >
            <i className="bi bi-eye" />
          </a>
          <Button
            variant="outline"
            size="icon"
            leftIcon={<i className="bi bi-box-arrow-right" />}
            className="btn-action btn-withdraw"
            onClick={() => setShowWithdrawModal(true)}
            title="เบิกอุปกรณ์"
            aria-label={`เบิก ${item.item_name}`}
          />
        </div>
      )
    },
  ];

  // Table data
  const tableData = items.length > 0 ? items : [];

  // Empty state
  const emptyState = items.length === 0 ? (
    <div className="text-center text-muted py-4">
      ยังไม่มีข้อมูลวัสดุในระบบ
    </div>
  ) : null;

  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="ภาพรวมคลังอุปกรณ์"
        subtitle="สถานะอุปกรณ์คงเหลือและการเบิกจ่ายล่าสุด"
        actions={
          <div className="d-flex gap-2 align-items-center">
            <MobileMenuToggle />
            <Button
              variant="primary"
              leftIcon={<i className="bi bi-box-arrow-right me-2" />}
              onClick={() => setShowWithdrawModal(true)}
            >
              เบิกอุปกรณ์
            </Button>
          </div>
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

      {/* Items Table */}
      <Card variant="outlined">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <Card.Title>รายการอุปกรณ์ทั้งหมด</Card.Title>
            <span className="badge badge-secondary">{totalItems} รายการ</span>
          </div>
        </Card.Header>
        <Card.Body padding="none">
          <Table
            columns={itemColumns}
            data={tableData}
            emptyState={emptyState}
            striped
            hoverable
            responsive
            cardLayout
          />
        </Card.Body>
      </Card>

      {/* Withdraw Modal */}
      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        items={items}
        serialNumbers={serialNumbers}
        departments={departments}
        buildings={buildings}
        floors={floors}
        formData={formData}
        selectedItemId={selectedItemId}
        availableSerialNumbers={availableSerialNumbers}
        onItemChange={handleItemChange}
        onSNChange={handleSNChange}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

// Withdraw Modal Component (refactored to use UI components)
const WithdrawModal = ({
  isOpen,
  onClose,
  items,
  serialNumbers,
  departments,
  buildings,
  floors,
  formData,
  selectedItemId,
  availableSerialNumbers,
  onItemChange,
  onSNChange,
  onChange,
  onSubmit,
}) => {
  // State for cascading dropdowns
  const [filteredFloors, setFilteredFloors] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  // Handle building change: filter floors based on selected building
  React.useEffect(() => {
    if (!isOpen) return;

    const selectedBuilding = formData.building_info;

    if (!selectedBuilding) {
      // No building selected, show all floors
      setFilteredFloors(floors);
      return;
    }

    // Filter floors by building (assumes floors have building_name or building_id field)
    const buildingFloors = floors.filter(floor =>
      floor.building_name === selectedBuilding || floor.building_id === selectedBuilding
    );

    setFilteredFloors(buildingFloors.length > 0 ? buildingFloors : floors);
  }, [isOpen, floors, formData.building_info, formData.floor_info]);

  // Handle floor change: filter departments based on selected building AND floor
  React.useEffect(() => {
    if (!isOpen) return;

    const selectedBuilding = formData.building_info;
    const selectedFloor = formData.floor_info;

    if (!selectedBuilding && !selectedFloor) {
      // No building or floor selected, show all departments
      setFilteredDepartments(departments);
      return;
    }

    // Filter departments by building and/or floor
    let filteredDepts = departments;

    if (selectedBuilding) {
      filteredDepts = filteredDepts.filter(dept =>
        dept.building_name === selectedBuilding || dept.building_id === selectedBuilding
      );
    }

    if (selectedFloor) {
      filteredDepts = filteredDepts.filter(dept =>
        dept.floor_name === selectedFloor || dept.floor_id === selectedFloor
      );
    }

    setFilteredDepartments(filteredDepts.length > 0 ? filteredDepts : departments);
  }, [isOpen, departments, formData.building_info, formData.floor_info]);

  // Auto-fill building and floor when department is selected
  React.useEffect(() => {
    if (!isOpen) return;

    const selectedDeptName = formData.dept_info;
    if (!selectedDeptName) return;

    // Find the department in the departments array to get its default building and floor
    const selectedDept = departments.find(d => d.name === selectedDeptName);
    if (selectedDept) {
      if (selectedDept.building_name && !formData.building_info) {
        onChange({ target: { name: 'building_info', value: selectedDept.building_name } });
      }
      if (selectedDept.floor_name && !formData.floor_info) {
        onChange({ target: { name: 'floor_info', value: selectedDept.floor_name } });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, departments, formData.dept_info, onChange]);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="บันทึกการเบิกอุปกรณ์"
      size="md"
      footer={
        <div className="d-flex gap-2 justify-content-end w-100">
          <Button variant="light" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button variant="primary" type="submit" form="withdraw-form">
            ยืนยันการเบิกอุปกรณ์
          </Button>
        </div>
      }
    >
      <form id="withdraw-form" onSubmit={onSubmit}>
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <Select
              name="item_id"
              label="เลือกอุปกรณ์"
              placeholder="-- เลือกรายการ --"
              value={formData.item_id}
              onChange={onItemChange}
              required
              options={items.map(item => ({ value: item.id, label: item.item_name }))}
            />
          </div>
          <div className="col-md-6">
            <Input
              name="job_number"
              label="เลข Job"
              placeholder="JOB6904001"
              value={formData.job_number}
              onChange={onChange}
              required
              leftIcon={<i className="bi bi-hash" />}
            />
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <Input
              name="withdrawer"
              label="ชื่อผู้เบิก"
              value={formData.withdrawer}
              onChange={onChange}
              required
              leftIcon={<i className="bi bi-person" />}
            />
          </div>
          <div className="col-md-6">
            <Select
              name="serial_number"
              label="Serial Number"
              placeholder={!selectedItemId ? '-- กรุณาเลือกอุปกรณ์ก่อน --' : '-- เลือกหมายเลขเครื่อง --'}
              value={formData.serial_number}
              onChange={onSNChange}
              disabled={!selectedItemId}
              required
              options={availableSerialNumbers.map(sn => ({ value: sn.serial_number, label: sn.serial_number }))}
            />
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <Select
              name="dept_info"
              label="หน่วยงาน / แผนก"
              placeholder="-- เลือกแผนก --"
              value={formData.dept_info}
              onChange={onChange}
              required
              options={filteredDepartments.map(dept => ({ value: dept.name, label: dept.name }))}
            />
          </div>
          <div className="col-md-4">
            <Select
              name="building_info"
              label="อาคาร"
              placeholder="-- อาคาร --"
              value={formData.building_info}
              onChange={onChange}
              options={buildings.map(building => ({ value: building.name, label: building.name }))}
            />
          </div>
          <div className="col-md-4">
            <Select
              name="floor_info"
              label="ชั้น"
              placeholder="-- ชั้น --"
              value={formData.floor_info}
              onChange={onChange}
              options={filteredFloors.map(floor => ({ value: floor.floor_name, label: floor.floor_name }))}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default DashboardContent;
