import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useCascadingDropdowns, useItemSerialNumbers, useItemHistory, useSNHistory } from '../hooks/useCascadingDropdowns';
import { useSidebar } from '../context/SidebarContext';
import {
  INITIAL_SN_FORM,
  INITIAL_BULK_FORM,
  INITIAL_RETURN_FORM,
  createSNFormData,
  createBulkSNArray,
  createReturnFormData,
} from '../constants/snForms';
import {
  getSNStatusBadgeClass,
  getSNStatusText,
  getWithdrawalActionBadgeClass,
  getWithdrawalActionText,
} from '../utils/status';
import { operationToast, confirm } from '../utils/toast';
import AddSNModal from './modals/AddSNModal';
import BulkAddSNModal from './modals/BulkAddSNModal';
import EditSNModal from './modals/EditSNModal';
import ReturnModal from './modals/ReturnModal';
import HistoryModal from './modals/HistoryModal';
import {
  PageHeader,
  Tabs,
  Table,
  Card,
  StatCard,
  Badge,
  Button,
} from '../components/ui';
import './Details.css';

const Details = () => {
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
        <i className={isSidebarOpen ? 'bi bi-x-lg' : 'bi bi-list'} />
      </Button>
    );
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const itemId = parseInt(id);

  const {
    items,
    serialNumbers,
    withdrawalLogs,
    departments,
    buildings,
    floors,
    addSerialNumber,
    updateSerialNumber,
    deleteSerialNumber,
    onReturn,
  } = useData();

  // Item & Serial Numbers
  const item = items.find(i => i.id === itemId) || null;
  const itemSerialNumbers = useItemSerialNumbers(itemId, serialNumbers);
  const itemHistoryLogs = useItemHistory(itemSerialNumbers, withdrawalLogs);

  // UI State
  const [activeTab, setActiveTab] = useState('serials');
  const [showAddSNModal, setShowAddSNModal] = useState(false);
  const [showAddBulkSNModal, setShowAddBulkSNModal] = useState(false);
  const [showEditSNModal, setShowEditSNModal] = useState(false);
  const [editSN, setEditSN] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnSN, setReturnSN] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historySN, setHistorySN] = useState(null);

  // Form States
  const [addSNForm, setAddSNForm] = useState(INITIAL_SN_FORM);
  const [bulkForm, setBulkForm] = useState(INITIAL_BULK_FORM);
  const [returnForm, setReturnForm] = useState(INITIAL_RETURN_FORM);

  // Cascading Dropdowns for Add SN form
  const addDropdowns = useCascadingDropdowns(
    addSNForm,
    departments,
    floors,
    setAddSNForm
  );

  // Cascading Dropdowns for Bulk form
  const bulkDropdowns = useCascadingDropdowns(
    bulkForm,
    departments,
    floors,
    setBulkForm
  );

  // Cascading Dropdowns for Edit form
  const editDropdowns = useCascadingDropdowns(
    editSN || { building: '', floor: '' },
    departments,
    floors,
    setEditSN
  );

  // Handle input changes
  const handleAddSNChange = (e) => {
    if (!e.target) return;
    const { name, value } = e.target;
    setAddSNForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBulkChange = (e) => {
    const { name, value } = e.target;
    setBulkForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSNChange = (e) => {
    if (!e.target) return;
    const { name, value } = e.target;
    setEditSN(prev => ({ ...prev, [name]: value }));
  };

  const handleReturnChange = (e) => {
    const { name, value } = e.target;
    setReturnForm(prev => ({ ...prev, [name]: value }));
  };

  // Submit Handlers
  const handleAddSNSubmit = async (e) => {
    e.preventDefault();
    if (!addSNForm.serial_number) {
      operationToast.validationError('กรุณากรอกหมายเลขเครื่อง');
      return;
    }

    try {
      await addSerialNumber(createSNFormData(addSNForm, itemId));
      setAddSNForm(INITIAL_SN_FORM);
      setShowAddSNModal(false);
      operationToast.created('หมายเลขเครื่อง');
    } catch (error) {
      console.error('Error adding serial number:', error);
      operationToast.createError('หมายเลขเครื่อง', error?.message);
    }
  };

  const handleAddBulkSNSubmit = async (e) => {
    e.preventDefault();
    const snList = bulkForm.serial_numbers
      .split('\n')
      .map(sn => sn.trim())
      .filter(sn => sn.length > 0);

    if (snList.length === 0) {
      operationToast.validationError('กรุณากรอกหมายเลขเครื่องอย่างน้อย 1 รายการ');
      return;
    }

    try {
      const snArray = createBulkSNArray(bulkForm, itemId);
      for (const snData of snArray) {
        await addSerialNumber(snData);
      }
      setBulkForm(INITIAL_BULK_FORM);
      setShowAddBulkSNModal(false);
      operationToast.created(`${snList.length} หมายเลขเครื่อง`);
    } catch (error) {
      console.error('Error adding serial numbers:', error);
      operationToast.createError('หมายเลขเครื่อง', error?.message);
    }
  };

  const handleEditSNSubmit = async (e) => {
    e.preventDefault();
    if (!editSN) return;

    if (!editSN.serial_number) {
      operationToast.validationError('กรุณากรอกหมายเลขเครื่อง');
      return;
    }

    try {
      await updateSerialNumber(editSN.id, createSNFormData(editSN, itemId));
      setShowEditSNModal(false);
      setEditSN(null);
      operationToast.updated('หมายเลขเครื่อง');
    } catch (error) {
      console.error('Error updating serial number:', error);
      operationToast.updateError('หมายเลขเครื่อง', error?.message);
    }
  };

  const handleDeleteSN = async (id) => {
    const confirmed = await confirm({
      title: 'ยืนยันการลบ?',
      text: 'คุณต้องการลบหมายเลขเครื่องนี้หรือไม่?',
    });
    if (!confirmed) return;

    try {
      const result = await deleteSerialNumber(id);
      if (result.success) {
        operationToast.deleted('หมายเลขเครื่อง');
      } else {
        // Check for foreign key constraint error
        const errorMsg = result.error?.message || '';
        if (errorMsg.includes('foreign key') || errorMsg.includes('violates foreign key') || errorMsg.includes('23503')) {
          operationToast.error('ไม่สามารถลบได้', 'หมายเลขเครื่องนี้มีประวัติการเบิก-คืนอยู่ โปรดลบประวัติในตาราง withdrawal_logs ก่อน หรือตั้งค่า CASCADE DELETE ในฐานข้อมูล');
        } else {
          operationToast.deleteError('หมายเลขเครื่อง', errorMsg);
        }
      }
    } catch (error) {
      console.error('Error deleting serial number:', error);
      const errorMsg = error?.message || '';
      if (errorMsg.includes('foreign key') || errorMsg.includes('violates foreign key') || errorMsg.includes('23503')) {
        operationToast.error('ไม่สามารถลบได้', 'หมายเลขเครื่องนี้มีประวัติการเบิก-คืนอยู่ โปรดลบประวัติในตาราง withdrawal_logs ก่อน หรือตั้งค่า CASCADE DELETE ในฐานข้อมูล');
      } else {
        operationToast.deleteError('หมายเลขเครื่อง', errorMsg);
      }
    }
  };

  // Return modal handlers
  const handleOpenReturnModal = (sn) => {
    setReturnSN(sn);
    setReturnForm({
      ...INITIAL_RETURN_FORM,
      job_number: sn.job_number || '',
      dept_used: sn.dept_used || '',
      building: sn.building || '',
      floor: sn.floor || '',
    });
    setShowReturnModal(true);
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    if (!returnSN) return;

    if (!returnForm.receiver_name || !returnForm.return_condition) {
      operationToast.validationError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      await onReturn(returnSN.id, createReturnFormData(returnForm, returnSN));
      setShowReturnModal(false);
      setReturnSN(null);
      setReturnForm(INITIAL_RETURN_FORM);
      operationToast.returned();
    } catch (error) {
      console.error('Error returning:', error);
      operationToast.returnError(error?.message);
    }
  };

  // History modal handler
  const handleOpenHistoryModal = (sn) => {
    setHistorySN(sn);
    setShowHistoryModal(true);
  };

  // History logs for the selected SN (for HistoryModal)
  const historySNLogs = useSNHistory(historySN?.id, withdrawalLogs);

  // Stats
  const stats = [
    { label: 'ทั้งหมด', value: itemSerialNumbers.length, icon: 'bi-boxes', variant: 'primary' },
    { label: 'พร้อมใช้งาน', value: itemSerialNumbers.filter(sn => sn.status === 'Available').length, icon: 'bi-check-circle-fill', variant: 'success' },
    { label: 'เบิกออกแล้ว', value: itemSerialNumbers.filter(sn => sn.status === 'Withdrawn').length, icon: 'bi-box-arrow-right', variant: 'warning' },
    { label: 'อยู่ระหว่างซ่อม', value: itemSerialNumbers.filter(sn => sn.status === 'Repair').length, icon: 'bi-tools', variant: 'danger' },
  ];

  if (!item) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <p className="text-muted">กำลังโหลดข้อมูล...</p>
        </Card.Body>
      </Card>
    );
  }

  // Tab 1: Serial Numbers Table
  const serialColumns = [
    { key: 'index', header: '#', width: '40px', minWidth: '40px', render: (_, index) => String(index + 1).padStart(2, '0'), className: 'text-muted fw-bold text-center col-priority-low', hideInCard: true },
    { key: 'serial_number', header: 'หมายเลขเครื่อง', width: '130px', minWidth: '110px', render: (sn) => <span className="text-truncate fw-medium" title={sn.serial_number}>{sn.serial_number}</span>, cardLabel: 'หมายเลขเครื่อง', className: 'col-priority-high' },
    { key: 'brand', header: 'ยี่ห้อ', width: '80px', minWidth: '70px', render: (sn) => <span className="text-truncate" title={sn.brand || ''}>{sn.brand || '-'}</span>, cardLabel: 'ยี่ห้อ', className: 'col-priority-medium' },
    { key: 'status', header: 'สถานะ', width: '90px', minWidth: '80px', className: 'text-center col-priority-high', render: (sn) => <Badge variant={getSNStatusBadgeClass(sn.status).replace('badge-', '')}>{getSNStatusText(sn.status)}</Badge>, cardLabel: 'สถานะ' },
    { key: 'job_number', header: 'เลข Job', width: '100px', minWidth: '90px', render: (sn) => <span className="text-truncate" title={sn.job_number || ''}>{sn.job_number || '-'}</span>, cardLabel: 'เลข Job', className: 'col-priority-medium' },
    { key: 'withdrawer_name', header: 'ผู้เบิก', width: '100px', minWidth: '90px', render: (sn) => <span className="text-truncate" title={sn.withdrawer_name || ''}>{sn.withdrawer_name || '-'}</span>, cardLabel: 'ผู้เบิก', className: 'col-priority-medium' },
    { key: 'dept_used', header: 'แผนก', width: '100px', minWidth: '90px', render: (sn) => <span className="text-truncate" title={sn.dept_used || ''}>{sn.dept_used || '-'}</span>, cardLabel: 'แผนก', className: 'col-priority-low' },
    { key: 'building_floor', header: 'อาคาร/ชั้น', width: '100px', minWidth: '90px', render: (sn) => <span className="text-truncate" title={sn.building + (sn.floor ? ' (ชั้น ' + sn.floor + ')' : '')}>{sn.building || '-'} {sn.floor && <span className="text-muted"> (ชั้น {sn.floor})</span>}</span>, cardLabel: 'อาคาร/ชั้น', className: 'col-priority-low' },
    { key: 'receive_date', header: 'วันที่รับ', width: '90px', minWidth: '80px', render: (sn) => <span className="text-muted small">{sn.receive_date ? new Date(sn.receive_date).toLocaleDateString() : '-'}</span>, className: 'text-center col-priority-low', cardLabel: 'วันที่รับ' },
    { key: 'withdraw_date', header: 'วันที่เบิก', width: '90px', minWidth: '80px', render: (sn) => <span className="text-muted small">{sn.withdraw_date ? new Date(sn.withdraw_date).toLocaleDateString() : '-'}</span>, className: 'text-center col-priority-low', cardLabel: 'วันที่เบิก' },
    {
      key: 'actions',
      header: 'การจัดการ',
      width: '90px',
      minWidth: '90px',
      className: 'text-center col-priority-high',
      render: (sn) => (
        <div className="d-flex justify-content-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditSN({
                id: sn.id,
                serial_number: sn.serial_number,
                brand: sn.brand || '',
                status: sn.status,
                job_number: sn.job_number || '',
                withdrawer_name: sn.withdrawer_name || '',
                dept_used: sn.dept_used || '',
                building: sn.building || '',
                floor: sn.floor || '',
                receive_date: sn.receive_date || '',
                withdraw_date: sn.withdraw_date || '',
              });
              setShowEditSNModal(true);
            }}
            title="แก้ไข"
            aria-label={`แก้ไข ${sn.serial_number}`}
          >
            <i className="bi bi-pencil-fill" />
          </Button>
          {sn.status === 'Withdrawn' && (
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => handleOpenReturnModal(sn)}
              title="รับคืนอุปกรณ์"
            >
              <i className="bi bi-box-arrow-left" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenHistoryModal(sn)}
            title="ดูประวัติ"
          >
            <i className="bi bi-clock-history" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteSN(sn.id)}
            title="ลบ"
          >
            <i className="bi bi-trash3-fill" />
          </Button>
        </div>
      )
    },
  ];

  // Tab 2: History Table
  const historyColumns = [
    { key: 'index', header: '#', width: '40px', minWidth: '40px', render: (_, index) => String(index + 1).padStart(2, '0'), className: 'text-muted fw-bold text-center col-priority-low', hideInCard: true },
    { key: 'serial_number', header: 'หมายเลขเครื่อง', width: '130px', minWidth: '110px', render: (log) => {
      const sn = itemSerialNumbers.find(s => s.id === log.serial_number_id);
      return <span className="fw-medium">{sn?.serial_number || '-'}</span>;
    }, cardLabel: 'หมายเลขเครื่อง', className: 'col-priority-high' },
    { key: 'action', header: 'การกระทำ', width: '90px', minWidth: '80px', className: 'text-center col-priority-high', render: (log) => <Badge variant={getWithdrawalActionBadgeClass(log.action).replace('badge-', '')}>{getWithdrawalActionText(log.action)}</Badge>, cardLabel: 'การกระทำ' },
    { key: 'job_number', header: 'เลข Job', width: '100px', minWidth: '90px', render: (log) => log.job_number || '-', cardLabel: 'เลข Job', className: 'col-priority-medium' },
    { key: 'person', header: 'ผู้เบิก / ผู้คืน', width: '100px', minWidth: '90px', render: (log) => log.action === 'withdraw' ? log.withdrawer_name : log.receiver_name, cardLabel: 'ผู้เกี่ยวข้อง', className: 'col-priority-medium' },
    { key: 'dept_used', header: 'แผนก', width: '100px', minWidth: '90px', render: (log) => log.dept_used || '-', cardLabel: 'แผนก', className: 'col-priority-low' },
    { key: 'building_floor', header: 'อาคาร/ชั้น', width: '100px', minWidth: '90px', render: (log) => `${log.building || '-'} ${log.floor ? ' (ชั้น ' + log.floor + ')' : ''}`, cardLabel: 'อาคาร/ชั้น', className: 'col-priority-low' },
    { key: 'condition', header: 'สภาพ', width: '80px', minWidth: '70px', render: (log) => log.condition || '-', cardLabel: 'สภาพ', className: 'col-priority-low' },
    { key: 'note', header: 'หมายเหตุ', width: '150px', minWidth: '120px', render: (log) => <span className="history-note-cell text-truncate" title={log.note || ''}>{log.note || '-'}</span>, cardLabel: 'หมายเหตุ', className: 'col-priority-low' },
    { key: 'performed_by', header: 'ผู้บันทึก', width: '90px', minWidth: '80px', render: (log) => log.performed_by || '-', cardLabel: 'ผู้บันทึก', className: 'col-priority-low' },
    { key: 'performed_at', header: 'วันที่/เวลา', width: '140px', minWidth: '130px', render: (log) => <span className="text-muted small">{log.performed_at ? new Date(log.performed_at).toLocaleString() : '-'}</span>, className: 'text-center col-priority-low', cardLabel: 'วันที่/เวลา' },
  ];

  return (
    <div className="details-page">
      {/* Page Header */}
      <PageHeader
        title={`รายละเอียดอุปกรณ์: ${item.item_name}`}
        subtitle={`รหัสรายการ: ${item.id}`}
        actions={
          <div className="d-flex gap-2 flex-wrap align-items-center">
            <MobileMenuToggle />
            <Button
              variant="primary"
              size="sm"
              leftIcon={<i className="bi bi-plus-lg" />}
              onClick={() => setShowAddSNModal(true)}
            >
              เพิ่มหมายเลขเครื่อง
            </Button>
            <Button
              variant="outline-success"
              size="sm"
              leftIcon={<i className="bi bi-plus-square" />}
              onClick={() => setShowAddBulkSNModal(true)}
            >
              เพิ่มหลายรายการ
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              leftIcon={<i className="bi bi-arrow-left" />}
              onClick={() => navigate('/inventory')}
            >
              กลับไปรายการ
            </Button>
          </div>
        }
      />

      {/* General Info Card */}
      <Card variant="outlined" className="details-info-card mb-4">
        <Card.Body className="py-3">
          <div className="d-flex flex-wrap gap-4 align-items-center">
            <span className="card-label">ข้อมูลทั่วไป</span>
            <div className="info-item">
              <span><strong>ชื่อรายการ:</strong> {item.item_name}</span>
              <span><strong>จำนวนรวม:</strong> {item.total_qty} {item.unit}</span>
              <span><strong>ผู้รับผิดชอบ:</strong> {item.responsible || '-'}</span>
              <span><strong>วันที่ลงระบบ:</strong> {item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</span>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Tabs */}
      <Card variant="outlined">
        <Tabs
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="line"
          fullWidth
          tabs={[
            { id: 'serials', label: <><i className="bi bi-list-ul me-1" /> หมายเลขเครื่อง ({itemSerialNumbers.length})</> },
            { id: 'history', label: <><i className="bi bi-clock-history me-1" /> ประวัติเบิก-คืน ({itemHistoryLogs.length})</> },
            { id: 'stats', label: <><i className="bi bi-graph-up me-1" /> สถิติ</> },
          ]}
        />

        {/* Tab Panel: Serial Numbers */}
        <div className="details-tab-panel" role="tabpanel" hidden={activeTab !== 'serials'}>
          <Card.Body padding="none" className="p-0">
            <Table
              columns={serialColumns}
              data={itemSerialNumbers}
              emptyState={
                <div className="text-center text-muted py-4">
                  ยังไม่มีหมายเลขเครื่องสำหรับรายการนี้
                </div>
              }
              striped
              hoverable
              responsive
              cardLayout
              minWidth={1000}
            />
          </Card.Body>
        </div>

        {/* Tab Panel: History */}
        <div className="details-tab-panel" role="tabpanel" hidden={activeTab !== 'history'}>
          <Card.Body padding="none" className="p-0">
            <Table
              columns={historyColumns}
              data={itemHistoryLogs}
              emptyState={
                <div className="text-center text-muted py-4">
                  ยังไม่มีประวัติการเบิก-คืน
                </div>
              }
              striped
              hoverable
              responsive
              cardLayout
              minWidth={1100}
            />
          </Card.Body>
        </div>

        {/* Tab Panel: Stats */}
        <div className="details-tab-panel" role="tabpanel" hidden={activeTab !== 'stats'}>
          <Card.Body>
            <div className="details-stats-grid">
              {stats.map((stat, index) => (
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
          </Card.Body>
        </div>
      </Card>

      {/* Modals */}
      <AddSNModal
        isOpen={showAddSNModal}
        onClose={() => setShowAddSNModal(false)}
        onSubmit={handleAddSNSubmit}
        formData={addSNForm}
        onChange={handleAddSNChange}
        filteredFloors={addDropdowns.filteredFloors}
        filteredDepartments={addDropdowns.filteredDepartments}
        departments={departments}
        buildings={buildings}
        floors={floors}
      />

      <BulkAddSNModal
        isOpen={showAddBulkSNModal}
        onClose={() => setShowAddBulkSNModal(false)}
        onSubmit={handleAddBulkSNSubmit}
        formData={bulkForm}
        onChange={handleBulkChange}
        filteredFloors={bulkDropdowns.filteredFloors}
        filteredDepartments={bulkDropdowns.filteredDepartments}
        buildings={buildings}
      />

      <EditSNModal
        isOpen={showEditSNModal}
        onClose={() => {
          setShowEditSNModal(false);
          setEditSN(null);
        }}
        onSubmit={handleEditSNSubmit}
        formData={editSN}
        onChange={handleEditSNChange}
        filteredFloors={editDropdowns.filteredFloors}
        filteredDepartments={editDropdowns.filteredDepartments}
        buildings={buildings}
      />

      <ReturnModal
        isOpen={showReturnModal}
        onClose={() => {
          setShowReturnModal(false);
          setReturnSN(null);
          setReturnForm(INITIAL_RETURN_FORM);
        }}
        onSubmit={handleReturnSubmit}
        formData={returnForm}
        onChange={handleReturnChange}
        sn={returnSN}
      />

      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false);
          setHistorySN(null);
        }}
        sn={historySN}
        historyLogs={historySNLogs}
      />
    </div>
  );
};

export default Details;
