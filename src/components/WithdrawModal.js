import React, { useState, useEffect } from 'react';

const WithdrawModal = ({ show, onHide, items, serialNumbers, onItemChange, onSNChange, onChange, onSubmit, formData, selectedItemId, availableSerialNumbers, departments, buildings, floors }) => {
  // State for cascading dropdowns - we show filtered options based on selected item's serial numbers
  const [filteredFloors, setFilteredFloors] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  // Populate item options
  const itemOptions = items.map(item => (
    <option key={item.id} value={item.id}>
      {item.item_name}
    </option>
  ));

  // Handle building change: filter floors based on selected building (using floors data, not serial numbers)
  useEffect(() => {
    if (!show) return;

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
  }, [show, floors, formData.building_info]);

  // Handle floor change: filter departments based on selected building AND floor (using departments data, not serial numbers)
  useEffect(() => {
    if (!show) return;

    const selectedBuilding = formData.building_info;
    const selectedFloor = formData.floor_info;

    if (!selectedBuilding && !selectedFloor) {
      // No building or floor selected, show all departments
      setFilteredDepartments(departments);
      return;
    }

    // Filter departments by building and/or floor (assumes departments have building_name/building_id and floor_name/floor_id fields)
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
  }, [show, departments, formData.building_info, formData.floor_info]);

  // Auto-fill building and floor when department is selected
  useEffect(() => {
    if (!show) return;

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
  }, [show, departments, formData.dept_info, onChange]);

  // Handle floor change: reset department selection when floor changes
  useEffect(() => {
    if (!show) return;
    // Reset department selection when floor changes - use a ref to prevent infinite loop
    // The parent should handle the reset logic to avoid circular updates
  }, [show, formData.floor_info]);

  // Conditionally render the modal
  if (!show) return null;

  return (
    <div className={`modal fade ${show ? 'show' : ''}`} tabIndex="-1" aria-hidden={!show} style={{ display: 'block' }}>
      <div className="modal-dialog modal-dialog-centered">
        <form onSubmit={onSubmit} className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header border-0 p-4 pb-0">
            <h5 className="modal-title fw-bold">บันทึกการเบิกอุปกรณ์</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body p-4">
            <input type="hidden" name="action" value="withdraw" />

            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <label className="form-label small fw-bold">เลือกอุปกรณ์</label>
                <select
                  name="item_id"
                  id="item_select"
                  className="form-select border-0 bg-light p-3 rounded-3"
                  required
                  value={formData.item_id}
                  onChange={onItemChange}
                >
                  <option value="">-- เลือกรายการ --</option>
                  {itemOptions}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold text-primary">เลข Job</label>
                <input
                  type="text"
                  name="job_number"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  placeholder="JOB6904001"
                  value={formData.job_number}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <label className="form-label small fw-bold">ชื่อผู้เบิก</label>
                <input
                  type="text"
                  name="withdrawer"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  value={formData.withdrawer}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">Serial Number</label>
                <select
                  name="serial_number"
                  id="sn_select"
                  className="form-select border-0 bg-light p-3 rounded-3"
                  required
                  value={formData.serial_number}
                  onChange={onSNChange}
                  disabled={!selectedItemId}
                >
                  <option value="">-- กรุณาเลือกอุปกรณ์ก่อน --</option>
                  {availableSerialNumbers.length > 0 ? (
                    availableSerialNumbers.map(sn => (
                      <option key={sn.id} value={sn.serial_number}>
                        {sn.serial_number}
                      </option>
                    ))
                  ) : (
                    <option value="">-- ไม่มีของว่างในสต็อก --</option>
                  )}
                </select>
              </div>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <label className="form-label small fw-bold">หน่วยงาน / แผนก</label>
                <select
                  name="dept_info"
                  className="form-select border-0 bg-light p-3 rounded-3"
                  value={formData.dept_info}
                  onChange={onChange}
                  required
                >
                  <option value="">-- เลือกแผนก --</option>
                  {filteredDepartments.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-bold">อาคาร</label>
                <select
                  name="building_info"
                  className="form-select border-0 bg-light p-3 rounded-3"
                  value={formData.building_info}
                  onChange={onChange}
                >
                  <option value="">-- อาคาร --</option>
                  {buildings.map(building => (
                    <option key={building.id} value={building.name}>{building.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-bold">ชั้น</label>
                <select
                  name="floor_info"
                  className="form-select border-0 bg-light p-3 rounded-3"
                  value={formData.floor_info}
                  onChange={onChange}
                >
                  <option value="">-- ชั้น --</option>
                  {filteredFloors.map(floor => (
                    <option key={floor.id} value={floor.floor_name}>{floor.floor_name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer border-0 p-4 pt-0">
            <button
              type="button"
              className="btn btn-light px-4 py-2 rounded-3 fw-bold"
              onClick={onHide}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="btn btn-primary px-4 py-2 rounded-3 fw-bold shadow-sm border-0"
            >
              ยืนยันการเบิกอุปกรณ์
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawModal;