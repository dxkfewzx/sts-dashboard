import { useState, useEffect } from 'react';

/**
 * Hook สำหรับจัดการ cascading dropdowns (Building -> Floor -> Department)
 * ใช้ร่วมได้กับ Add SN, Edit SN, Bulk Add forms
 *
 * @param {Object} formState - form state ที่มี building, floor
 * @param {Array} departments - รายการแผนก (มี building_name, floor_name)
 * @param {Array} floors - รายการชั้น
 * @param {Function} setFormState - function สำหรับ reset floor/department
 * @returns {Object} { filteredFloors, filteredDepartments, handleBuildingChange }
 */
export function useCascadingDropdowns(formState, departments, floors, setFormState) {
  const [filteredFloors, setFilteredFloors] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  // Filter floors based on selected building
  useEffect(() => {
    if (!departments || departments.length === 0) {
      setFilteredFloors(floors);
      return;
    }

    const selectedBuilding = formState.building;
    if (!selectedBuilding) {
      setFilteredFloors(floors);
      return;
    }

    // Filter floors that have departments in this building
    const buildingFloors = [...new Set(
      departments
        .filter(d => d.building_name === selectedBuilding && d.floor_name)
        .map(d => d.floor_name)
    )].map((floor_name, index) => ({ id: index + 1, floor_name, building_name: selectedBuilding }));

    setFilteredFloors(buildingFloors.length > 0 ? buildingFloors : floors);

    // Reset floor selection when building changes
    if (setFormState) {
      setFormState(prev => ({ ...prev, floor: '' }));
    }
  }, [departments, floors, formState.building, setFormState]);

  // Filter departments based on selected building and floor
  useEffect(() => {
    if (!departments || departments.length === 0) {
      setFilteredDepartments([]);
      return;
    }

    const selectedFloor = formState.floor;
    const selectedBuilding = formState.building;

    if (!selectedFloor && !selectedBuilding) {
      setFilteredDepartments(departments);
      return;
    }

    let filteredDepts = departments;

    if (selectedBuilding) {
      filteredDepts = filteredDepts.filter(d => d.building_name === selectedBuilding);
    }

    if (selectedFloor) {
      filteredDepts = filteredDepts.filter(d => d.floor_name === selectedFloor);
    }

    setFilteredDepartments(filteredDepts.length > 0 ? filteredDepts : departments);
  }, [departments, formState.floor, formState.building]);

  // Reset department when floor changes
  useEffect(() => {
    if (setFormState) {
      setFormState(prev => ({ ...prev, dept_used: '' }));
    }
  }, [formState.floor, setFormState]);

  return {
    filteredFloors,
    filteredDepartments,
    setFilteredFloors,
    setFilteredDepartments,
  };
}

/**
 * Hook สำหรับดึง serial numbers ของ item
 */
export function useItemSerialNumbers(itemId, serialNumbers) {
  if (!itemId) return [];

  return serialNumbers
    .filter(sn => sn.item_id === itemId)
    .sort((a, b) => a.id - b.id);
}

/**
 * Hook สำหรับดึงประวัติของ serial number
 */
export function useSNHistory(snId, withdrawalLogs) {
  if (!snId || !withdrawalLogs) return [];

  return withdrawalLogs
    .filter(log => log.serial_number_id === snId)
    .sort((a, b) => new Date(b.performed_at) - new Date(a.performed_at));
}

/**
 * Hook สำหรับดึงประวัติของ item (ทั้งหมด)
 */
export function useItemHistory(itemSerialNumbers, withdrawalLogs) {
  if (!itemSerialNumbers || !withdrawalLogs) return [];

  const itemSNIds = itemSerialNumbers.map(sn => sn.id);
  return withdrawalLogs
    .filter(log => itemSNIds.includes(log.serial_number_id))
    .sort((a, b) => new Date(b.performed_at) - new Date(a.performed_at));
}