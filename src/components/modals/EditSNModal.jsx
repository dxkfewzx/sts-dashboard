import React from 'react';
import { SN_STATUS_OPTIONS } from '../../constants/snForms';

const EditSNModal = ({
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
  if (!show || !formData) return null;

  return (
    <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }} aria-hidden="false">
      <div className="modal-dialog modal-dialog-centered">
        <form onSubmit={onSubmit} className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header border-0 p-4 pb-0">
            <h5 className="modal-title fw-bold">แก้ไขหมายเลขเครื่อง</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body p-4">
            <div className="mb-3">
              <label className="form-label small fw-bold">หมายเลขเครื่อง <span className="text-danger">*</span></label>
              <input
                type="text"
                name="serial_number"
                className="form-control border-0 bg-light p-3 rounded-3"
                value={formData.serial_number}
                onChange={onChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">ยี่ห้อ</label>
              <input
                type="text"
                name="brand"
                className="form-control border-0 bg-light p-3 rounded-3"
                value={formData.brand}
                onChange={onChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">สถานะ</label>
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
              <label className="form-label small fw-bold">เลข Job</label>
              <input
                type="text"
                name="job_number"
                className="form-control border-0 bg-light p-3 rounded-3"
                value={formData.job_number}
                onChange={onChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">ชื่อผู้เบิก</label>
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
                <label className="form-label small fw-bold">แผนก</label>
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
                <label className="form-label small fw-bold">อาคาร</label>
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
                <label className="form-label small fw-bold">ชั้น</label>
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
                <label className="form-label small fw-bold">วันที่รับ</label>
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
              <label className="form-label small fw-bold">วันที่เบิก</label>
              <input
                type="date"
                name="withdraw_date"
                className="form-control border-0 bg-light p-3 rounded-3"
                value={formData.withdraw_date}
                onChange={onChange}
              />
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
                'บันทึกการแก้ไข'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSNModal;