import React from 'react';
import { RETURN_CONDITION_OPTIONS } from '../../constants/snForms';

const ReturnModal = ({
  show,
  onHide,
  onSubmit,
  formData,
  onChange,
  sn,
  isSubmitting = false,
}) => {
  if (!show || !sn) return null;

  return (
    <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }} aria-hidden="false">
      <div className="modal-dialog modal-dialog-centered">
        <form onSubmit={onSubmit} className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header border-0 p-4 pb-0">
            <h5 className="modal-title fw-bold">รับคืนอุปกรณ์: {sn.serial_number}</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body p-4">
            <div className="mb-3">
              <label className="form-label small fw-bold">ชื่อผู้รับคืน <span className="text-danger">*</span></label>
              <input
                type="text"
                name="receiver_name"
                className="form-control border-0 bg-light p-3 rounded-3"
                placeholder="ระบุชื่อผู้รับคืน..."
                value={formData.receiver_name}
                onChange={onChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">สภาพอุปกรณ์ <span className="text-danger">*</span></label>
              <select
                name="return_condition"
                className="form-select border-0 bg-light p-3 rounded-3"
                value={formData.return_condition}
                onChange={onChange}
                required
              >
                {RETURN_CONDITION_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">หมายเหตุ</label>
              <textarea
                name="return_note"
                className="form-control border-0 bg-light p-3 rounded-3"
                rows="3"
                placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)..."
                value={formData.return_note}
                onChange={onChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">เลข Job (จากการเบิก)</label>
              <input
                type="text"
                className="form-control border-0 bg-light p-3 rounded-3"
                value={formData.job_number || '-'}
                readOnly
              />
            </div>
            <div className="row g-2">
              <div className="col-md-6 mb-3">
                <label className="form-label small fw-bold">หน่วยงาน (จากการเบิก)</label>
                <input
                  type="text"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  value={formData.dept_used || '-'}
                  readOnly
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label small fw-bold">อาคาร (จากการเบิก)</label>
                <input
                  type="text"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  value={formData.building || '-'}
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
                  value={formData.floor || '-'}
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="modal-footer border-0 p-4 pt-0">
            <button
              type="button"
              className="btn btn-light px-4 py-2 rounded-3 fw-bold"
              onClick={onHide}
              disabled={isSubmitting}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="btn btn-primary px-4 py-2 rounded-3 fw-bold shadow-sm border-0"
              style={{ background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="d-flex align-items-center gap-2">
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  กำลังบันทึก...
                </span>
              ) : (
                'ยืนยันการรับคืน'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnModal;