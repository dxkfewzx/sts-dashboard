import React, { useState } from 'react';
import WithdrawModal from './WithdrawModal';

const DashboardContent = ({ items, serialNumbers, onAddItem, onUpdateItem, onDeleteItem, onAddSerialNumber, onUpdateSerialNumber, onDeleteSerialNumber, departments, buildings, floors }) => {
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
  const handleItemChange = async (e) => {
    const itemId = e.target.value;
    setSelectedItemId(itemId);
    setFormData(prev => ({ ...prev, item_id: itemId }));

    if (itemId) {
      // Filter serial numbers for the selected item that are available (status: 'Available')
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

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { item_id, serial_number, job_number, withdrawer, dept_info, building_info, floor_info } = formData;

    // Validate
    if (!item_id || !serial_number || !job_number || !withdrawer || !dept_info) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    // Find the serial number record to update
    const snRecord = serialNumbers.find(
      sn => sn.item_id === parseInt(item_id) && sn.serial_number === serial_number
    );

    if (snRecord) {
      try {
        await onUpdateSerialNumber(snRecord.id, {
          status: 'Withdrawn',
          job_number,
          withdrawer_name: withdrawer,
          dept_used: dept_info,
          building: building_info || '',
          floor: floor_info || '',
          withdraw_date: new Date().toISOString() // Full timestamp
        });
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
        alert('บันทึกการเบิกอุปกรณ์สำเร็จ');
      } catch (error) {
        console.error('Error updating serial number:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } else {
      alert('ไม่พบข้อมูลหมายเลขเครื่อง');
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

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="header-title">
          <h4>ภาพรวมคลังอุปกรณ์</h4>
          <p>สถานะอุปกรณ์คงเหลือและการเบิกจ่ายล่าสุด</p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary fw-600 rounded-3 px-4 shadow-sm"
            onClick={() => setShowWithdrawModal(true)}
          >
            <i className="bi bi-box-arrow-right me-2"></i>เบิกอุปกรณ์
          </button>
        </div>
      </div>

      <div className="content-card">
        <div className="table-responsive">
          <table className="table align-middle text-center">
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th className="text-start">รายการ</th>
                <th>ผู้ดูแล</th>
                <th>ทั้งหมด</th>
                <th>เบิกออก</th>
                <th>คงเหลือ</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    ยังไม่มีข้อมูลวัสดุในระบบ
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="text-muted fw-bold">{String(index + 1).padStart(2, '0')}</td>
                    <td className="text-start fw-600">{item.item_name}</td>
                    <td>
                      <span className="badge-soft" style={{ background: '#e0e8ff', color: '#4e73df' }}>
                        {item.responsible || '-'}
                      </span>
                    </td>
                    <td className="fw-bold">{item.total_qty}</td>
                    <td className="text-warning fw-bold">{getWithdrawnCount(item.id)}</td>
                    <td className="fw-bold">{getRemainingCount(item)}</td>
                    <td>
                      <a
            href={`/details/${item.id}`}
            className="btn-action me-1"
          >
            <i className="bi bi-search"></i>
          </a>
                      <button
            className="btn-action btn-withdraw"
            data-item-id={item.id}
            data-item-name={item.item_name}
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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