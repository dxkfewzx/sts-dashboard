import React from 'react';

const WithdrawModal = ({ show, onHide, items, serialNumbers, onItemChange, onSNChange, onChange, onSubmit, formData, selectedItemId, availableSerialNumbers }) => {
  if (!show) return null;

  // Populate item options
  const itemOptions = items.map(item => (
    <option key={item.id} value={item.id}>
      {item.item_name}
    </option>
  ));

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