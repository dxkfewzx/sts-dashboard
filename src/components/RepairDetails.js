import React, { useState } from 'react';
import { useRepairs } from '../hooks/useSupabase';
import { operationToast } from '../utils/toast';
import { useSidebar } from '../context/SidebarContext';
import {
  getRepairStatusBadgeClass,
  getRepairStatusText,
} from '../utils/status';
import {
  PageHeader,
  StatCard,
  Table,
  Card,
  Modal,
  Input,
  Select,
  Button,
  Badge,
  IconButton,
} from '../components/ui';
import './RepairDetails.css';

const RepairDetails = () => {
  const { isMobile, isSidebarOpen, toggleSidebar } = useSidebar();

  const MobileMenuToggle = () => {
    if (!isMobile) return null;
    return (
      <Button
        variant="secondary"
        size="icon"
        leftIcon={<i className={isSidebarOpen ? 'bi bi-x-lg' : 'bi bi-list'} />}
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
        aria-expanded={isSidebarOpen}
        className="mobile-menu-toggle"
      />
    );
  };

  const { repairs, addRepair, updateRepair, deleteRepair } = useRepairs();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRepair, setEditRepair] = useState(null);

  // Form state for add repair
  const [addForm, setAddForm] = useState({
    device_name: '',
    symptom: '',
    status: 'Pending'
  });

  // Calculate repair statistics
  const totalRepairs = repairs.length;
  const pendingRepairs = repairs.filter(r => r.status === 'Pending').length;
  const repairingRepairs = repairs.filter(r => r.status === 'Repairing').length;
  const fixedRepairs = repairs.filter(r => r.status === 'Fixed').length;
  const returnedRepairs = repairs.filter(r => r.status === 'Returned').length;

  // Handle input changes for add form
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle input changes for edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRepair(prev => ({ ...prev, [name]: value }));
  };

  // Handle add repair submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const { device_name, symptom, status } = addForm;

    if (!device_name || !symptom) {
      operationToast.validationError();
      return;
    }

    try {
      await addRepair({
        device_name,
        symptom,
        status: status || 'Pending',
        created_at: new Date().toISOString()
      });
      setAddForm({
        device_name: '',
        symptom: '',
        status: 'Pending'
      });
      setShowAddModal(false);
      operationToast.created('รายการซ่อม');
    } catch (error) {
      console.error('Error adding repair:', error);
      operationToast.createError('รายการซ่อม', error.message);
    }
  };

  // Handle edit repair submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editRepair) return;

    const { id, device_name, symptom, status } = editRepair;

    if (!device_name || !symptom) {
      operationToast.validationError();
      return;
    }

    try {
      await updateRepair(id, {
        device_name,
        symptom,
        status
      });
      setShowEditModal(false);
      operationToast.updated('รายการซ่อม');
    } catch (error) {
      console.error('Error updating repair:', error);
      operationToast.updateError('รายการซ่อม', error.message);
    }
  };

  // Handle delete repair
  const handleDeleteRepair = async (id, name) => {
    const confirmed = await operationToast.confirm({
      title: 'ยืนยันการลบ?',
      text: `คุณต้องการลบรายการซ่อม "${name}" หรือไม่?`,
      icon: 'warning',
    });

    if (confirmed) {
      try {
        await deleteRepair(id);
        operationToast.deleted('รายการซ่อม');
      } catch (error) {
        console.error('Error deleting repair:', error);
        operationToast.deleteError('รายการซ่อม', error.message);
      }
    }
  };

  const statsCards = [
    { label: 'การแจ้งซ่อม', value: totalRepairs, icon: 'bi-tools', variant: 'info' },
    { label: 'รอซ่อม', value: pendingRepairs, icon: 'bi-clock-history', variant: 'secondary' },
    { label: 'กำลังซ่อม', value: repairingRepairs, icon: 'bi-tools', variant: 'warning' },
    { label: 'ซ่อมเสร็จ', value: fixedRepairs, icon: 'bi-check-circle-fill', variant: 'success' },
    { label: 'ส่งคืนแล้ว', value: returnedRepairs, icon: 'bi-box-arrow-left', variant: 'info' },
  ];

  // Table columns
  const columns = [
    { key: 'index', header: '#', width: '50px', minWidth: '50px', render: (_, index) => String(index + 1).padStart(2, '0'), className: 'text-muted fw-bold text-center col-priority-low', hideInCard: true },
    { key: 'device_name', header: 'ชื่ออุปกรณ์ / SN', render: (repair) => repair.device_name, cardLabel: 'ชื่ออุปกรณ์/SN', className: 'col-priority-high' },
    { key: 'symptom', header: 'อาการเสีย', render: (repair) => repair.symptom || '-', cardLabel: 'อาการเสีย', className: 'col-priority-high' },
    { key: 'status', header: 'สถานะ', width: '140px', minWidth: '120px', className: 'text-center col-priority-high', render: (repair) => <Badge variant={getRepairStatusBadgeClass(repair.status).replace('badge-', '')}>{getRepairStatusText(repair.status)}</Badge>, cardLabel: 'สถานะ' },
    { key: 'created_at', header: 'วันที่แจ้ง', width: '140px', minWidth: '120px', className: 'text-center col-priority-medium', render: (repair) => <span className="text-muted small">{new Date(repair.created_at).toLocaleDateString()}</span>, cardLabel: 'วันที่แจ้ง' },
    {
      key: 'actions',
      header: 'การจัดการ',
      width: '120px',
      minWidth: '110px',
      className: 'text-center col-priority-high',
      render: (repair) => (
        <div className="d-flex justify-content-center gap-1">
          <IconButton
            variant="secondary"
            size="sm"
            onClick={() => {
              setEditRepair({
                id: repair.id,
                device_name: repair.device_name,
                symptom: repair.symptom,
                status: repair.status
              });
              setShowEditModal(true);
            }}
            title="แก้ไข"
            ariaLabel={`แก้ไข ${repair.device_name}`}
          >
            <i className="bi bi-pencil-fill" />
          </IconButton>
          <IconButton
            variant="danger"
            size="sm"
            onClick={() => handleDeleteRepair(repair.id, repair.device_name)}
            title="ลบ"
            ariaLabel={`ลบ ${repair.device_name}`}
          >
            <i className="bi bi-trash3-fill" />
          </IconButton>
        </div>
      )
    },
  ];

  return (
    <div className="repair-details-page">
      {/* Page Header */}
      <PageHeader
        title="ประวัติแจ้งซ่อม"
        subtitle="บันทึกและติดตามการแจ้งซ่อมอุปกรณ์"
        actions={
          <div className="d-flex gap-2 align-items-center">
            <MobileMenuToggle />
            <Button
              variant="primary"
              leftIcon={<i className="bi bi-plus-lg me-2" />}
              onClick={() => setShowAddModal(true)}
            >
              เพิ่มการแจ้งซ่อม
            </Button>
          </div>
        }
      />

      {/* Overview Cards */}
      <div className="repair-stats-grid">
        {statsCards.map((stat, index) => (
          <div key={index}>
            <StatCard
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              variant={stat.variant}
            />
          </div>
        ))}
      </div>

      {/* Repairs Table */}
      <Card variant="outlined" className="repair-table-card">
        <Card.Header>
          <Card.Title className="repair-table-title">รายการแจ้งซ่อมทั้งหมด</Card.Title>
        </Card.Header>
        <Card.Body padding="none">
          <Table
            columns={columns}
            data={repairs}
            emptyState={
              <div className="text-center text-muted py-4">
                ยังไม่มีข้อมูลการแจ้งซ่อมในระบบ
              </div>
            }
            striped
            hoverable
            responsive
            cardLayout
            
          />
        </Card.Body>
      </Card>

      {/* Add Repair Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="เพิ่มการแจ้งซ่อม"
        size="md"
        footer={
          <div className="d-flex gap-2 justify-content-end w-100">
            <Button variant="light" onClick={() => setShowAddModal(false)}>
              ยกเลิก
            </Button>
            <Button variant="primary" type="submit" form="add-repair-form">
              บันทึกข้อมูล
            </Button>
          </div>
        }
      >
        <form id="add-repair-form" onSubmit={handleAddSubmit}>
          <Input
            name="device_name"
            label="ชื่ออุปกรณ์ / SN"
            placeholder="ระบุชื่ออุปกรณ์หรือหมายเลขเครื่อง..."
            value={addForm.device_name}
            onChange={handleAddChange}
            required
            autoFocus
          />
          <Input
            name="symptom"
            label="อาการเสีย"
            placeholder="อธิบายอาการเสีย..."
            value={addForm.symptom}
            onChange={handleAddChange}
            required
          />
          <Select
            name="status"
            label="สถานะ"
            value={addForm.status}
            onChange={handleAddChange}
            options={[
              { value: 'Pending', label: 'รอซ่อม' },
              { value: 'Repairing', label: 'กำลังซ่อม' },
              { value: 'Fixed', label: 'ซ่อมเสร็จ' },
              { value: 'Returned', label: 'ส่งคืนแล้ว' },
            ]}
          />
        </form>
      </Modal>

      {/* Edit Repair Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditRepair(null);
        }}
        title="แก้ไขการแจ้งซ่อม"
        size="md"
        footer={
          <div className="d-flex gap-2 justify-content-end w-100">
            <Button variant="light" onClick={() => setShowEditModal(false)}>
              ยกเลิก
            </Button>
            <Button variant="primary" type="submit" form="edit-repair-form">
              บันทึกการแก้ไข
            </Button>
          </div>
        }
      >
        <form id="edit-repair-form" onSubmit={handleEditSubmit}>
          <Input
            name="device_name"
            label="ชื่ออุปกรณ์ / SN"
            value={editRepair?.device_name || ''}
            onChange={handleEditChange}
            required
          />
          <Input
            name="symptom"
            label="อาการเสีย"
            value={editRepair?.symptom || ''}
            onChange={handleEditChange}
            required
          />
          <Select
            name="status"
            label="สถานะ"
            value={editRepair?.status || ''}
            onChange={handleEditChange}
            options={[
              { value: 'Pending', label: 'รอซ่อม' },
              { value: 'Repairing', label: 'กำลังซ่อม' },
              { value: 'Fixed', label: 'ซ่อมเสร็จ' },
              { value: 'Returned', label: 'ส่งคืนแล้ว' },
            ]}
          />
        </form>
      </Modal>
    </div>
  );
};

export default RepairDetails;
