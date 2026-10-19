import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Details = ({ items, serialNumbers, onAddItem, onUpdateItem, onDeleteItem, onAddSerialNumber, onUpdateSerialNumber, onDeleteSerialNumber, departments, buildings, floors }) => {
  const { id } = useParams();
  const itemId = parseInt(id);
  const [item, setItem] = useState(null);
  const [itemSerialNumbers, setItemSerialNumbers] = useState([]);
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

  // Handle cascading dropdowns for add SN form - filter floors based on selected building
  useEffect(() => {
    if (!buildings || buildings.length === 0) {
      setFilteredFloorsAdd(floors);
      return;
    }

    const selectedBuilding = addSNForm.building;
    if (!selectedBuilding) {
      // No building selected, show all floors
      setFilteredFloorsAdd(floors);
      return;
    }

    // Find the building reference to get its ID
    const buildingRef = buildings.find(b => b.name === selectedBuilding);
    if (!buildingRef) {
      setFilteredFloorsAdd(floors);
      return;
    }

    // Filter floors that belong to this building
    const buildingFloors = floors.filter(floor => floor.building_id === buildingRef.id);
    setFilteredFloorsAdd(buildingFloors.length > 0 ? buildingFloors : floors);

    // Reset floor selection when building changes
    setAddSNForm(prev => ({ ...prev, floor: '' }));
  }, [buildings, floors, addSNForm.building]);

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

    // If we have a floor selected, find departments that have serial numbers on that floor
    if (selectedFloor) {
      // Find the floor reference to get its ID
      const floorRef = floors.find(f => f.floor_name === selectedFloor);
      if (!floorRef) {
        setFilteredDepartmentsAdd(departments);
        return;
      }

      // Find serial numbers that match this floor and get their departments
      const deptNamesFromFloor = serialNumbers
        .filter(sn => sn.floor === selectedFloor && sn.dept_used)
        .map(sn => sn.dept_used);

      // Get department references for these names
      const filteredDepts = departments.filter(dept =>
        deptNamesFromFloor.includes(dept.name)
      );

      setFilteredDepartmentsAdd(filteredDepts.length > 0 ? filteredDepts : departments);
      return;
    }

    // If we have only a building selected, find departments that have serial numbers in that building
    if (selectedBuilding) {
      // Find the building reference to get its ID
      const buildingRef = buildings.find(b => b.name === selectedBuilding);
      if (!buildingRef) {
        setFilteredDepartmentsAdd(departments);
        return;
      }

      // Find serial numbers that match this building and get their departments
      const deptNamesFromBuilding = serialNumbers
        .filter(sn => sn.building === selectedBuilding && sn.dept_used)
        .map(sn => sn.dept_used);

      // Get department references for these names
      const filteredDepts = departments.filter(dept =>
        deptNamesFromBuilding.includes(dept.name)
      );

      setFilteredDepartmentsAdd(filteredDepts.length > 0 ? filteredDepts : departments);
      return;
    }

    // Default case
    setFilteredDepartmentsAdd(departments);
  }, [departments, serialNumbers, floors, buildings, addSNForm.floor, addSNForm.building]);

  // Reset department selection when floor changes for add SN form
  useEffect(() => {
    setAddSNForm(prev => ({ ...prev, dept_used: '' }));
  }, [addSNForm.floor]);

  // Handle cascading dropdowns - filter floors based on selected building
  useEffect(() => {
    if (!buildings || buildings.length === 0) {
      setFilteredFloors(floors);
      return;
    }

    const selectedBuilding = bulkForm.building;
    if (!selectedBuilding) {
      // No building selected, show all floors
      setFilteredFloors(floors);
      return;
    }

    // Filter floors based on whether they're associated with the selected building in serialNumbers
    // This works for both reference data (with IDs) and fallback data (with names)
    const associatedFloors = serialNumbers
      .filter(sn => sn.building === selectedBuilding && sn.floor)
      .map(sn => sn.floor);

    // Get unique floor names
    const uniqueAssociatedFloors = [...new Set(associatedFloors)];

    // If we found associations, show only those floors; otherwise show all floors
    if (uniqueAssociatedFloors.length > 0) {
      const buildingFloors = floors.filter(floor =>
        uniqueAssociatedFloors.includes(floor.floor_name)
      );
      setFilteredFloors(buildingFloors.length > 0 ? buildingFloors : floors);
    } else {
      // No specific associations found, show all floors
      setFilteredFloors(floors);
    }

    // Reset floor selection when building changes
    setBulkForm(prev => ({ ...prev, floor: '' }));
  }, [buildings, floors, bulkForm.building, serialNumbers]);

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

    // If we have a floor selected, find departments that have serial numbers on that floor
    if (selectedFloor) {
      // Find serial numbers that match this floor and get their departments
      const deptNamesFromFloor = serialNumbers
        .filter(sn => sn.floor === selectedFloor && sn.dept_used)
        .map(sn => sn.dept_used);

      // Get unique department names
      const uniqueDeptNamesFromFloor = [...new Set(deptNamesFromFloor)];

      // Get department references for these names
      const filteredDepts = departments.filter(dept =>
        uniqueDeptNamesFromFloor.includes(dept.name)
      );

      setFilteredDepartments(filteredDepts.length > 0 ? filteredDepts : departments);
      return;
    }

    // If we have only a building selected, find departments that have serial numbers in that building
    if (selectedBuilding) {
      // Find serial numbers that match this building and get their departments
      const deptNamesFromBuilding = serialNumbers
        .filter(sn => sn.building === selectedBuilding && sn.dept_used)
        .map(sn => sn.dept_used);

      // Get unique department names
      const uniqueDeptNamesFromBuilding = [...new Set(deptNamesFromBuilding)];

      // Get department references for these names
      const filteredDepts = departments.filter(dept =>
        uniqueDeptNamesFromBuilding.includes(dept.name)
      );

      setFilteredDepartments(filteredDepts.length > 0 ? filteredDepts : departments);
      return;
    }

    // Default case
    setFilteredDepartments(departments);
  }, [departments, serialNumbers, floors, buildings, bulkForm.floor, bulkForm.building]);

  // Reset department selection when floor changes
  useEffect(() => {
    setBulkForm(prev => ({ ...prev, dept_used: '' }));
  }, [bulkForm.floor]);

  // Handle cascading dropdowns for add SN form - filter floors based on selected building
  useEffect(() => {
    if (!buildings || buildings.length === 0) {
      setFilteredFloorsAdd(floors);
      return;
    }

    const selectedBuilding = addSNForm.building;
    if (!selectedBuilding) {
      // No building selected, show all floors
      setFilteredFloorsAdd(floors);
      return;
    }

    // Filter floors based on whether they're associated with the selected building in serialNumbers
    // This works for both reference data (with IDs) and fallback data (with names)
    const associatedFloors = serialNumbers
      .filter(sn => sn.building === selectedBuilding && sn.floor)
      .map(sn => sn.floor);

    // Get unique floor names
    const uniqueAssociatedFloors = [...new Set(associatedFloors)];

    // If we found associations, show only those floors; otherwise show all floors
    if (uniqueAssociatedFloors.length > 0) {
      const buildingFloors = floors.filter(floor =>
        uniqueAssociatedFloors.includes(floor.floor_name)
      );
      setFilteredFloorsAdd(buildingFloors.length > 0 ? buildingFloors : floors);
    } else {
      // No specific associations found, show all floors
      setFilteredFloorsAdd(floors);
    }

    // Reset floor selection when building changes
    setAddSNForm(prev => ({ ...prev, floor: '' }));
  }, [buildings, floors, addSNForm.building, serialNumbers]);

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

    // If we have a floor selected, find departments that have serial numbers on that floor
    if (selectedFloor) {
      // Find the floor reference to get its ID
      const floorRef = floors.find(f => f.floor_name === selectedFloor);
      if (!floorRef) {
        setFilteredDepartmentsAdd(departments);
        return;
      }

      // Find serial numbers that match this floor and get their departments
      const deptNamesFromFloor = serialNumbers
        .filter(sn => sn.floor === selectedFloor && sn.dept_used)
        .map(sn => sn.dept_used);

      // Get department references for these names
      const filteredDepts = departments.filter(dept =>
        deptNamesFromFloor.includes(dept.name)
      );

      setFilteredDepartmentsAdd(filteredDepts.length > 0 ? filteredDepts : departments);
      return;
    }

    // If we have only a building selected, find departments that have serial numbers in that building
    if (selectedBuilding) {
      // Find the building reference to get its ID
      const buildingRef = buildings.find(b => b.name === selectedBuilding);
      if (!buildingRef) {
        setFilteredDepartmentsAdd(departments);
        return;
      }

      // Find serial numbers that match this building and get their departments
      const deptNamesFromBuilding = serialNumbers
        .filter(sn => sn.building === selectedBuilding && sn.dept_used)
        .map(sn => sn.dept_used);

      // Get department references for these names
      const filteredDepts = departments.filter(dept =>
        deptNamesFromBuilding.includes(dept.name)
      );

      setFilteredDepartmentsAdd(filteredDepts.length > 0 ? filteredDepts : departments);
      return;
    }

    // Default case
    setFilteredDepartmentsAdd(departments);
  }, [departments, serialNumbers, floors, buildings, addSNForm.floor, addSNForm.building]);

  // Reset department selection when floor changes for add SN form
  useEffect(() => {
    setAddSNForm(prev => ({ ...prev, dept_used: '' }));
  }, [addSNForm.floor]);

  // Handle cascading dropdowns for edit SN form - filter floors based on selected building
  useEffect(() => {
    if (!buildings || buildings.length === 0) {
      setFilteredFloorsEdit(floors);
      return;
    }

    const selectedBuilding = editSN?.building || '';
    if (!selectedBuilding) {
      // No building selected, show all floors
      setFilteredFloorsEdit(floors);
      return;
    }

    // Filter floors based on whether they're associated with the selected building in serialNumbers
    // This works for both reference data (with IDs) and fallback data (with names)
    const associatedFloors = serialNumbers
      .filter(sn => sn.building === selectedBuilding && sn.floor)
      .map(sn => sn.floor);

    // Get unique floor names
    const uniqueAssociatedFloors = [...new Set(associatedFloors)];

    // If we found associations, show only those floors; otherwise show all floors
    if (uniqueAssociatedFloors.length > 0) {
      const buildingFloors = floors.filter(floor =>
        uniqueAssociatedFloors.includes(floor.floor_name)
      );
      setFilteredFloorsEdit(buildingFloors.length > 0 ? buildingFloors : floors);
    } else {
      // No specific associations found, show all floors
      setFilteredFloorsEdit(floors);
    }

    // Reset floor selection when building changes
    if (editSN) {
      setEditSN(prev => ({ ...prev, floor: '' }));
    }
  }, [buildings, floors, editSN, serialNumbers]);

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

    // If we have a floor selected, find departments that have serial numbers on that floor
    if (selectedFloor) {
      // Find serial numbers that match this floor and get their departments
      const deptNamesFromFloor = serialNumbers
        .filter(sn => sn.floor === selectedFloor && sn.dept_used)
        .map(sn => sn.dept_used);

      // Get unique department names
      const uniqueDeptNamesFromFloor = [...new Set(deptNamesFromFloor)];

      // Get department references for these names
      const filteredDepts = departments.filter(dept =>
        uniqueDeptNamesFromFloor.includes(dept.name)
      );

      setFilteredDepartmentsEdit(filteredDepts.length > 0 ? filteredDepts : departments);
      return;
    }

    // If we have only a building selected, find departments that have serial numbers in that building
    if (selectedBuilding) {
      // Find serial numbers that match this building and get their departments
      const deptNamesFromBuilding = serialNumbers
        .filter(sn => sn.building === selectedBuilding && sn.dept_used)
        .map(sn => sn.dept_used);

      // Get unique department names
      const uniqueDeptNamesFromBuilding = [...new Set(deptNamesFromBuilding)];

      // Get department references for these names
      const filteredDepts = departments.filter(dept =>
        uniqueDeptNamesFromBuilding.includes(dept.name)
      );

      setFilteredDepartmentsEdit(filteredDepts.length > 0 ? filteredDepts : departments);
      return;
    }

    // Default case
    setFilteredDepartmentsEdit(departments);
  }, [departments, serialNumbers, floors, buildings, editSN?.floor, editSN?.building]);

  // Reset department selection when floor changes for edit SN form
  useEffect(() => {
    if (editSN) {
      setEditSN(prev => ({ ...prev, dept_used: '' }));
    }
  }, [editSN?.floor, editSN]);

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

  if (!item) {
    return (
      <div className="content-card">
        <p className="text-center text-muted">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="content-card">
        <div className="page-header">
          <div className="header-title">
            <h4>รายละเอียดอุปกรณ์: {item.item_name}</h4>
            <p>รหัสรายการ: {item.id}</p>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary btn-sm"
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

        <div className="row g-4">
          <div className="col-md-4">
            <div className="border rounded p-3">
              <h6 className="mb-3">ข้อมูลทั่วไป</h6>
              <p><strong>ชื่อรายการ:</strong> {item.item_name}</p>
              <p><strong>จำนวนรวม:</strong> {item.total_qty} {item.unit}</p>
              <p><strong>ผู้รับผิดชอบ:</strong> {item.responsible || '-'}</p>
              <p><strong>วันที่ลงระบบ:</strong> {item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</p>
            </div>
          </div>

          <div className="col-md-8">
            <div className="border rounded p-3">
              <h6 className="mb-3">หมายเลขเครื่องทั้งหมด ({itemSerialNumbers.length})</h6>
              {itemSerialNumbers.length === 0 ? (
                <p className="text-center text-muted py-3">ยังไม่มีหมายเลขเครื่องสำหรับรายการนี้</p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>หมายเลขเครื่อง</th>
                        <th>ยี่ห้อ</th>
                        <th>สถานะ</th>
                        <th>เลข Job</th>
                        <th>ผู้เบิก</th>
                        <th>แผนก</th>
                        <th>อาคาร/ชั้น</th>
                        <th>วันที่รับ</th>
                        <th>วันที่เบิก</th>
                        <th>การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemSerialNumbers.map((sn, index) => (
                        <tr key={sn.id}>
                          <td className="text-muted fw-bold">{String(index + 1).padStart(2, '0')}</td>
                          <td>{sn.serial_number}</td>
                          <td>{sn.brand || '-'}</td>
                          <td>
                            <span className={`badge-soft ${getStatusBadgeClass(sn.status)}`}>
                              {getStatusText(sn.status)}
                            </span>
                          </td>
                          <td>{sn.job_number || '-'}</td>
                          <td>{sn.withdrawer_name || '-'}</td>
                          <td>{sn.dept_used || '-'}</td>
                          <td>
                            {sn.building || '-'} {sn.floor ? `(ชั้น ${sn.floor})` : ''}
                          </td>
                          <td className="text-muted small">
                            {sn.receive_date ? new Date(sn.receive_date).toLocaleDateString() : '-'}
                          </td>
                          <td className="text-muted small">
                            {sn.withdraw_date ? new Date(sn.withdraw_date).toLocaleDateString() : '-'}
                          </td>
                          <td>
                            <div className="d-flex justify-content-center gap-2">
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
                              >
                                <i className="bi bi-pencil-fill"></i>
                              </button>
                              <button
                                className="btn-action btn-del"
                                data-id={sn.id}
                                onClick={() => handleDeleteSN(sn.id)}
                              >
                                <i className="bi bi-trash3-fill"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add SN Modal */}
      <div
        className={`modal fade ${showAddSNModal ? 'show' : ''}`}
        tabIndex="-1"
        aria-hidden={!showAddSNModal}
        style={{ display: showAddSNModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <form onSubmit={handleAddSNSubmit} className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-0 p-4 pb-0">
              <h5 className="modal-title fw-bold">เพิ่มหมายเลขเครื่องสำหรับ {item.item_name}</h5>
              <button type="button" className="btn-close" onClick={() => setShowAddSNModal(false)}></button>
            </div>
            <div className="modal-body p-4">
              <input type="hidden" name="action" value="add_sn" />
              <div className="mb-3">
                <label className="form-label small fw-bold">หมายเลขเครื่อง</label>
                <input
                  type="text"
                  name="serial_number"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  placeholder="ระบุหมายเลขเครื่อง..."
                  value={addSNForm.serial_number}
                  onChange={handleAddSNChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">ยี่ห้อ</label>
                <input
                  type="text"
                  name="brand"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  placeholder="ระบุยี่ห้อ (ถ้ามี)..."
                  value={addSNForm.brand}
                  onChange={handleAddSNChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">สถานะ</label>
                <select
                  name="status"
                  className="form-select border-0 bg-light p-3 rounded-3"
                  value={addSNForm.status}
                  onChange={handleAddSNChange}
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
                  placeholder="เช่น JOB6904001"
                  value={addSNForm.job_number}
                  onChange={handleAddSNChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">ชื่อผู้เบิก</label>
                <input
                  type="text"
                  name="withdrawer_name"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  placeholder="ชื่อผู้เบิกอุปกรณ์"
                  value={addSNForm.withdrawer_name}
                  onChange={handleAddSNChange}
                />
              </div>
              <div className="row g-2">
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold">แผนก</label>
                  <select
                    name="dept_used"
                    className="form-select border-0 bg-light p-3 rounded-3"
                    value={addSNForm.dept_used}
                    onChange={handleAddSNChange}
                  >
                    <option value="">-- เลือกแผนก --</option>
                    {filteredDepartmentsAdd.map(dept => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold">อาคาร</label>
                  <select
                    name="building"
                    className="form-select border-0 bg-light p-3 rounded-3"
                    value={addSNForm.building}
                    onChange={handleAddSNChange}
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
                    value={addSNForm.floor}
                    onChange={handleAddSNChange}
                  >
                    <option value="">-- เลือกชั้น --</option>
                    {filteredFloorsAdd.map(floor => (
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
                    value={addSNForm.receive_date}
                    onChange={handleAddSNChange}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">วันที่เบิก</label>
                <input
                  type="date"
                  name="withdraw_date"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  value={addSNForm.withdraw_date}
                  onChange={handleAddSNChange}
                />
              </div>
            </div>
            <div className="modal-footer border-0 p-4 pt-0">
              <button
                type="button"
                className="btn btn-light px-4 py-2 rounded-3 fw-bold"
                onClick={() => setShowAddSNModal(false)}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="btn btn-primary px-4 py-2 rounded-3 fw-bold shadow-sm border-0"
                style={{ background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)' }}
              >
                บันทึกข้อมูล
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Add Bulk SN Modal */}
      <div
        className={`modal fade ${showAddBulkSNModal ? 'show' : ''}`}
        tabIndex="-1"
        aria-hidden={!showAddBulkSNModal}
        style={{ display: showAddBulkSNModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <form onSubmit={handleAddBulkSNSubmit} className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-0 p-4 pb-0">
              <h5 className="modal-title fw-bold">เพิ่มหมายเลขเครื่องหลายรายการสำหรับ {item.item_name}</h5>
              <button type="button" className="btn-close" onClick={() => setShowAddBulkSNModal(false)}></button>
            </div>
            <div className="modal-body p-4">
              <input type="hidden" name="action" value="add_bulk_sn" />

              <div className="mb-3">
                <label className="form-label small fw-bold">หมายเลขเครื่อง (บรรทัดละ 1 รายการ)</label>
                <textarea
                  name="serial_numbers"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  rows="5"
                  placeholder="ใส่หมายเลขเครื่องแต่ละบรรทัด เช่น:\nSN001\nSN002\nSN003"
                  value={bulkForm.serial_numbers}
                  onChange={handleBulkChange}
                />
                <small className="text-muted">ใส่หมายเลขเครื่องแต่ละรายการในบรรทัดใหม่</small>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">ยี่ห้อ</label>
                <input
                  type="text"
                  name="brand"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  placeholder="ระบุยี่ห้อ (ถ้ามี)..."
                  value={bulkForm.brand}
                  onChange={handleBulkChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">สถานะ</label>
                <select
                  name="status"
                  className="form-select border-0 bg-light p-3 rounded-3"
                  value={bulkForm.status}
                  onChange={handleBulkChange}
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
                  placeholder="เช่น JOB6904001"
                  value={bulkForm.job_number}
                  onChange={handleBulkChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">ชื่อผู้เบิก</label>
                <input
                  type="text"
                  name="withdrawer_name"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  placeholder="ชื่อผู้เบิกอุปกรณ์"
                  value={bulkForm.withdrawer_name}
                  onChange={handleBulkChange}
                />
              </div>

              <div className="row g-2">
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold">แผนก</label>
                  <select
                    name="dept_used"
                    className="form-select border-0 bg-light p-3 rounded-3"
                    value={bulkForm.dept_used}
                    onChange={handleBulkChange}
                  >
                    <option value="">-- เลือกแผนก --</option>
                    {filteredDepartments.map(dept => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold">อาคาร</label>
                  <select
                    name="building"
                    className="form-select border-0 bg-light p-3 rounded-3"
                    value={bulkForm.building}
                    onChange={handleBulkChange}
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
                    value={bulkForm.floor}
                    onChange={handleBulkChange}
                  >
                    <option value="">-- เลือกชั้น --</option>
                    {filteredFloors.map(floor => (
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
                    value={bulkForm.receive_date}
                    onChange={handleBulkChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">วันที่เบิก</label>
                <input
                  type="date"
                  name="withdraw_date"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  value={bulkForm.withdraw_date}
                  onChange={handleBulkChange}
                />
              </div>
            </div>
            <div className="modal-footer border-0 p-4 pt-0">
              <button
                type="button"
                className="btn btn-light px-4 py-2 rounded-3 fw-bold"
                onClick={() => setShowAddBulkSNModal(false)}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="btn btn-primary px-4 py-2 rounded-3 fw-bold shadow-sm border-0"
                style={{ background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)' }}
              >
                บันทึกข้อมูลทั้งหมด
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Edit SN Modal */}
      <div
        className={`modal fade ${showEditSNModal ? 'show' : ''}`}
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
              <input type="hidden" name="action" value="edit_sn" />
              <input type="hidden" name="sn_id" id="edit_sn_id" />
              <div className="mb-3">
                <label className="form-label small fw-bold">หมายเลขเครื่อง</label>
                <input
                  type="text"
                  name="serial_number"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  id="edit_serial_number"
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
                  id="edit_brand"
                  value={editSN?.brand || ''}
                  onChange={handleEditSNChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">สถานะ</label>
                <select
                  name="status"
                  className="form-select border-0 bg-light p-3 rounded-3"
                  id="edit_status"
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
                  id="edit_job_number"
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
                  id="edit_withdrawer_name"
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
                    id="edit_dept_used"
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
                    id="edit_building"
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
                    id="edit_floor"
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
                    id="edit_receive_date"
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
                  id="edit_withdraw_date"
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
    case 'Available': return 'bg-success';
    case 'Withdrawn': return 'bg-warning';
    case 'Repair': return 'bg-danger';
    default: return 'bg-secondary';
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