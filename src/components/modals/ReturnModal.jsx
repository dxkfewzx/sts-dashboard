import React from 'react';
import { Modal, Input, Select, Button } from '../../components/ui';
import { RETURN_CONDITION_OPTIONS } from '../../constants/snForms';
import './ReturnModal.css';

/**
 * Return Modal - Form for returning equipment
 */
const ReturnModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onChange,
  sn,
  isSubmitting = false,
}) => {
  if (!isOpen || !sn) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`รับคืนอุปกรณ์: ${sn.serial_number}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            ยกเลิก
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting} loading={isSubmitting}>
            ยืนยันการรับคืน
          </Button>
        </>
      }
    >
      <form onSubmit={onSubmit}>
        <Input
          name="receiver_name"
          label="ชื่อผู้รับคืน"
          placeholder="ระบุชื่อผู้รับคืน..."
          value={formData.receiver_name}
          onChange={onChange}
          required
          error={formData.receiver_name_error}
        />

        <Select
          name="return_condition"
          label="สภาพอุปกรณ์"
          placeholder="เลือกสภาพอุปกรณ์"
          value={formData.return_condition}
          onChange={onChange}
          required
          options={RETURN_CONDITION_OPTIONS}
          error={formData.return_condition_error}
        />

        <Input
          name="return_note"
          label="หมายเหตุ"
          placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)..."
          value={formData.return_note}
          onChange={onChange}
          as="textarea"
          rows={3}
        />

        <div className="ui-readonly-group">
          <div className="ui-readonly-group__label">
            ข้อมูลจากการเบิก (อ่านอย่างเดียว)
          </div>
          <div className="form-grid-auto">
            <Input
              name="job_number"
              label="เลข Job (จากการเบิก)"
              value={formData.job_number || '-'}
              readOnly
            />
            <Input
              name="dept_used"
              label="หน่วยงาน (จากการเบิก)"
              value={formData.dept_used || '-'}
              readOnly
            />
            <Input
              name="building"
              label="อาคาร (จากการเบิก)"
              value={formData.building || '-'}
              readOnly
            />
            <Input
              name="floor"
              label="ชั้น (จากการเบิก)"
              value={formData.floor || '-'}
              readOnly
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

ReturnModal.displayName = 'ReturnModal';

export default ReturnModal;