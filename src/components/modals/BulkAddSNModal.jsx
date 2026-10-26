import React, { useMemo } from 'react';
import { Modal, Input, Select, Button, Badge } from '../../components/ui';
import { SN_STATUS_OPTIONS } from '../../constants/snForms';
import './BulkAddSNModal.css';

/**
 * Bulk Add SN Modal - Form for adding multiple serial numbers
 */
const BulkAddSNModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onChange,
  filteredFloors,
  filteredDepartments,
  buildings,
  isSubmitting = false,
}) => {
  const snCount = useMemo(() =>
    formData.serial_numbers
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0).length,
    [formData.serial_numbers]
  );

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="เพิ่มหมายเลขเครื่องหลายรายการ"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            ยกเลิก
          </Button>
          <Button variant="success" type="submit" disabled={isSubmitting} loading={isSubmitting} leftIcon={<i className="bi bi-plus-square me-1"></i>}>
            เพิ่มทั้งหมด
          </Button>
        </>
      }
    >
      <form onSubmit={onSubmit}>
        <Input
          name="serial_numbers"
          label="หมายเลขเครื่อง"
          placeholder="กรอกหมายเลขเครื่องทีละบรรทัด เช่น:\nSN001\nSN002\nSN003"
          value={formData.serial_numbers}
          onChange={onChange}
          required
          as="textarea"
          rows={6}
          helperText="แต่ละบรรทัด = 1 หมายเลขเครื่อง (ขั้นต่ำ 1 รายการ)"
        />

        <Input
          name="brand"
          label="ยี่ห้อ (ใช้ร่วมกันทั้งหมด)"
          placeholder="ระบุยี่ห้อ (ถ้ามี)..."
          value={formData.brand}
          onChange={onChange}
        />

        <Select
          name="status"
          label="สถานะ (ใช้ร่วมกันทั้งหมด)"
          value={formData.status}
          onChange={onChange}
          options={SN_STATUS_OPTIONS}
        />

        <Input
          name="job_number"
          label="เลข Job (ใช้ร่วมกันทั้งหมด)"
          value={formData.job_number}
          onChange={onChange}
        />

        <Input
          name="withdrawer_name"
          label="ชื่อผู้เบิก (ใช้ร่วมกันทั้งหมด)"
          value={formData.withdrawer_name}
          onChange={onChange}
        />

        <div className="form-grid-auto">
          <Select
            name="dept_used"
            label="แผนก (ใช้ร่วมกันทั้งหมด)"
            placeholder="-- เลือกแผนก --"
            value={formData.dept_used}
            onChange={onChange}
            options={[{ value: '', label: '-- เลือกแผนก --' }, ...filteredDepartments.map(d => ({ value: d.name, label: d.name }))]}
          />
          <Select
            name="building"
            label="อาคาร (ใช้ร่วมกันทั้งหมด)"
            placeholder="-- เลือกอาคาร --"
            value={formData.building}
            onChange={onChange}
            options={[{ value: '', label: '-- เลือกอาคาร --' }, ...buildings.map(b => ({ value: b.name, label: b.name }))]}
          />
        </div>

        <div className="form-grid-auto">
          <Select
            name="floor"
            label="ชั้น (ใช้ร่วมกันทั้งหมด)"
            placeholder="-- เลือกชั้น --"
            value={formData.floor}
            onChange={onChange}
            options={[{ value: '', label: '-- เลือกชั้น --' }, ...filteredFloors.map(f => ({ value: f.floor_name, label: f.floor_name }))]}
          />
          <Input
            name="receive_date"
            label="วันที่รับ (ใช้ร่วมกันทั้งหมด)"
            type="date"
            value={formData.receive_date}
            onChange={onChange}
          />
        </div>

        <Input
          name="withdraw_date"
          label="วันที่เบิก (ใช้ร่วมกันทั้งหมด)"
          type="date"
          value={formData.withdraw_date}
          onChange={onChange}
        />

        <div className="modal-info-box">
          <i className="bi bi-info-circle" aria-hidden="true"></i>
          <span>
            จะเพิ่มหมายเลขเครื่องจำนวน
            <Badge variant="info" size="md" className="ms-1">
              {snCount}
            </Badge> รายการ
          </span>
        </div>
      </form>
    </Modal>
  );
};

BulkAddSNModal.displayName = 'BulkAddSNModal';

export default BulkAddSNModal;