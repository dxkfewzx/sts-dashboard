import React, { useState, useMemo } from 'react';
import WithdrawModal from './WithdrawModal';
import { useItems, useDashboardStats, useWithdrawReturn, useReferenceData } from '../hooks/useSupabase';
import { operationToast } from '../utils/toast';

const DashboardContent = () => {
  const { items } = useItems();
  const { totalItems, totalAvailable, totalWithdrawn, totalRepair, lowStockItems } = useDashboardStats();
  const { onWithdraw, serialNumbers } = useWithdrawReturn();
  const { departments, buildings, floors } = useReferenceData();

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [availableSerialNumbers, setAvailableSerialNumbers] = useState([]);
  const [formData, setFormData] = useState({
    item_id: '',
    serial_number: '',
    job_number: '',
    withdrawer: '',
    dept_info: '',
    building_info: '',
    floor_info: ''
  });

  // Handle item change to fetch available serial numbers
  const handleItemChange = (e) => {
    const itemId = e.target.value;
    setSelectedItemId(itemId);
    setFormData(prev => ({ ...prev, item_id: itemId }));

    if (itemId) {
      // Filter serial numbers directly (can't use hook inside handler)
      const available = serialNumbers.filter(
        sn => sn.item_id === parseInt(itemId) && sn.status === 'Available'
      );
      setAvailableSerialNumbers(available);
    } else {
      setAvailableSerialNumbers([]);
    }
  };

  // Handle serial number change
  const handleSNChange = (e) => {
    setFormData(prev => ({ ...prev, serial_number: e.target.value }));
  };

  // Handle other form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submit - uses new onWithdraw function with logging
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { item_id, serial_number, job_number, withdrawer, dept_info, building_info, floor_info } = formData;

    // Validate
    if (!item_id || !serial_number || !job_number || !withdrawer || !dept_info) {
      operationToast.validationError();
      return;
    }

    // Find the serial number record to update
    const snRecord = serialNumbers.find(
      sn => sn.item_id === parseInt(item_id) && sn.serial_number === serial_number
    );

    if (snRecord) {
      try {
        const result = await onWithdraw(snRecord.id, {
          item_id: parseInt(item_id),
          serial_number,
          job_number,
          withdrawer_name: withdrawer,
          dept_used: dept_info,
          building: building_info || '',
          floor: floor_info || '',
          withdraw_date: new Date().toISOString()
        });

        if (result.success) {
          // Reset form and close modal
          setFormData({
            item_id: '',
            serial_number: '',
            job_number: '',
            withdrawer: '',
            dept_info: '',
            building_info: '',
            floor_info: ''
          });
          setSelectedItemId('');
          setAvailableSerialNumbers([]);
          setShowWithdrawModal(false);
          operationToast.withdrawn();
        } else {
          operationToast.withdrawError(result.error?.message);
        }
      } catch (error) {
        console.error('Error withdrawing:', error);
        operationToast.withdrawError();
      }
    } else {
      operationToast.validationError('ไม่พบข้อมูลหมายเลขเครื่อง');
    }
  };

  // Calculate withdrawn count for an item
  const getWithdrawnCount = (itemId) => {
    return serialNumbers.filter(
      sn => sn.item_id === itemId && sn.status === 'Withdrawn'
    ).length;
  };

  // Calculate remaining count for an item
  const getRemainingCount = (item) => {
    const withdrawn = getWithdrawnCount(item.id);
    return item.total_qty - withdrawn;
  };

  // Calculate repair count for an item
  const getRepairCount = (itemId) => {
    return serialNumbers.filter(
      sn => sn.item_id === itemId && sn.status === 'Repair'
    ).length;
  };

  const statsCards = [
    { label: 'รายการอุปกรณ์', value: totalItems, icon: 'bi-boxes', iconColor: 'primary', iconBg: 'primary-light' },
    { label: 'พร้อมใช้งาน', value: totalAvailable, icon: 'bi-check-circle-fill', iconColor: 'success', iconBg: 'success-light' },
    { label: 'เบิกออกแล้ว', value: totalWithdrawn, icon: 'bi-box-arrow-right', iconColor: 'warning', iconBg: 'warning-light' },
    { label: 'อยู่ระหว่างซ่อม', value: totalRepair, icon: 'bi-tools', iconColor: 'danger', iconBg: 'danger-light' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="header-title">
          <h4>ภาพรวมคลังอุปกรณ์</h4>
          <p>สถานะอุปกรณ์คงเหลือและการเบิกจ่ายล่าสุด</p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => setShowWithdrawModal(true)}
          >
            <i className="bi bi-box-arrow-right me-2"></i>เบิกอุปกรณ์
          </button>
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

      {/* Items Table */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">รายการอุปกรณ์ทั้งหมด</h5>
          <span className="badge badge-secondary">{totalItems} รายการ</span>
        </div>
        <div className="card-body p-0">
          <div className="table-container">
            <table className="table table-striped mb-0">
              <thead>
                <tr>
                  <th style={{ width: '50px', minWidth: '50px' }}>#</th>
                  <th>รายการ</th>
                  <th style={{ width: '130px', minWidth: '120px' }}>ผู้ดูแล</th>
                  <th style={{ width: '80px', minWidth: '70px' }}>ทั้งหมด</th>
                  <th style={{ width: '80px', minWidth: '70px' }}>พร้อมใช้</th>
                  <th style={{ width: '80px', minWidth: '70px' }}>เบิกออก</th>
                  <th style={{ width: '80px', minWidth: '70px' }}>ซ่อม</th>
                  <th style={{ width: '80px', minWidth: '70px' }}>คงเหลือ</th>
                  <th style={{ width: '120px', minWidth: '110px' }}>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center text-muted py-4">
                      ยังไม่มีข้อมูลวัสดุในระบบ
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="text-muted fw-bold">{String(index + 1).padStart(2, '0')}</td>
                      <td className="fw-medium">{item.item_name}</td>
                      <td>
                        <span className="badge badge-secondary">
                          <i className="bi bi-person me-1"></i>{item.responsible || '-'}
                        </span>
                      </td>
                      <td className="fw-bold text-primary">{item.total_qty}</td>
                      <td className="fw-bold text-success">{item.total_qty - getWithdrawnCount(item.id) - getRepairCount(item.id)}</td>
                      <td className="fw-bold text-warning">{getWithdrawnCount(item.id)}</td>
                      <td className="fw-bold text-danger">{getRepairCount(item.id)}</td>
                      <td className="fw-bold">{getRemainingCount(item)}</td>
                      <td>
                        <div className="d-flex justify-content-center gap-1">
                          <a
                            href={`/details/${item.id}`}
                            className="btn-action"
                            title="ดูรายละเอียด"
                          >
                            <i className="bi bi-eye"></i>
                          </a>
                          <button
                            className="btn-action btn-withdraw"
                            data-item-id={item.id}
                            data-item-name={item.item_name}
                            onClick={() => setShowWithdrawModal(true)}
                            title="เบิกอุปกรณ์"
                          >
                            <i className="bi bi-box-arrow-right"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      <WithdrawModal
        show={showWithdrawModal}
        onHide={() => setShowWithdrawModal(false)}
        items={items}
        serialNumbers={serialNumbers}
        departments={departments}
        buildings={buildings}
        floors={floors}
        onItemChange={handleItemChange}
        onSNChange={handleSNChange}
        onChange={handleChange}
        onSubmit={handleSubmit}
        formData={formData}
        selectedItemId={selectedItemId}
        availableSerialNumbers={availableSerialNumbers}
      />
    </div>
  );
};

export default DashboardContent;