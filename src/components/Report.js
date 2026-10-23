import React from 'react';

const Report = ({ items, serialNumbers, repairs, withdrawalLogs, onAddItem, onUpdateItem, onDeleteItem, onAddSerialNumber, onUpdateSerialNumber, onDeleteSerialNumber, onAddRepair, onUpdateRepair, onDeleteRepair, onWithdraw, onReturn }) => {
  // Calculate statistics
  const totalItems = items.length;
  const availableSN = serialNumbers.filter(sn => sn.status === 'Available').length;
  const withdrawnSN = serialNumbers.filter(sn => sn.status === 'Withdrawn').length;

  // Calculate items with low stock (less than 3 remaining)
  const lowStockItems = items.filter(item => {
    const withdrawn = serialNumbers.filter(sn => sn.item_id === item.id && sn.status === 'Withdrawn').length;
    const remaining = item.total_qty - withdrawn;
    return remaining < 3 && remaining >= 0;
  }).length;

  // Get withdrawn serial numbers (equipment withdrawal data)
  const withdrawnSerialNumbers = serialNumbers
    .filter(sn => sn.status === 'Withdrawn')
    .sort((a, b) => new Date(b.withdraw_date || b.created_at) - new Date(a.withdraw_date || a.created_at));

  // Get item name from item_id
  const getItemName = (itemId) => {
    const item = items.find(i => i.id === itemId);
    return item ? item.item_name : 'ไม่ระบุ';
  };

  const statsCards = [
    { label: 'รายการอุปกรณ์', value: totalItems, icon: 'bi-boxes', iconColor: 'primary', iconBg: 'primary-light' },
    { label: 'คงเหลือในสต็อก', value: availableSN, icon: 'bi-check-circle-fill', iconColor: 'success', iconBg: 'success-light' },
    { label: 'เบิกออก', value: withdrawnSN, icon: 'bi-box-arrow-right', iconColor: 'warning', iconBg: 'warning-light' },
    { label: 'สินค้าคงเหลือน้อย', value: lowStockItems, icon: 'bi-exclamation-triangle-fill', iconColor: 'danger', iconBg: 'danger-light' },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="header-title">
          <h4>รายงานสรุป</h4>
          <p>ภาพรวมสถานะคลังอุปกรณ์และการเบิกจ่าย</p>
        </div>
      </div>

      {/* Stats Cards */}
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

      {/* Withdrawal Details Table */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">รายละเอียดการเบิกอุปกรณ์</h5>
          <span className="badge badge-secondary">{withdrawnSerialNumbers.length} รายการ</span>
        </div>
        <div className="card-body p-0">
          {withdrawnSerialNumbers.length === 0 ? (
            <div className="text-center text-muted py-4">
              ยังไม่มีข้อมูลการเบิกอุปกรณ์ในระบบ
            </div>
          ) : (
            <div className="table-container">
              <table className="table table-striped mb-0">
                <thead>
                  <tr>
                    <th style={{ width: '50px', minWidth: '50px' }}>#</th>
                    <th>ชื่ออุปกรณ์</th>
                    <th>Serial Number</th>
                    <th>เลข Job</th>
                    <th>ผู้เบิก</th>
                    <th>หน่วยงาน / แผนก</th>
                    <th>อาคาร / ชั้น</th>
                    <th style={{ width: '140px', minWidth: '120px' }}>วันที่เบิก</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawnSerialNumbers.map((sn, index) => (
                    <tr key={sn.id}>
                      <td className="text-muted fw-bold">{String(index + 1).padStart(2, '0')}</td>
                      <td className="fw-bold">{getItemName(sn.item_id)}</td>
                      <td>{sn.serial_number || '-'}</td>
                      <td>{sn.job_number || '-'}</td>
                      <td>{sn.withdrawer_name || '-'}</td>
                      <td>{sn.dept_used || '-'}</td>
                      <td>
                        {sn.building ? `${sn.building} ${sn.floor ? '/ ' + sn.floor : ''}` : '-'}
                      </td>
                      <td className="text-muted small">
                        {sn.withdraw_date ? new Date(sn.withdraw_date).toLocaleDateString('th-TH') :
                         (sn.created_at ? new Date(sn.created_at).toLocaleDateString('th-TH') : '-')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Outstanding Withdrawals - Items not yet returned */}
      <div className="mt-4">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">อุปกรณ์ที่ยังไม่ได้รับคืน (Outstanding)</h5>
          </div>
          <div className="card-body p-0">
            {withdrawnSerialNumbers.length === 0 ? (
              <div className="text-center text-muted py-4">
                ไม่มีอุปกรณ์ที่ยังไม่ได้รับคืน
              </div>
            ) : (
              <div className="table-container">
                <table className="table table-striped mb-0">
                  <thead>
                    <tr>
                      <th style={{ width: '50px', minWidth: '50px' }}>#</th>
                      <th>ชื่ออุปกรณ์</th>
                      <th>Serial Number</th>
                      <th>เลข Job</th>
                      <th>ผู้เบิก</th>
                      <th>หน่วยงาน / แผนก</th>
                      <th>อาคาร / ชั้น</th>
                      <th style={{ width: '140px', minWidth: '120px' }}>วันที่เบิก</th>
                      <th style={{ width: '100px', minWidth: '90px' }}>อายุ (วัน)</th>
                      <th style={{ width: '140px', minWidth: '120px' }}>สถานะคืน</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawnSerialNumbers.map((sn, index) => {
                      const withdrawDate = sn.withdraw_date ? new Date(sn.withdraw_date) : (sn.created_at ? new Date(sn.created_at) : null);
                      const daysOutstanding = withdrawDate ? Math.floor((new Date() - withdrawDate) / (1000 * 60 * 60 * 24)) : 0;
                      const isOverdue = daysOutstanding > 7; // More than 7 days = overdue
                      return (
                        <tr key={sn.id} className={isOverdue ? 'table-danger' : ''}>
                          <td className="text-muted fw-bold">{String(index + 1).padStart(2, '0')}</td>
                          <td className="fw-bold">{getItemName(sn.item_id)}</td>
                          <td>{sn.serial_number || '-'}</td>
                          <td>{sn.job_number || '-'}</td>
                          <td>{sn.withdrawer_name || '-'}</td>
                          <td>{sn.dept_used || '-'}</td>
                          <td>
                            {sn.building ? `${sn.building} ${sn.floor ? '/ ' + sn.floor : ''}` : '-'}
                          </td>
                          <td className="text-muted small">
                            {withdrawDate ? withdrawDate.toLocaleDateString('th-TH') : '-'}
                          </td>
                          <td className={isOverdue ? 'fw-bold text-danger' : 'fw-bold text-warning'}>
                            {daysOutstanding} วัน
                          </td>
                          <td>
                            <span className={`badge ${isOverdue ? 'badge-danger' : 'badge-warning'}`}>
                              {isOverdue ? 'เกินกำหนด' : 'รอรับคืน'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;