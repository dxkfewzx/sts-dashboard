import React from 'react';
import { Modal, Input, Select, Button } from '../../components/ui';
import { SN_STATUS_OPTIONS } from '../../constants/snForms';

/**
 * Edit SN Modal - Form for editing serial number
 */
const EditSNModal = ({
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
  if (!isOpen || !formData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="แก้ไขหมายเลขเครื่อง"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            ยกเลิก
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting} loading={isSubmitting}>
            บันทึกการแก้ไข
          </Button>
        </>
      }
    >
      <form onSubmit={onSubmit}>
        <Input
          name="serial_number"
          label="หมายเลขเครื่อง"
          value={formData.serial_number}
          onChange={onChange}
          required
          error={formData.serial_number_error}
        />

        <Input
          name="brand"
          label="ยี่ห้อ"
          placeholder="ระบุยี่ห้อ (ถ้ามี)..."
          value={formData.brand}
          onChange={onChange}
        />

        <Select
          name="status"
          label="สถานะ"
          value={formData.status}
          onChange={onChange}
          options={SN_STATUS_OPTIONS}
        />

        <Input
          name="job_number"
          label="เลข Job"
          value={formData.job_number}
          onChange={onChange}
        />

        <Input
          name="withdrawer_name"
          label="ชื่อผู้เบิก"
          value={formData.withdrawer_name}
          onChange={onChange}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
          <Select
            name="dept_used"
            label="แผนก"
            placeholder="-- เลือกแผนก --"
            value={formData.dept_used}
            onChange={onChange}
            options={[{ value: '', label: '-- เลือกแผนก --' }, ...filteredDepartments.map(d => ({ value: d.name, label: d.name }))]}
          />
          <Select
            name="building"
            label="อาคาร"
            placeholder="-- เลือกอาคาร --"
            value={formData.building}
            onChange={onChange}
            options={[{ value: '', label: '-- เลือกอาคาร --' }, ...buildings.map(b => ({ value: b.name, label: b.name }))]}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
          <Select
            name="floor"
            label="ชั้น"
            placeholder="-- เลือกชั้น --"
            value={formData.floor}
            onChange={onChange}
            options={[{ value: '', label: '-- เลือกชั้น --' }, ...filteredFloors.map(f => ({ value: f.floor_name, label: f.floor_name }))]}
          />
          <Input
            name="receive_date"
            label="วันที่รับ"
            type="date"
            value={formData.receive_date}
            onChange={onChange}
          />
        </div>

        <Input
          name="withdraw_date"
          label="วันที่เบิก"
          type="date"
          value={formData.withdraw_date}
          onChange={onChange}
        />
      </form>
    </Modal>
  );
};

EditSNModal.displayName = 'EditSNModal';

export default EditSNModal;