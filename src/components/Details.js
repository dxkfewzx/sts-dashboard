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

const Details = () => {
  const { isMobile, isSidebarOpen, toggleSidebar } = useSidebar();

  const MobileMenuToggle = () => {
    if (!isMobile) return null;
    return (
      <button
        className="btn btn-ghost btn-icon mobile-menu-toggle"
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
        aria-expanded={isSidebarOpen}
      >
        <i className={isSidebarOpen ? 'bi bi-x-lg' : 'bi bi-list'} style={{ fontSize: '1.25rem' }}></i>
      </button>
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
    { label: 'ทั้งหมด', value: itemSerialNumbers.length, icon: 'bi-boxes', iconColor: 'primary', iconBg: 'primary-light' },
    { label: 'พร้อมใช้งาน', value: itemSerialNumbers.filter(sn => sn.status === 'Available').length, icon: 'bi-check-circle-fill', iconColor: 'success', iconBg: 'success-light' },
    { label: 'เบิกออกแล้ว', value: itemSerialNumbers.filter(sn => sn.status === 'Withdrawn').length, icon: 'bi-box-arrow-right', iconColor: 'warning', iconBg: 'warning-light' },
    { label: 'อยู่ระหว่างซ่อม', value: itemSerialNumbers.filter(sn => sn.status === 'Repair').length, icon: 'bi-tools', iconColor: 'danger', iconBg: 'danger-light' },
  ];

  if (!item) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <p className="text-muted">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="header-title">
          <h4>รายละเอียดอุปกรณ์: {item.item_name}</h4>
          <p>รหัสรายการ: {item.id}</p>
        </div>
        <div className="d-flex gap-2 flex-wrap align-items-center">
          <MobileMenuToggle />
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddSNModal(true)}
          >
            <i className="bi bi-plus-lg"></i> เพิ่มหมายเลขเครื่อง
          </button>
          <button
            className="btn btn-outline-success btn-sm"
            onClick={() => setShowAddBulkSNModal(true)}
          >
            <i className="bi bi-plus-square"></i> เพิ่มหลายรายการ
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate('/inventory')}
          >
            <i className="bi bi-arrow-left"></i> กลับไปรายการ
          </button>
        </div>
      </div>

      {/* General Info Card */}
      <div className="card mb-4">
        <div className="card-body py-3">
          <div className="d-flex flex-wrap gap-4 align-items-center">
            <span className="fw-bold text-primary small">ข้อมูลทั่วไป</span>
            <div className="d-flex flex-wrap gap-4 text-sm">
              <span><strong>ชื่อรายการ:</strong> {item.item_name}</span>
              <span><strong>จำนวนรวม:</strong> {item.total_qty} {item.unit}</span>
              <span><strong>ผู้รับผิดชอบ:</strong> {item.responsible || '-'}</span>
              <span><strong>วันที่ลงระบบ:</strong> {item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="tabs">
          <div className="tabs-list" role="tablist">
            <button
              role="tab"
              className={`tab-trigger ${activeTab === 'serials' ? 'active' : ''}`}
              onClick={() => setActiveTab('serials')}
              aria-selected={activeTab === 'serials'}
            >
              <i className="bi bi-list-ul me-1"></i> หมายเลขเครื่อง ({itemSerialNumbers.length})
            </button>
            <button
              role="tab"
              className={`tab-trigger ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
              aria-selected={activeTab === 'history'}
            >
              <i className="bi bi-clock-history me-1"></i> ประวัติเบิก-คืน ({itemHistoryLogs.length})
            </button>
            <button
              role="tab"
              className={`tab-trigger ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
              aria-selected={activeTab === 'stats'}
            >
              <i className="bi bi-graph-up me-1"></i> สถิติ
            </button>
          </div>
        </div>

        <div className="card-body p-0">
          {/* Tab Panel: Serial Numbers */}
          <div className="tab-panel" role="tabpanel" hidden={activeTab !== 'serials'} style={{ display: activeTab === 'serials' ? 'block' : 'none' }}>
            <div className="table-responsive" style={{ overflowX: 'auto', maxWidth: '100%' }}>
              <table className="table table-striped mb-0" style={{ minWidth: '1000px', whiteSpace: 'nowrap' }}>
                <thead>
                  <tr>
                    <th style={{ width: '40px', minWidth: '40px' }}>#</th>
                    <th style={{ width: '130px', minWidth: '110px' }}>หมายเลขเครื่อง</th>
                    <th style={{ width: '80px', minWidth: '70px' }}>ยี่ห้อ</th>
                    <th style={{ width: '90px', minWidth: '80px' }}>สถานะ</th>
                    <th style={{ width: '100px', minWidth: '90px' }}>เลข Job</th>
                    <th style={{ width: '100px', minWidth: '90px' }}>ผู้เบิก</th>
                    <th style={{ width: '100px', minWidth: '90px' }}>แผนก</th>
                    <th style={{ width: '100px', minWidth: '90px' }}>อาคาร/ชั้น</th>
                    <th style={{ width: '90px', minWidth: '80px' }}>วันที่รับ</th>
                    <th style={{ width: '90px', minWidth: '80px' }}>วันที่เบิก</th>
                    <th style={{ width: '90px', minWidth: '90px' }}>การจัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {itemSerialNumbers.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="text-center text-muted py-4">
                        ยังไม่มีหมายเลขเครื่องสำหรับรายการนี้
                      </td>
                    </tr>
                  ) : (
                    itemSerialNumbers.map((sn, index) => (
                      <tr key={sn.id}>
                        <td className="text-muted fw-bold">{String(index + 1).padStart(2, '0')}</td>
                        <td className="text-truncate fw-medium" title={sn.serial_number}>{sn.serial_number}</td>
                        <td className="text-truncate" title={sn.brand || ''}>{sn.brand || '-'}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={getSNStatusBadgeClass(sn.status)}>
                            {getSNStatusText(sn.status)}
                          </span>
                        </td>
                        <td className="text-truncate" title={sn.job_number || ''}>{sn.job_number || '-'}</td>
                        <td className="text-truncate" title={sn.withdrawer_name || ''}>{sn.withdrawer_name || '-'}</td>
                        <td className="text-truncate" title={sn.dept_used || ''}>{sn.dept_used || '-'}</td>
                        <td className="text-truncate" title={sn.building + (sn.floor ? ' (ชั้น ' + sn.floor + ')' : '')}>
                          {sn.building || '-'} {sn.floor && <span className="text-muted"> (ชั้น {sn.floor})</span>}
                        </td>
                        <td className="text-muted small">{sn.receive_date ? new Date(sn.receive_date).toLocaleDateString() : '-'}</td>
                        <td className="text-muted small">{sn.withdraw_date ? new Date(sn.withdraw_date).toLocaleDateString() : '-'}</td>
                        <td>
                          <div className="d-flex justify-content-center gap-1">
                            <button
                              className="btn-action btn-edit"
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
                            >
                              <i className="bi bi-pencil-fill"></i>
                            </button>
                            {sn.status === 'Withdrawn' && (
                              <button
                                className="btn-action btn-return"
                                onClick={() => handleOpenReturnModal(sn)}
                                title="รับคืนอุปกรณ์"
                              >
                                <i className="bi bi-box-arrow-left"></i>
                              </button>
                            )}
                            <button
                              className="btn-action btn-history"
                              onClick={() => handleOpenHistoryModal(sn)}
                              title="ดูประวัติ"
                            >
                              <i className="bi bi-clock-history"></i>
                            </button>
                            <button
                              className="btn-action btn-del"
                              onClick={() => handleDeleteSN(sn.id)}
                              title="ลบ"
                            >
                              <i className="bi bi-trash3-fill"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tab Panel: History */}
          <div className="tab-panel" role="tabpanel" hidden={activeTab !== 'history'} style={{ display: activeTab === 'history' ? 'block' : 'none' }}>
            <div className="table-responsive" style={{ overflowX: 'auto', maxWidth: '100%' }}>
              <table className="table table-striped mb-0" style={{ minWidth: '1100px', whiteSpace: 'nowrap' }}>
                <thead>
                  <tr>
                    <th style={{ width: '40px', minWidth: '40px' }}>#</th>
                    <th style={{ width: '130px', minWidth: '110px' }}>หมายเลขเครื่อง</th>
                    <th style={{ width: '90px', minWidth: '80px' }}>การกระทำ</th>
                    <th style={{ width: '100px', minWidth: '90px' }}>เลข Job</th>
                    <th style={{ width: '100px', minWidth: '90px' }}>ผู้เบิก / ผู้คืน</th>
                    <th style={{ width: '100px', minWidth: '90px' }}>แผนก</th>
                    <th style={{ width: '100px', minWidth: '90px' }}>อาคาร/ชั้น</th>
                    <th style={{ width: '80px', minWidth: '70px' }}>สภาพ</th>
                    <th style={{ width: '150px', minWidth: '120px' }}>หมายเหตุ</th>
                    <th style={{ width: '90px', minWidth: '80px' }}>ผู้บันทึก</th>
                    <th style={{ width: '140px', minWidth: '130px' }}>วันที่/เวลา</th>
                  </tr>
                </thead>
                <tbody>
                  {itemHistoryLogs.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="text-center text-muted py-4">
                        ยังไม่มีประวัติการเบิก-คืน
                      </td>
                    </tr>
                  ) : (
                    itemHistoryLogs.map((log, index) => {
                      const sn = itemSerialNumbers.find(s => s.id === log.serial_number_id);
                      return (
                        <tr key={log.id}>
                          <td className="text-muted fw-bold">{index + 1}</td>
                          <td className="fw-medium">{sn?.serial_number || '-'}</td>
                          <td style={{ textAlign: 'center' }}>
                            <span className={'badge ' + getWithdrawalActionBadgeClass(log.action)}>
                              {getWithdrawalActionText(log.action)}
                            </span>
                          </td>
                          <td>{log.job_number || '-'}</td>
                          <td>{log.action === 'withdraw' ? log.withdrawer_name : log.receiver_name}</td>
                          <td>{log.dept_used || '-'}</td>
                          <td>{log.building || '-'} {log.floor ? ' (ชั้น ' + log.floor + ')' : ''}</td>
                          <td>{log.condition || '-'}</td>
                          <td className="text-truncate" title={log.note || ''} style={{ maxWidth: '200px' }}>{log.note || '-'}</td>
                          <td>{log.performed_by || '-'}</td>
                          <td className="text-muted small">{log.performed_at ? new Date(log.performed_at).toLocaleString() : '-'}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tab Panel: Stats */}
          <div className="tab-panel" role="tabpanel" hidden={activeTab !== 'stats'} style={{ display: activeTab === 'stats' ? 'block' : 'none' }}>
            <div className="card-body">
              <div className="row g-3">
                {stats.map((stat, index) => (
                  <div key={index} className="col-6 col-md-3">
                    <div className="stat-card">
                      <div className={'stat-card-icon bg-' + stat.iconBg + ' text-' + stat.iconColor}>
                        <i className={'bi ' + stat.icon}></i>
                      </div>
                      <div className={'stat-card-value text-' + stat.iconColor}>{stat.value}</div>
                      <div className="stat-card-label">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddSNModal
        show={showAddSNModal}
        onHide={() => setShowAddSNModal(false)}
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
        show={showAddBulkSNModal}
        onHide={() => setShowAddBulkSNModal(false)}
        onSubmit={handleAddBulkSNSubmit}
        formData={bulkForm}
        onChange={handleBulkChange}
        filteredFloors={bulkDropdowns.filteredFloors}
        filteredDepartments={bulkDropdowns.filteredDepartments}
        buildings={buildings}
      />

      <EditSNModal
        show={showEditSNModal}
        onHide={() => {
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
        show={showReturnModal}
        onHide={() => {
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
        show={showHistoryModal}
        onHide={() => {
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