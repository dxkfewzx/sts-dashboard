import React, { useState, useEffect } from 'react';

const WithdrawModal = ({ show, onHide, items, serialNumbers, onItemChange, onSNChange, onChange, onSubmit, formData, selectedItemId, availableSerialNumbers, departments, buildings, floors }) => {
  // State for cascading dropdowns - always initialize hooks at top level
  const [filteredFloors, setFilteredFloors] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  // Populate item options
  const itemOptions = items.map(item => (
    <option key={item.id} value={item.id}>
      {item.item_name}
    </option>
  ));

  // Handle cascading dropdowns - filter floors based on selected building
  useEffect(() => {
    // Only run logic when modal is shown
    if (!show) return;

    if (!buildings || buildings.length === 0) {
      setFilteredFloors(floors);
      return;
    }

    const selectedBuildingName = formData.building_info;
    if (!selectedBuildingName) {
      // No building selected, show all floors
      setFilteredFloors(floors);
      return;
    }

    // Find the building reference to get its ID
    const buildingRef = buildings.find(b => b.name === selectedBuildingName);
    if (!buildingRef) {
      setFilteredFloors(floors);
      return;
    }

    // Filter floors based on whether they're associated with the selected building in serialNumbers
    // Try to use ID fields first, fall back to text fields if ID fields not available
    let associatedFloorIds = [];
    let associatedFloorNames = [];

    const hasIdFields = serialNumbers.length > 0 &&
                       serialNumbers[0].building_id !== undefined &&
                       serialNumbers[0].floor_id !== undefined;

    if (hasIdFields) {
      // Use ID fields
      associatedFloorIds = serialNumbers
        .filter(sn =>
          sn.building_id === buildingRef.id &&
          sn.floor_id !== null &&
          sn.floor_id !== undefined
        )
        .map(sn => sn.floor_id)
        .filter(id => id !== null);
    } else {
      // Fall back to text fields
      associatedFloorNames = serialNumbers
        .filter(sn =>
          sn.building === selectedBuildingName &&
          sn.floor !== null &&
          sn.floor !== undefined &&
          sn.floor.trim() !== ''
        )
        .map(sn => sn.floor.trim());
    }

    // Get unique values
    const uniqueAssociatedFloorIds = [...new Set(associatedFloorIds)];
    const uniqueAssociatedFloorNames = [...new Set(associatedFloorNames)];

    // If we found associations, show only those; otherwise show all
    if (hasIdFields && uniqueAssociatedFloorIds.length > 0) {
      const buildingFloors = floors.filter(floor =>
        uniqueAssociatedFloorIds.includes(floor.id)
      );
      setFilteredFloors(buildingFloors.length > 0 ? buildingFloors : floors);
    } else if (!hasIdFields && uniqueAssociatedFloorNames.length > 0) {
      const buildingFloors = floors.filter(floor =>
        uniqueAssociatedFloorNames.includes(floor.floor_name)
      );
      setFilteredFloors(buildingFloors.length > 0 ? buildingFloors : floors);
    } else {
      // No specific associations found, show all floors
      setFilteredFloors(floors);
    }

    // Reset floor selection when building changes
    if (typeof onChange === 'function') {
      const resetEvent = { target: { name: 'floor_info', value: '' } };
      onChange(resetEvent);
    }
  }, [show, buildings, floors, formData.building_info, serialNumbers, onChange]);

  // Handle cascading dropdowns - filter departments based on selected floor (and building)
  useEffect(() => {
    // Only run logic when modal is shown
    if (!show) return;

    if (!departments || departments.length === 0) {
      setFilteredDepartments([]);
      return;
    }

    const selectedFloorName = formData.floor_info;
    const selectedBuildingName = formData.building_info;

    if (!selectedFloorName && !selectedBuildingName) {
      // Neither floor nor building selected, show all departments
      setFilteredDepartments(departments);
      return;
    }

    // If we have a floor selected, find departments that have serial numbers on that floor
    if (selectedFloorName) {
      // Find the floor reference to get its ID
      const floorRef = floors.find(f => f.floor_name === selectedFloorName);
      if (!floorRef) {
        setFilteredDepartments(departments);
        return;
      }

      // Find serial numbers that match this floor and get their departments
      // Try to use ID fields first, fall back to text fields
      let hasIdFields = serialNumbers.length > 0 &&
                       serialNumbers[0].floor_id !== undefined &&
                       serialNumbers[0].dept_id !== undefined;

      let deptIdsFromFloor = [];
      let deptNamesFromFloor = [];

      if (hasIdFields) {
        // Use ID fields
        deptIdsFromFloor = serialNumbers
          .filter(sn =>
            sn.floor_id === floorRef.id &&
            sn.dept_id !== null &&
            sn.dept_id !== undefined
          )
          .map(sn => sn.dept_id)
          .filter(id => id !== null);
      } else {
        // Fall back to text fields
        deptNamesFromFloor = serialNumbers
          .filter(sn =>
            sn.floor === selectedFloorName &&
            sn.dept_used !== null &&
            sn.dept_used !== undefined &&
            sn.dept_used.trim() !== ''
          )
          .map(sn => sn.dept_used.trim());
      }

      // Get unique values
      const uniqueDeptIdsFromFloor = [...new Set(deptIdsFromFloor)];
      const uniqueDeptNamesFromFloor = [...new Set(deptNamesFromFloor)];

      // Get department references
      let filteredDepts = [];
      if (hasIdFields && uniqueDeptIdsFromFloor.length > 0) {
        filteredDepts = departments.filter(dept =>
          uniqueDeptIdsFromFloor.includes(dept.id)
        );
      } else if (!hasIdFields && uniqueDeptNamesFromFloor.length > 0) {
        filteredDepts = departments.filter(dept =>
          uniqueDeptNamesFromFloor.includes(dept.name)
        );
      }

      setFilteredDepartments(filteredDepts.length > 0 ? filteredDepts : departments);
      return;
    }

    // If we have only a building selected, find departments that have serial numbers in that building
    if (selectedBuildingName) {
      // Find the building reference to get its ID
      const buildingRef = buildings.find(b => b.name === selectedBuildingName);
      if (!buildingRef) {
        setFilteredDepartments(departments);
        return;
      }

      // Find serial numbers that match this building and get their departments
      // Try to use ID fields first, fall back to text fields
      let hasIdFields = serialNumbers.length > 0 &&
                       serialNumbers[0].building_id !== undefined &&
                       serialNumbers[0].dept_id !== undefined;

      let deptIdsFromBuilding = [];
      let deptNamesFromBuilding = [];

      if (hasIdFields) {
        // Use ID fields
        deptIdsFromBuilding = serialNumbers
          .filter(sn =>
            sn.building_id === buildingRef.id &&
            sn.dept_id !== null &&
            sn.dept_id !== undefined
          )
          .map(sn => sn.dept_id)
          .filter(id => id !== null);
      } else {
        // Fall back to text fields
        deptNamesFromBuilding = serialNumbers
          .filter(sn =>
            sn.building === selectedBuildingName &&
            sn.dept_used !== null &&
            sn.dept_used !== undefined &&
            sn.dept_used.trim() !== ''
          )
          .map(sn => sn.dept_used.trim());
      }

      // Get unique values
      const uniqueDeptIdsFromBuilding = [...new Set(deptIdsFromBuilding)];
      const uniqueDeptNamesFromBuilding = [...new Set(deptNamesFromBuilding)];

      // Get department references
      let filteredDepts = [];
      if (hasIdFields && uniqueDeptIdsFromBuilding.length > 0) {
        filteredDepts = departments.filter(dept =>
          uniqueDeptIdsFromBuilding.includes(dept.id)
        );
      } else if (!hasIdFields && uniqueDeptNamesFromBuilding.length > 0) {
        filteredDepts = departments.filter(dept =>
          uniqueDeptNamesFromBuilding.includes(dept.name)
        );
      }

      // ONLY show departments that are actually associated with the selected building
      // If no associations found, show empty list instead of all departments
      setFilteredDepartments(filteredDepts);
      return;
    }

    // Default case
    setFilteredDepartments(departments);
  }, [show, departments, serialNumbers, floors, buildings, formData.floor_info, formData.building_info]);

  // Reset department selection when floor changes
  useEffect(() => {
    // Only run logic when modal is shown
    if (!show) return;

    if (typeof onChange === 'function') {
      const resetEvent = { target: { name: 'dept_info', value: '' } };
      onChange(resetEvent);
    }
  }, [show, formData.floor_info, onChange]);

  // Conditionally render the modal
  if (!show) return null;

  return (
    <div className={`modal fade ${show ? 'show' : ''}`} tabIndex="-1" aria-hidden={!show} style={{ display: 'block' }}>
      <div className="modal-dialog modal-dialog-centered">
        <form onSubmit={onSubmit} className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header border-0 pb-0 pt-4">
            <h5 className="fw-bold text-dark">บันทึกการเบิกอุปกรณ์</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body p-3">
            <input type="hidden" name="action" value="withdraw" />

            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <label className="form-label fw-bold">เลือกอุปกรณ์</label>
                <select
                  name="item_id"
                  id="item_select"
                  className="form-select"
                  required
                  value={formData.item_id}
                  onChange={onItemChange}
                >
                  <option value="">-- เลือกรายการ --</option>
                  {itemOptions}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold text-primary">เลข Job</label>
                <input
                  type="text"
                  name="job_number"
                  className="form-control"
                  placeholder="JOB6904001"
                  value={formData.job_number}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <label className="form-label fw-bold">ชื่อผู้เบิก</label>
                <input
                  type="text"
                  name="withdrawer"
                  className="form-control"
                  value={formData.withdrawer}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Serial Number</label>
                <select
                  name="serial_number"
                  id="sn_select"
                  className="form-select"
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
                <label className="form-label fw-bold">หน่วยงาน / แผนก</label>
                <select
                  name="dept_info"
                  className="form-select"
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
                <label className="form-label fw-bold">อาคาร</label>
                <select
                  name="building_info"
                  className="form-select"
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
                <label className="form-label fw-bold">ชั้น</label>
                <select
                  name="floor_info"
                  className="form-select"
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
          <div className="modal-footer border-0 pt-4 px-4 d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary fw-bold py-1 px-3 rounded-2"
              style={{ background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)', border: 'none' }}
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