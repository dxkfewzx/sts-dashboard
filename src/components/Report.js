import React from 'react';

const Report = ({ items, serialNumbers, repairs, onAddItem, onUpdateItem, onDeleteItem, onAddSerialNumber, onUpdateSerialNumber, onDeleteSerialNumber, onAddRepair, onUpdateRepair, onDeleteRepair }) => {
  // Calculate statistics
  const totalItems = items.length;
  const totalSerialNumbers = serialNumbers.length;
  const availableSN = serialNumbers.filter(sn => sn.status === 'Available').length;
  const withdrawnSN = serialNumbers.filter(sn => sn.status === 'Withdrawn').length;
  const repairSN = serialNumbers.filter(sn => sn.status === 'Repair').length;
  const totalRepairs = repairs.length;
  const pendingRepairs = repairs.filter(r => r.status === 'Pending').length;
  const repairingRepairs = repairs.filter(r => r.status === 'Repairing').length;
  const fixedRepairs = repairs.filter(r => r.status === 'Fixed').length;
  const returnedRepairs = repairs.filter(r => r.status === 'Returned').length;

  // Calculate items with low stock (less than 3 remaining)
  const lowStockItems = items.filter(item => {
    const withdrawn = serialNumbers.filter(sn => sn.item_id === item.id && sn.status === 'Withdrawn').length;
    const remaining = item.total_qty - withdrawn;
    return remaining < 3 && remaining >= 0;
  }).length;

  return (
    <div>
      <div className="inventory-card">
        <div className="page-header">
          <div className="header-title">
            <h4>รายงานสรุป</h4>
            <p>ภาพรวมสถานะคลังอุปกรณ์และการแจ้งซ่อม</p>
          </div>
        </div>

        <div className="row g-4">
          {/* Inventory Statistics */}
          <div className="col-md-3">
            <div className="content-card text-center">
              <div className="h5 mb-3"><i className="bi bi-boxes text-primary"></i></div>
              <h6 className="mb-2">รายการอุปกรณ์</h6>
              <p className="fs-4 fw-bold text-primary">{totalItems}</p>
              <small className="text-muted">ประเภทวัสดุ</small>
            </div>
          </div>

          <div className="col-md-3">
            <div className="content-card text-center">
              <div className="h5 mb-3"><i className="bi bi-hdd-stack text-info"></i></div>
              <h6 className="mb-2">จำนวนหมายเลขเครื่อง</h6>
              <p className="fs-4 fw-bold text-info">{totalSerialNumbers}</p>
              <small className="text-muted">SN ทั้งหมดในระบบ</small>
            </div>
          </div>

          <div className="col-md-3">
            <div className="content-card text-center">
              <div className="h5 mb-3"><i className="bi bi-check-circle text-success"></i></div>
              <h6 className="mb-2">คงเหลือในสต็อก</h6>
              <p className="fs-4 fw-bold text-success">{availableSN}</p>
              <small className="text-muted">พร้อมใช้งาน</small>
            </div>
          </div>

          <div className="col-md-3">
            <div className="content-card text-center">
              <div className="h5 mb-3"><i className="bi bi-box-arrow-in-right text-warning"></i></div>
              <h6 className="mb-2">เบิกออกไป</h6>
              <p className="fs-4 fw-bold text-warning">{withdrawnSN}</p>
              <small className="text-muted">ไม่อยู่ในสต็อก</small>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-4">
          <div className="col-md-3">
            <div className="content-card text-center">
              <div className="h5 mb-3"><i className="bi bi-wrench text-danger"></i></div>
              <h6 className="mb-2">อยู่ระหว่างซ่อม</h6>
              <p className="fs-4 fw-bold text-danger">{repairSN}</p>
              <small className="text-muted">สถานะซ่อมแซม</small>
            </div>
          </div>

          <div className="col-md-3">
            <div className="content-card text-center">
              <div className="h5 mb-3"><i className="bi bi-exclamation-triangle text-danger"></i></div>
              <h6 className="mb-2">สินค้าคงเหลือน้อย</h6>
              <p className="fs-4 fw-bold text-danger">{lowStockItems}</p>
              <small className="text-muted">ต่ำกว่า 3 หน่วย</small>
            </div>
          </div>

          <div className="col-md-3">
            <div className="content-card text-center">
              <div className="h5 mb-3"><i className="bi bi-tools text-info"></i></div>
              <h6 className="mb-2">การแจ้งซ่อม</h6>
              <p className="fs-4 fw-bold text-info">{totalRepairs}</p>
              <small className="text-muted">รายการทั้งหมด</small>
            </div>
          </div>

          <div className="col-md-3">
            <div className="content-card text-center">
              <div className="h5 mb-3"><i className="bi bi-clock-history text-secondary"></i></div>
              <h6 className="mb-2">รอซ่อม</h6>
              <p className="fs-4 fw-bold text-secondary">{pendingRepairs}</p>
              <small className="text-muted">สถานะ Pending</small>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-4">
          <div className="col-md-3">
            <div className="content-card text-center">
              <div className="h5 mb-3"><i className="bi bi-tools text-success"></i></div>
              <h6 className="mb-2">กำลังซ่อม</h6>
              <p className="fs-4 fw-bold text-success">{repairingRepairs}</p>
              <small className="text-muted">สถานะ Repairing</small>
            </div>
          </div>

          <div className="col-md-3">
            <div className="content-card text-center">
              <div className="h5 mb-3"><i className="bi bi-check-circle text-success"></i></div>
              <h6 className="mb-2">ซ่อมเสร็จ</h6>
              <p className="fs-4 fw-bold text-success">{fixedRepairs}</p>
              <small className="text-muted">สถานะ Fixed</small>
            </div>
          </div>

          <div className="col-md-3">
            <div className="content-card text-center">
              <div className="h5 mb-3"><i className="bi bi-arrow-return-right text-success"></i></div>
              <h6 className="mb-2">ส่งคืนแล้ว</h6>
              <p className="fs-4 fw-bold text-success">{returnedRepairs}</p>
              <small className="text-muted">สถานะ Returned</small>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="mt-5">
        <h4 className="mb-4">รายละเอียดการแจ้งซ่อม</h4>
        {repairs.length === 0 ? (
          <p className="text-center text-muted py-4">ยังไม่มีข้อมูลการแจ้งซ่อมในระบบ</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ชื่ออุปกรณ์ / SN</th>
                  <th>อาการเสีย</th>
                  <th>สถานะ</th>
                  <th>วันที่แจ้ง</th>
                  <th>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {repairs.map((repair, index) => (
                  <tr key={repair.id}>
                    <td className="text-muted fw-bold">{String(index + 1).padStart(2, '0')}</td>
                    <td>{repair.device_name}</td>
                    <td>{repair.symptom || '-'}</td>
                    <td>
                      <span className={`badge-soft ${getStatusBadgeClass(repair.status)}`}>
                        {getStatusText(repair.status)}
                      </span>
                    </td>
                    <td className="text-muted small">
                      {new Date(repair.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn-action btn-edit"
                          data-id={repair.id}
                          data-name={repair.device_name}
                          data-symptom={repair.symptom || ''}
                          data-status={repair.status}
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button
                          className="btn-action btn-del"
                          data-id={repair.id}
                          data-name={repair.device_name}
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
  );
};

// Helper functions for status badges
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Pending': return 'bg-secondary';
    case 'Repairing': return 'bg-warning';
    case 'Fixed': return 'bg-success';
    case 'Returned': return 'bg-info';
    default: return 'bg-light';
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

export default Report;