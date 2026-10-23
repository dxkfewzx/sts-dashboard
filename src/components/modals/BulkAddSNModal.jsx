import React from 'react';
import { INITIAL_BULK_FORM, SN_STATUS_OPTIONS } from '../../constants/snForms';

const BulkAddSNModal = ({
  show,
  onHide,
  onSubmit,
  formData,
  onChange,
  filteredFloors,
  filteredDepartments,
  buildings,
  isSubmitting = false,
}) => {
  if (!show) return null;

  const snCount = formData.serial_numbers
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0).length;

  return (
    <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }} aria-hidden="false">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <form onSubmit={onSubmit} className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header border-0 p-4 pb-0">
            <h5 className="modal-title fw-bold">เพิ่มหมายเลขเครื่องหลายรายการ</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body p-4">
            <div className="mb-3">
              <label className="form-label small fw-bold">หมายเลขเครื่อง <span className="text-danger">*</span></label>
              <textarea
                name="serial_numbers"
                className="form-control border-0 bg-light p-3 rounded-3"
                rows="6"
                placeholder="กรอกหมายเลขเครื่องทีละบรรทัด เช่น:
SN001
SN002
SN003"
                value={formData.serial_numbers}
                onChange={onChange}
                required
              />
              <div className="form-text">แต่ละบรรทัด = 1 หมายเลขเครื่อง (ขั้นต่ำ 1 รายการ)</div>
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">ยี่ห้อ (ใช้ร่วมกันทั้งหมด)</label>
              <input
                type="text"
                name="brand"
                className="form-control border-0 bg-light p-3 rounded-3"
                placeholder="ระบุยี่ห้อ (ถ้ามี)..."
                value={formData.brand}
                onChange={onChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">สถานะ (ใช้ร่วมกันทั้งหมด)</label>
              <select
                name="status"
                className="form-select border-0 bg-light p-3 rounded-3"
                value={formData.status}
                onChange={onChange}
              >
                {SN_STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">เลข Job (ใช้ร่วมกันทั้งหมด)</label>
              <input
                type="text"
                name="job_number"
                className="form-control border-0 bg-light p-3 rounded-3"
                value={formData.job_number}
                onChange={onChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">ชื่อผู้เบิก (ใช้ร่วมกันทั้งหมด)</label>
              <input
                type="text"
                name="withdrawer_name"
                className="form-control border-0 bg-light p-3 rounded-3"
                value={formData.withdrawer_name}
                onChange={onChange}
              />
            </div>
            <div className="row g-2">
              <div className="col-md-6 mb-3">
                <label className="form-label small fw-bold">แผนก (ใช้ร่วมกันทั้งหมด)</label>
                <select
                  name="dept_used"
                  className="form-select border-0 bg-light p-3 rounded-3"
                  value={formData.dept_used}
                  onChange={onChange}
                >
                  <option value="">-- เลือกแผนก --</option>
                  {filteredDepartments.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label small fw-bold">อาคาร (ใช้ร่วมกันทั้งหมด)</label>
                <select
                  name="building"
                  className="form-select border-0 bg-light p-3 rounded-3"
                  value={formData.building}
                  onChange={onChange}
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
                <label className="form-label small fw-bold">ชั้น (ใช้ร่วมกันทั้งหมด)</label>
                <select
                  name="floor"
                  className="form-select border-0 bg-light p-3 rounded-3"
                  value={formData.floor}
                  onChange={onChange}
                >
                  <option value="">-- เลือกชั้น --</option>
                  {filteredFloors.map(floor => (
                    <option key={floor.id} value={floor.floor_name}>{floor.floor_name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label small fw-bold">วันที่รับ (ใช้ร่วมกันทั้งหมด)</label>
                <input
                  type="date"
                  name="receive_date"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  value={formData.receive_date}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">วันที่เบิก (ใช้ร่วมกันทั้งหมด)</label>
              <input
                type="date"
                name="withdraw_date"
                className="form-control border-0 bg-light p-3 rounded-3"
                value={formData.withdraw_date}
                onChange={onChange}
              />
            </div>
            <div className="alert alert-info small mb-0">
              <i className="bi bi-info-circle me-1"></i>
              จะเพิ่มหมายเลขเครื่องจำนวน {snCount} รายการ
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
              className="btn btn-success px-4 py-2 rounded-3 fw-bold shadow-sm border-0"
              style={{ background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="d-flex align-items-center gap-2">
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  กำลังเพิ่ม...
                </span>
              ) : (
                <><i className="bi bi-plus-square me-1"></i> เพิ่มทั้งหมด</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkAddSNModal;