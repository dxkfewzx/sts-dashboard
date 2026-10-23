import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Details = ({ items, serialNumbers, withdrawalLogs, onAddItem, onUpdateItem, onDeleteItem, onAddSerialNumber, onUpdateSerialNumber, onDeleteSerialNumber, onWithdraw, onReturn, departments, buildings, floors }) => {
  const { id } = useParams();
  const itemId = parseInt(id);
  const [item, setItem] = useState(null);
  const [itemSerialNumbers, setItemSerialNumbers] = useState([]);
  const [activeTab, setActiveTab] = useState('serials'); // 'serials' | 'history' | 'stats'
  const [showAddSNModal, setShowAddSNModal] = useState(false);
  const [showAddBulkSNModal, setShowAddBulkSNModal] = useState(false);
  const [showEditSNModal, setShowEditSNModal] = useState(false);
  const [editSN, setEditSN] = useState(null);
  const [bulkForm, setBulkForm] = useState({
    serial_numbers: '',
    brand: '',
    status: 'Available',
    job_number: '',
    withdrawer_name: '',
    dept_used: '',
    building: '',
    floor: '',
    receive_date: '',
    withdraw_date: ''
  });

  // State for Return modal
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnSN, setReturnSN] = useState(null);
  const [returnForm, setReturnForm] = useState({
    receiver_name: '',
    return_condition: 'good',
    return_note: ''
  });

  // State for History modal (for single SN)
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historySN, setHistorySN] = useState(null);

  // Form state for adding SN
  const [addSNForm, setAddSNForm] = useState({
    serial_number: '',
    brand: '',
    status: 'Available',
    job_number: '',
    withdrawer_name: '',
    dept_used: '',
    building: '',
    floor: '',
    receive_date: '',
    withdraw_date: ''
  });

  // State for cascading dropdowns in add SN form
  const [filteredFloorsAdd, setFilteredFloorsAdd] = useState([]);
  const [filteredDepartmentsAdd, setFilteredDepartmentsAdd] = useState([]);

  // State for cascading dropdowns in edit SN form
  const [filteredFloorsEdit, setFilteredFloorsEdit] = useState([]);
  const [filteredDepartmentsEdit, setFilteredDepartmentsEdit] = useState([]);

  // State for cascading dropdowns
  const [filteredFloors, setFilteredFloors] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  // Handle input changes for add SN form
  const handleAddSNChange = (e) => {
    if (!e.target) return;
    const { name, value } = e.target;
    setAddSNForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle input changes for edit SN form
  const handleEditSNChange = (e) => {
    if (!e.target) return;
    const { name, value } = e.target;
    setEditSN(prev => ({ ...prev, [name]: value }));
  };

  // Fetch item and its serial numbers
  useEffect(() => {
    const fetchData = async () => {
      // Find item
      const foundItem = items.find(item => item.id === itemId);
      setItem(foundItem || null);

      // Find serial numbers for this item and sort by ID ascending (low to high)
      const snForItem = serialNumbers
        .filter(sn => sn.item_id === itemId)
        .sort((a, b) => a.id - b.id);
      setItemSerialNumbers(snForItem);
    };

    fetchData();
  }, [items, serialNumbers, itemId]);

  // Debug: log onReturn prop
  useEffect(() => {
    console.log('Details component onReturn prop:', typeof onReturn, onReturn);
  }, [onReturn]);

  // Handle cascading dropdowns for add SN form - filter floors based on selected building
  useEffect(() => {
    if (!departments || departments.length === 0) {
      setFilteredFloorsAdd(floors);
      return;
    }

    const selectedBuilding = addSNForm.building;
    if (!selectedBuilding) {
      // No building selected, show all floors
      setFilteredFloorsAdd(floors);
      return;
    }

    // Filter floors that have departments in this building (from departments table)
    const buildingFloors = [...new Set(
      departments
        .filter(d => d.building_name === selectedBuilding && d.floor_name)
        .map(d => d.floor_name)
    )].map((floor_name, index) => ({ id: index + 1, floor_name, building_name: selectedBuilding }));

    setFilteredFloorsAdd(buildingFloors.length > 0 ? buildingFloors : floors);

    // Reset floor selection when building changes
    setAddSNForm(prev => ({ ...prev, floor: '' }));
  }, [departments, floors, addSNForm.building]);

  // Handle cascading dropdowns for add SN form - filter departments based on selected floor (and building)
  useEffect(() => {
    if (!departments || departments.length === 0) {
      setFilteredDepartmentsAdd([]);
      return;
    }

    const selectedFloor = addSNForm.floor;
    const selectedBuilding = addSNForm.building;

    if (!selectedFloor && !selectedBuilding) {
      // Neither floor nor building selected, show all departments
      setFilteredDepartmentsAdd(departments);
      return;
    }

    // Filter departments based on building and floor from departments table
    let filteredDepts = departments;

    if (selectedBuilding) {
      filteredDepts = filteredDepts.filter(d => d.building_name === selectedBuilding);
    }

    if (selectedFloor) {
      filteredDepts = filteredDepts.filter(d => d.floor_name === selectedFloor);
    }

    setFilteredDepartmentsAdd(filteredDepts.length > 0 ? filteredDepts : departments);
  }, [departments, addSNForm.floor, addSNForm.building]);

  // Reset department selection when floor changes for add SN form
  useEffect(() => {
    setAddSNForm(prev => ({ ...prev, dept_used: '' }));
  }, [addSNForm.floor]);

  // Handle cascading dropdowns - filter floors based on selected building
  useEffect(() => {
    if (!departments || departments.length === 0) {
      setFilteredFloors(floors);
      return;
    }

    const selectedBuilding = bulkForm.building;
    if (!selectedBuilding) {
      // No building selected, show all floors
      setFilteredFloors(floors);
      return;
    }

    // Filter floors that have departments in this building (from departments table)
    const buildingFloors = [...new Set(
      departments
        .filter(d => d.building_name === selectedBuilding && d.floor_name)
        .map(d => d.floor_name)
    )].map((floor_name, index) => ({ id: index + 1, floor_name, building_name: selectedBuilding }));

    setFilteredFloors(buildingFloors.length > 0 ? buildingFloors : floors);

    // Reset floor selection when building changes
    setBulkForm(prev => ({ ...prev, floor: '' }));
  }, [departments, floors, bulkForm.building]);

  // Handle cascading dropdowns - filter departments based on selected floor (and building)
  useEffect(() => {
    if (!departments || departments.length === 0) {
      setFilteredDepartments([]);
      return;
    }

    const selectedFloor = bulkForm.floor;
    const selectedBuilding = bulkForm.building;

    if (!selectedFloor && !selectedBuilding) {
      // Neither floor nor building selected, show all departments
      setFilteredDepartments(departments);
      return;
    }

    // Filter departments based on building and floor from departments table
    let filteredDepts = departments;

    if (selectedBuilding) {
      filteredDepts = filteredDepts.filter(d => d.building_name === selectedBuilding);
    }

    if (selectedFloor) {
      filteredDepts = filteredDepts.filter(d => d.floor_name === selectedFloor);
    }

    setFilteredDepartments(filteredDepts.length > 0 ? filteredDepts : departments);
  }, [departments, bulkForm.floor, bulkForm.building]);

  // Reset department selection when floor changes
  useEffect(() => {
    setBulkForm(prev => ({ ...prev, dept_used: '' }));
  }, [bulkForm.floor]);

  // Handle cascading dropdowns for edit SN form - filter floors based on selected building
  useEffect(() => {
    if (!departments || departments.length === 0) {
      setFilteredFloorsEdit(floors);
      return;
    }

    const selectedBuilding = editSN?.building || '';
    if (!selectedBuilding) {
      // No building selected, show all floors
      setFilteredFloorsEdit(floors);
      return;
    }

    // Filter floors that have departments in this building (from departments table)
    const buildingFloors = [...new Set(
      departments
        .filter(d => d.building_name === selectedBuilding && d.floor_name)
        .map(d => d.floor_name)
    )].map((floor_name, index) => ({ id: index + 1, floor_name, building_name: selectedBuilding }));

    setFilteredFloorsEdit(buildingFloors.length > 0 ? buildingFloors : floors);

    // Reset floor selection only when building actually changes (not on initial load)
    // We track previous building via a ref to avoid resetting floor on initial edit modal open
  }, [departments, floors, editSN?.building]);

  // Handle cascading dropdowns for edit SN form - filter departments based on selected floor (and building)
  useEffect(() => {
    if (!departments || departments.length === 0) {
      setFilteredDepartmentsEdit([]);
      return;
    }

    const selectedFloor = editSN?.floor || '';
    const selectedBuilding = editSN?.building || '';

    if (!selectedFloor && !selectedBuilding) {
      // Neither floor nor building selected, show all departments
      setFilteredDepartmentsEdit(departments);
      return;
    }

    // Filter departments based on building and floor from departments table
    let filteredDepts = departments;

    if (selectedBuilding) {
      filteredDepts = filteredDepts.filter(d => d.building_name === selectedBuilding);
    }

    if (selectedFloor) {
      filteredDepts = filteredDepts.filter(d => d.floor_name === selectedFloor);
    }

    setFilteredDepartmentsEdit(filteredDepts.length > 0 ? filteredDepts : departments);
  }, [departments, editSN?.floor, editSN?.building]);

  // Reset department selection when floor changes for edit SN form
  useEffect(() => {
    if (editSN) {
      setEditSN(prev => ({ ...prev, dept_used: '' }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editSN?.floor]);

  // Handle add SN submit
  const handleAddSNSubmit = async (e) => {
    e.preventDefault();
    const { serial_number, brand, status, job_number, withdrawer_name, dept_used, building, floor, receive_date, withdraw_date } = addSNForm;

    if (!serial_number) {
      alert('กรุณากรอกหมายเลขเครื่อง');
      return;
    }

    try {
      await onAddSerialNumber({
        item_id: itemId,
        serial_number,
        brand: brand || '',
        status: status || 'Available',
        job_number: job_number || '',
        withdrawer_name: withdrawer_name || '',
        dept_used: dept_used || '',
        building: building || '',
        floor: floor || '',
        receive_date: receive_date || null,
        withdraw_date: withdraw_date || null
      });
      setAddSNForm({
        serial_number: '',
        brand: '',
        status: 'Available',
        job_number: '',
        withdrawer_name: '',
        dept_used: '',
        building: '',
        floor: '',
        receive_date: '',
        withdraw_date: ''
      });
      setShowAddSNModal(false);
      alert('เพิ่มหมายเลขเครื่องสำเร็จ!');
      // Refresh SN list
      const snForItem = serialNumbers.filter(sn => sn.item_id === itemId);
      setItemSerialNumbers(snForItem);
    } catch (error) {
      console.error('Error adding serial number:', error);
      alert('เกิดข้อผิดพลาดในการเพิ่มหมายเลขเครื่อง');
    }
  };

  // Handle bulk form changes
  const handleBulkChange = (e) => {
    const { name, value } = e.target;
    setBulkForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle bulk add SN submit
  const handleAddBulkSNSubmit = async (e) => {
    e.preventDefault();
    const { serial_numbers, brand, status, job_number, withdrawer_name, dept_used, building, floor, receive_date, withdraw_date } = bulkForm;

    // Split serial numbers by newline and filter out empty lines
    const snList = serial_numbers
      .split('\n')
      .map(sn => sn.trim())
      .filter(sn => sn.length > 0);

    if (snList.length === 0) {
      alert('กรุณากรอกหมายเลขเครื่องอย่างน้อย 1 รายการ');
      return;
    }

    try {
      // Add each serial number
      for (const sn of snList) {
        await onAddSerialNumber({
          item_id: itemId,
          serial_number: sn,
          brand: brand || '',
          status: status || 'Available',
          job_number: job_number || '',
          withdrawer_name: withdrawer_name || '',
          dept_used: dept_used || '',
          building: building || '',
          floor: floor || '',
          receive_date: receive_date || null,
          withdraw_date: withdraw_date || null
        });
      }

      // Reset form and close modal
      setBulkForm({
        serial_numbers: '',
        brand: '',
        status: 'Available',
        job_number: '',
        withdrawer_name: '',
        dept_used: '',
        building: '',
        floor: '',
        receive_date: '',
        withdraw_date: ''
      });
      setShowAddBulkSNModal(false);
      alert(`เพิ่มหมายเลขเครื่องสำเร็จทั้งหมด ${snList.length} รายการ`);

      // Refresh SN list
      const snForItem = serialNumbers.filter(sn => sn.item_id === itemId);
      setItemSerialNumbers(snForItem);
    } catch (error) {
      console.error('Error adding serial numbers:', error);
      alert('เกิดข้อผิดพลาดในการเพิ่มหมายเลขเครื่อง');
    }
  };

  // Handle edit SN submit
  const handleEditSNSubmit = async (e) => {
    e.preventDefault();
    if (!editSN) return;

    const { id, serial_number, brand, status, job_number, withdrawer_name, dept_used, building, floor, receive_date, withdraw_date } = editSN;

    if (!serial_number) {
      alert('กรุณากรอกหมายเลขเครื่อง');
      return;
    }

    try {
      await onUpdateSerialNumber(id, {
        serial_number,
        brand: brand || '',
        status: status || 'Available',
        job_number: job_number || '',
        withdrawer_name: withdrawer_name || '',
        dept_used: dept_used || '',
        building: building || '',
        floor: floor || '',
        receive_date: receive_date || null,
        withdraw_date: withdraw_date || null
      });
      setShowEditSNModal(false);
      alert('แก้ไขสำเร็จ!');
      // Refresh SN list
      const snForItem = serialNumbers.filter(sn => sn.item_id === itemId);
      setItemSerialNumbers(snForItem);
    } catch (error) {
      console.error('Error updating serial number:', error);
      alert('เกิดข้อผิดพลาดในการแก้ไขหมายเลขเครื่อง');
    }
  };

  // Handle delete SN
  const handleDeleteSN = async (id) => {
    if (window.confirm('คุณต้องการลบหมายเลขเครื่องนี้หรือไม่?')) {
      try {
        await onDeleteSerialNumber(id);
        alert('ลบสำเร็จ!');
        // Refresh SN list
        const snForItem = serialNumbers.filter(sn => sn.item_id === itemId);
        setItemSerialNumbers(snForItem);
      } catch (error) {
        console.error('Error deleting serial number:', error);
        alert('เกิดข้อผิดพลาดในการลบหมายเลขเครื่อง');
      }
    }
  };

  // Handle Return - open modal for Withdrawn items
  const handleOpenReturnModal = (sn) => {
    setReturnSN(sn);
    setReturnForm({
      receiver_name: '',
      return_condition: 'good',
      return_note: '',
      job_number: sn.job_number || '',
      dept_used: sn.dept_used || '',
      building: sn.building || '',
      floor: sn.floor || ''
    });
    setShowReturnModal(true);
  };

  // Handle Return submit
  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    if (!returnSN) return;

    const { receiver_name, return_condition, return_note, job_number, dept_used, building, floor } = returnForm;
    if (!receiver_name || !return_condition) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    // Debug: check if onReturn is available
    if (typeof onReturn !== 'function') {
      console.error('onReturn prop is not a function:', onReturn);
      alert('ข้อผิดพลาด: ฟังก์ชัน onReturn ไม่พร้อมใช้งาน (โปรดรีเฟรชหน้าเว็บด้วย Ctrl+Shift+R)');
      return;
    }

    try {
      const result = await onReturn(returnSN.id, {
        receiver_name,
        return_condition,
        return_note,
        job_number,
        dept_used,
        building,
        floor,
        performed_by: 'current_user' // TODO: get from auth
      });

      if (result.success) {
        setShowReturnModal(false);
        setReturnSN(null);
        alert('บันทึกการคืนอุปกรณ์สำเร็จ');
        // Refresh SN list
        const snForItem = serialNumbers.filter(sn => sn.item_id === itemId);
        setItemSerialNumbers(snForItem);
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + (result?.error?.message || JSON.stringify(result?.error)));
      }
    } catch (error) {
      console.error('Error returning:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + (error?.message || error?.error?.message || JSON.stringify(error)));
    }
  };

  // Handle History - open modal
  const handleOpenHistoryModal = (sn) => {
    setHistorySN(sn);
    setShowHistoryModal(true);
  };

  // Get history logs for a serial number
  const getHistoryLogs = (snId) => {
    if (!withdrawalLogs || withdrawalLogs.length === 0) return [];
    return withdrawalLogs.filter(log => log.serial_number_id === snId);
  };

  if (!item) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <p className="text-muted">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  // Helper: Compute stats for the Stats tab
  const totalSNs = itemSerialNumbers.length;
  const availableSNs = itemSerialNumbers.filter(sn => sn.status === 'Available').length;
  const withdrawnSNs = itemSerialNumbers.filter(sn => sn.status === 'Withdrawn').length;
  const repairSNs = itemSerialNumbers.filter(sn => sn.status === 'Repair').length;

  // Stats cards data
  const statsCards = [
    { label: 'ทั้งหมด', value: totalSNs, icon: 'bi-boxes', iconColor: 'primary', iconBg: 'primary-light' },
    { label: 'พร้อมใช้งาน', value: availableSNs, icon: 'bi-check-circle-fill', iconColor: 'success', iconBg: 'success-light' },
    { label: 'เบิกออกแล้ว', value: withdrawnSNs, icon: 'bi-box-arrow-right', iconColor: 'warning', iconBg: 'warning-light' },
    { label: 'อยู่ระหว่างซ่อม', value: repairSNs, icon: 'bi-tools', iconColor: 'danger', iconBg: 'danger-light' },
  ];

  // Get all history logs for this item
  const getItemHistoryLogs = () => {
    if (!withdrawalLogs || withdrawalLogs.length === 0) return [];
    const itemSNIds = itemSerialNumbers.map(sn => sn.id);
    return withdrawalLogs
      .filter(log => itemSNIds.includes(log.serial_number_id))
      .sort((a, b) => new Date(b.performed_at) - new Date(a.performed_at));
  };

  const itemHistoryLogs = getItemHistoryLogs();

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="header-title">
          <h4>รายละเอียดอุปกรณ์: {item.item_name}</h4>
          <p>รหัสรายการ: {item.id}</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
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
          <a href="/inventory" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left"></i> กลับไปรายการ
          </a>
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
              <i className="bi bi-list-ul me-1"></i> หมายเลขเครื่อง ({totalSNs})
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
            <div className="table-container">
              <table className="table table-striped mb-0">
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
                          <span className={getStatusBadgeClass(sn.status)}>
                            {getStatusText(sn.status)}
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
                              data-id={sn.id}
                              data-serial_number={sn.serial_number}
                              data-brand={sn.brand || ''}
                              data-status={sn.status}
                              data-job_number={sn.job_number || ''}
                              data-withdrawer_name={sn.withdrawer_name || ''}
                              data-dept_used={sn.dept_used || ''}
                              data-building={sn.building || ''}
                              data-floor={sn.floor || ''}
                              data-receive_date={sn.receive_date || ''}
                              data-withdraw_date={sn.withdraw_date || ''}
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
                                  withdraw_date: sn.withdraw_date || ''
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
                                data-id={sn.id}
                                onClick={() => handleOpenReturnModal(sn)}
                                title="รับคืนอุปกรณ์"
                              >
                                <i className="bi bi-box-arrow-left"></i>
                              </button>
                            )}
                            <button
                              className="btn-action btn-history"
                              data-id={sn.id}
                              onClick={() => handleOpenHistoryModal(sn)}
                              title="ดูประวัติ"
                            >
                              <i className="bi bi-clock-history"></i>
                            </button>
                            <button
                              className="btn-action btn-del"
                              data-id={sn.id}
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
            <div className="table-container">
              <table className="table table-striped mb-0">
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
                      const actionBadgeClass = log.action === 'withdraw' ? 'badge-warning' : 'badge-success';
                      const actionText = log.action === 'withdraw' ? 'เบิก' : 'คืน';
                      return (
                        <tr key={log.id}>
                          <td className="text-muted fw-bold">{index + 1}</td>
                          <td className="fw-medium">{sn?.serial_number || '-'}</td>
                          <td style={{ textAlign: 'center' }}>
                            <span className={'badge ' + actionBadgeClass}>
                              {actionText}
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
                {statsCards.map((stat, index) => (
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
    {/* Return Modal */}
      <div
        className={'modal fade ' + (showReturnModal ? 'show' : '')}
        tabIndex="-1"
        aria-hidden={!showReturnModal}
        style={{ display: showReturnModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <form onSubmit={handleReturnSubmit} className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-0 p-4 pb-0">
              <h5 className="modal-title fw-bold">รับคืนอุปกรณ์: {returnSN?.serial_number}</h5>
              <button type="button" className="btn-close" onClick={() => setShowReturnModal(false)}></button>
            </div>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label small fw-bold">ชื่อผู้รับคืน</label>
                <input
                  type="text"
                  name="receiver_name"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  placeholder="ระบุชื่อผู้รับคืน..."
                  value={returnForm.receiver_name}
                  onChange={(e) => setReturnForm(prev => ({ ...prev, receiver_name: e.target.value }))}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">สภาพอุปกรณ์</label>
                <select
                  name="return_condition"
                  className="form-select border-0 bg-light p-3 rounded-3"
                  value={returnForm.return_condition}
                  onChange={(e) => setReturnForm(prev => ({ ...prev, return_condition: e.target.value }))}
                  required
                >
                  <option value="good">ดี (ใช้งานได้ปกติ)</option>
                  <option value="damaged">ชำรุด</option>
                  <option value="need_repair">ต้องซ่อม</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">หมายเหตุ</label>
                <textarea
                  name="return_note"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  rows="3"
                  placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)..."
                  value={returnForm.return_note}
                  onChange={(e) => setReturnForm(prev => ({ ...prev, return_note: e.target.value }))}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">เลข Job (จากการเบิก)</label>
                <input
                  type="text"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  value={returnForm.job_number || '-'}
                  readOnly
                />
              </div>
              <div className="row g-2">
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold">หน่วยงาน (จากการเบิก)</label>
                  <input
                    type="text"
                    className="form-control border-0 bg-light p-3 rounded-3"
                    value={returnForm.dept_used || '-'}
                    readOnly
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold">อาคาร (จากการเบิก)</label>
                  <input
                    type="text"
                    className="form-control border-0 bg-light p-3 rounded-3"
                    value={returnForm.building || '-'}
                    readOnly
                  />
                </div>
              </div>
              <div className="row g-2">
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold">ชั้น (จากการเบิก)</label>
                  <input
                    type="text"
                    className="form-control border-0 bg-light p-3 rounded-3"
                    value={returnForm.floor || '-'}
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer border-0 p-4 pt-0">
              <button
                type="button"
                className="btn btn-light px-4 py-2 rounded-3 fw-bold"
                onClick={() => setShowReturnModal(false)}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="btn btn-primary px-4 py-2 rounded-3 fw-bold shadow-sm border-0"
                style={{ background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)' }}
              >
                ยืนยันการรับคืน
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* History Modal */}
      <div
        className={'modal fade ' + (showHistoryModal ? 'show' : '')}
        tabIndex="-1"
        aria-hidden={!showHistoryModal}
        style={{ display: showHistoryModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-0 p-4 pb-0">
              <h5 className="modal-title fw-bold">ประวัติการเบิก-คืน: {historySN?.serial_number}</h5>
              <button type="button" className="btn-close" onClick={() => setShowHistoryModal(false)}></button>
            </div>
            <div className="modal-body p-4">
              <div className="table-responsive">
                <table className="table table-hover mb-0" style={{ fontSize: '0.85rem' }}>
                  <thead className="table-light" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <tr>
                      <th style={{ width: '40px', minWidth: '40px', padding: '0.6rem 0.5rem', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', border: 'none' }}>#</th>
                      <th style={{ width: '130px', minWidth: '110px', padding: '0.6rem 0.5rem', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', border: 'none' }}>หมายเลขเครื่อง</th>
                      <th style={{ width: '90px', minWidth: '80px', padding: '0.6rem 0.5rem', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', border: 'none' }}>การกระทำ</th>
                      <th style={{ width: '100px', minWidth: '90px', padding: '0.6rem 0.5rem', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', border: 'none' }}>เลข Job</th>
                      <th style={{ width: '100px', minWidth: '90px', padding: '0.6rem 0.5rem', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', border: 'none' }}>ผู้เบิก / ผู้คืน</th>
                      <th style={{ width: '100px', minWidth: '90px', padding: '0.6rem 0.5rem', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', border: 'none' }}>แผนก</th>
                      <th style={{ width: '100px', minWidth: '90px', padding: '0.6rem 0.5rem', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', border: 'none' }}>อาคาร/ชั้น</th>
                      <th style={{ width: '80px', minWidth: '70px', padding: '0.6rem 0.5rem', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', border: 'none' }}>สภาพ</th>
                      <th style={{ width: '150px', minWidth: '120px', padding: '0.6rem 0.5rem', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', border: 'none' }}>หมายเหตุ</th>
                      <th style={{ width: '90px', minWidth: '80px', padding: '0.6rem 0.5rem', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', border: 'none' }}>ผู้บันทึก</th>
                      <th style={{ width: '140px', minWidth: '130px', padding: '0.6rem 0.5rem', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', border: 'none' }}>วันที่/เวลา</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getHistoryLogs(historySN?.id).length === 0 ? (
                      <tr>
                        <td colSpan="11" className="text-center text-muted py-4">
                          ยังไม่มีประวัติการเบิก-คืน
                        </td>
                      </tr>
                    ) : (
                      getHistoryLogs(historySN?.id).map((log, index) => (
                        <tr key={log.id}>
                          <td className="text-muted fw-bold">{index + 1}</td>
                          <td className="fw-medium">{historySN?.serial_number || '-'}</td>
                          <td style={{ textAlign: 'center' }}>
                            <span className={log.action === 'withdraw' ? 'badge-warning' : 'badge-success'}>
                              {log.action === 'withdraw' ? 'เบิก' : 'คืน'}
                            </span>
                          </td>
                          <td>{log.job_number || '-'}</td>
                          <td>{log.action === 'withdraw' ? log.withdrawer_name : log.receiver_name}</td>
                          <td>{log.dept_used || '-'}</td>
                          <td>{log.building || '-'} {log.floor ? ' (ชั้น ' + log.floor + ')' : ''}</td>
                          <td>{log.condition || '-'}</td>
                          <td>{log.note || '-'}</td>
                          <td>{log.performed_by || '-'}</td>
                          <td className="text-muted small">
                            {log.performed_at ? new Date(log.performed_at).toLocaleString() : '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer border-0 p-4 pt-0">
              <button
                type="button"
                className="btn btn-primary px-4 py-2 rounded-3 fw-bold shadow-sm border-0"
                style={{ background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)' }}
                onClick={() => setShowHistoryModal(false)}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit SN Modal */}
      <div
        className={'modal fade ' + (showEditSNModal ? 'show' : '')}
        tabIndex="-1"
        aria-hidden={!showEditSNModal}
        style={{ display: showEditSNModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <form onSubmit={handleEditSNSubmit} className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-0 p-4 pb-0">
              <h5 className="modal-title fw-bold">แก้ไขหมายเลขเครื่อง</h5>
              <button type="button" className="btn-close" onClick={() => setShowEditSNModal(false)}></button>
            </div>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label small fw-bold">หมายเลขเครื่อง</label>
                <input
                  type="text"
                  name="serial_number"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  value={editSN?.serial_number || ''}
                  onChange={handleEditSNChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">ยี่ห้อ</label>
                <input
                  type="text"
                  name="brand"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  value={editSN?.brand || ''}
                  onChange={handleEditSNChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">สถานะ</label>
                <select
                  name="status"
                  className="form-select border-0 bg-light p-3 rounded-3"
                  value={editSN?.status || ''}
                  onChange={handleEditSNChange}
                >
                  <option value="Available">พร้อมใช้งาน</option>
                  <option value="Withdrawn">เบิกออกแล้ว</option>
                  <option value="Repair">อยู่ระหว่างซ่อม</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">เลข Job</label>
                <input
                  type="text"
                  name="job_number"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  value={editSN?.job_number || ''}
                  onChange={handleEditSNChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">ชื่อผู้เบิก</label>
                <input
                  type="text"
                  name="withdrawer_name"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  value={editSN?.withdrawer_name || ''}
                  onChange={handleEditSNChange}
                />
              </div>
              <div className="row g-2">
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold">แผนก</label>
                  <select
                    name="dept_used"
                    className="form-select border-0 bg-light p-3 rounded-3"
                    value={editSN?.dept_used || ''}
                    onChange={handleEditSNChange}
                  >
                    <option value="">-- เลือกแผนก --</option>
                    {filteredDepartmentsEdit.map(dept => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold">อาคาร</label>
                  <select
                    name="building"
                    className="form-select border-0 bg-light p-3 rounded-3"
                    value={editSN?.building || ''}
                    onChange={handleEditSNChange}
                  >
                    <option value="">-- เลือกอาคาร --</option>
                    {buildings.map(building => (
                      <option key={building.id} value={building.name}>{building.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row g-2">
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold">ชั้น</label>
                  <select
                    name="floor"
                    className="form-select border-0 bg-light p-3 rounded-3"
                    value={editSN?.floor || ''}
                    onChange={handleEditSNChange}
                  >
                    <option value="">-- เลือกชั้น --</option>
                    {filteredFloorsEdit.map(floor => (
                      <option key={floor.id} value={floor.floor_name}>{floor.floor_name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold">วันที่รับ</label>
                  <input
                    type="date"
                    name="receive_date"
                    className="form-control border-0 bg-light p-3 rounded-3"
                    value={editSN?.receive_date || ''}
                    onChange={handleEditSNChange}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">วันที่เบิก</label>
                <input
                  type="date"
                  name="withdraw_date"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  value={editSN?.withdraw_date || ''}
                  onChange={handleEditSNChange}
                />
              </div>
            </div>
            <div className="modal-footer border-0 p-4 pt-0">
              <button
                type="button"
                className="btn btn-light px-4 py-2 rounded-3 fw-bold"
                onClick={() => setShowEditSNModal(false)}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="btn btn-primary px-4 py-2 rounded-3 fw-bold shadow-sm border-0"
                style={{ background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)' }}
              >
                บันทึกการแก้ไข
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
// Helper functions for status badges
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Available': return 'badge-success';
    case 'Withdrawn': return 'badge-warning';
    case 'Repair': return 'badge-danger';
    default: return 'badge-secondary';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'Available': return 'พร้อมใช้งาน';
    case 'Withdrawn': return 'เบิกออกแล้ว';
    case 'Repair': return 'อยู่ระหว่างซ่อม';
    default: return status;
  }
};

export default Details;