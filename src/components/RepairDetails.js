import React, { useState } from 'react';

const RepairDetails = ({ repairs, onAddRepair, onUpdateRepair, onDeleteRepair }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRepair, setEditRepair] = useState(null);

  // Form state for add repair
  const [addForm, setAddForm] = useState({
    device_name: '',
    symptom: '',
    status: 'Pending'
  });

  // Calculate repair statistics
  const totalRepairs = repairs.length;
  const pendingRepairs = repairs.filter(r => r.status === 'Pending').length;
  const repairingRepairs = repairs.filter(r => r.status === 'Repairing').length;
  const fixedRepairs = repairs.filter(r => r.status === 'Fixed').length;
  const returnedRepairs = repairs.filter(r => r.status === 'Returned').length;

  // Handle input changes for add form
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle input changes for edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRepair(prev => ({ ...prev, [name]: value }));
  };

  // Handle add repair submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const { device_name, symptom, status } = addForm;

    if (!device_name || !symptom) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      await onAddRepair({
        device_name,
        symptom,
        status: status || 'Pending',
        created_at: new Date().toISOString()
      });
      setAddForm({
        device_name: '',
        symptom: '',
        status: 'Pending'
      });
      setShowAddModal(false);
      alert('เพิ่มสำเร็จ!');
    } catch (error) {
      console.error('Error adding repair:', error);
      alert('เกิดข้อผิดพลาดในการเพิ่มรายการซ่อม');
    }
  };

  // Handle edit repair submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editRepair) return;

    const { id, device_name, symptom, status } = editRepair;

    if (!device_name || !symptom) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      await onUpdateRepair(id, {
        device_name,
        symptom,
        status
      });
      setShowEditModal(false);
      alert('แก้ไขสำเร็จ!');
    } catch (error) {
      console.error('Error updating repair:', error);
      alert('เกิดข้อผิดพลาดในการแก้ไขรายการซ่อม');
    }
  };

  // Handle delete repair
  const handleDeleteRepair = async (id, name) => {
    if (window.confirm(`คุณต้องการลบรายการซ่อม "${name}" หรือไม่?`)) {
      try {
        await onDeleteRepair(id);
        alert('ลบสำเร็จ!');
      } catch (error) {
        console.error('Error deleting repair:', error);
        alert('เกิดข้อผิดพลาดในการลบรายการซ่อม');
      }
    }
  };

  const statsCards = [
    { label: 'การแจ้งซ่อม', value: totalRepairs, icon: 'bi-tools', iconColor: 'info', iconBg: 'info-light' },
    { label: 'รอซ่อม', value: pendingRepairs, icon: 'bi-clock-history', iconColor: 'secondary', iconBg: 'secondary-light' },
    { label: 'กำลังซ่อม', value: repairingRepairs, icon: 'bi-tools', iconColor: 'warning', iconBg: 'warning-light' },
    { label: 'ซ่อมเสร็จ', value: fixedRepairs, icon: 'bi-check-circle-fill', iconColor: 'success', iconBg: 'success-light' },
  ];

  return (
    <div>
      {/* Overview Cards */}
      <div className="row g-3 mb-4">
        {statsCards.map((stat, index) => (
          <div key={index} className="col-6 col-md-3">
            <div className="stat-card">
              <div className={`stat-card-icon bg-${stat.iconBg} text-${stat.iconColor}`}>
                <i className={`bi ${stat.icon}`}></i>
              </div>
              <div className={`stat-card-value text-${stat.iconColor}`}>{stat.value}</div>
              <div className="stat-card-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="header-title">
            <h4>ประวัติแจ้งซ่อม</h4>
            <p>บันทึกและติดตามการแจ้งซ่อมอุปกรณ์</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-plus-lg me-2"></i>
            <span className="fw-medium">เพิ่มการแจ้งซ่อม</span>
          </button>
        </div>
        <div className="card-body p-0">
          {repairs.length === 0 ? (
            <div className="text-center text-muted py-4">
              ยังไม่มีข้อมูลการแจ้งซ่อมในระบบ
            </div>
          ) : (
            <div className="table-container">
              <table className="table table-striped mb-0">
                <thead>
                  <tr>
                    <th style={{ width: '50px', minWidth: '50px' }}>#</th>
                    <th>ชื่ออุปกรณ์ / SN</th>
                    <th>อาการเสีย</th>
                    <th style={{ width: '140px', minWidth: '120px' }}>สถานะ</th>
                    <th style={{ width: '140px', minWidth: '120px' }}>วันที่แจ้ง</th>
                    <th style={{ width: '120px', minWidth: '110px' }}>การจัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {repairs.map((repair, index) => (
                    <tr key={repair.id}>
                      <td className="text-muted fw-bold">{String(index + 1).padStart(2, '0')}</td>
                      <td>{repair.device_name}</td>
                      <td>{repair.symptom || '-'}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(repair.status)}`} style={{ whiteSpace: 'nowrap' }}>
                          {getStatusText(repair.status)}
                        </span>
                      </td>
                      <td className="text-muted small">
                        {new Date(repair.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-1">
                          <button
                            className="btn-action btn-edit"
                            onClick={() => {
                              setEditRepair({
                                id: repair.id,
                                device_name: repair.device_name,
                                symptom: repair.symptom,
                                status: repair.status
                              });
                              setShowEditModal(true);
                            }}
                            title="แก้ไข"
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button
                            className="btn-action btn-delete"
                            onClick={() => handleDeleteRepair(repair.id, repair.device_name)}
                            title="ลบ"
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Repair Modal */}
      <div
        className={`modal fade ${showAddModal ? 'show' : ''}`}
        tabIndex="-1"
        aria-hidden={!showAddModal}
        style={{ display: showAddModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <form onSubmit={handleAddSubmit} className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-0 p-4 pb-0">
              <h5 className="modal-title fw-bold">เพิ่มการแจ้งซ่อม</h5>
              <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
            </div>
            <div className="modal-body p-4">
              <input type="hidden" name="action" value="add_repair" />
              <div className="mb-3">
                <label className="form-label small fw-bold">ชื่ออุปกรณ์ / SN</label>
                <input
                  type="text"
                  name="device_name"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  placeholder="ระบุชื่ออุปกรณ์หรือหมายเลขเครื่อง..."
                  value={addForm.device_name}
                  onChange={handleAddChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">อาการเสีย</label>
                <input
                  type="text"
                  name="symptom"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  placeholder="อธิบายอาการเสีย..."
                  value={addForm.symptom}
                  onChange={handleAddChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">สถานะ</label>
                <select
                  name="status"
                  className="form-select border-0 bg-light p-3 rounded-3"
                  value={addForm.status}
                  onChange={handleAddChange}
                >
                  <option value="Pending">รอซ่อม</option>
                  <option value="Repairing">กำลังซ่อม</option>
                  <option value="Fixed">ซ่อมเสร็จ</option>
                  <option value="Returned">ส่งคืนแล้ว</option>
                </select>
              </div>
            </div>
            <div className="modal-footer border-0 p-4 pt-0">
              <button
                type="button"
                className="btn btn-light px-4 py-2 rounded-3 fw-bold"
                onClick={() => setShowAddModal(false)}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="btn btn-primary px-4 py-2 rounded-3 fw-bold shadow-sm border-0"
              >
                บันทึกข้อมูล
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Edit Repair Modal */}
      <div
        className={`modal fade ${showEditModal ? 'show' : ''}`}
        tabIndex="-1"
        aria-hidden={!showEditModal}
        style={{ display: showEditModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <form onSubmit={handleEditSubmit} className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-0 p-4 pb-0">
              <h5 className="modal-title fw-bold">แก้ไขการแจ้งซ่อม</h5>
              <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
            </div>
            <div className="modal-body p-4">
              <input type="hidden" name="action" value="edit_repair" />
              <input type="hidden" name="repair_id" id="edit_id" />
              <div className="mb-3">
                <label className="form-label small fw-bold">ชื่ออุปกรณ์ / SN</label>
                <input
                  type="text"
                  name="device_name"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  id="edit_device_name"
                  value={editRepair?.device_name || ''}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">อาการเสีย</label>
                <input
                  type="text"
                  name="symptom"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  id="edit_symptom"
                  value={editRepair?.symptom || ''}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">สถานะ</label>
                <select
                  name="status"
                  className="form-select border-0 bg-light p-3 rounded-3"
                  id="edit_status"
                  value={editRepair?.status || ''}
                  onChange={handleEditChange}
                >
                  <option value="Pending">รอซ่อม</option>
                  <option value="Repairing">กำลังซ่อม</option>
                  <option value="Fixed">ซ่อมเสร็จ</option>
                  <option value="Returned">ส่งคืนแล้ว</option>
                </select>
              </div>
            </div>
            <div className="modal-footer border-0 p-4 pt-0">
              <button
                type="button"
                className="btn btn-light px-4 py-2 rounded-3 fw-bold"
                onClick={() => setShowEditModal(false)}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="btn btn-primary px-4 py-2 rounded-3 fw-bold shadow-sm border-0"
              >
                บันทึกการแก้ไข
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Helper functions for status badges
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Pending': return 'badge-secondary';
    case 'Repairing': return 'badge-warning';
    case 'Fixed': return 'badge-success';
    case 'Returned': return 'badge-info';
    default: return 'badge-light';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'Pending': return 'รอซ่อม';
    case 'Repairing': return 'กำลังซ่อม';
    case 'Fixed': return 'ซ่อมเสร็จ';
    case 'Returned': return 'ส่งคืนแล้ว';
    default: return status;
  }
};

export default RepairDetails;