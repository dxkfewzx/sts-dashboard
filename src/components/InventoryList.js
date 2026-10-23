import React, { useState } from 'react';

const InventoryList = ({ items, serialNumbers, withdrawalLogs, onAddItem, onUpdateItem, onDeleteItem, onAddSerialNumber, onUpdateSerialNumber, onDeleteSerialNumber, onWithdraw, onReturn }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Form state for add item
  const [addForm, setAddForm] = useState({
    item_name: '',
    total_qty: '',
    unit: '',
    responsible: 'ธีรภัทร์'
  });

  // Handle input changes for add form
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle input changes for edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditItem(prev => ({ ...prev, [name]: value }));
  };

  // Handle add item submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const { item_name, total_qty, unit, responsible } = addForm;

    if (!item_name || !total_qty || !unit || !responsible) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      await onAddItem({
        item_name,
        total_qty: parseInt(total_qty),
        unit,
        responsible,
        created_at: new Date().toISOString()
      });
      setAddForm({
        item_name: '',
        total_qty: '',
        unit: '',
        responsible: 'ธีรภัทร์'
      });
      setShowAddModal(false);
      alert('เพิ่มสำเร็จ!');
    } catch (error) {
      console.error('Error adding item:', error);
      alert('เกิดข้อผิดพลาดในการเพิ่มรายการ');
    }
  };

  // Handle edit item submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editItem) return;

    const { id, item_name, total_qty, unit, responsible } = editItem;

    if (!item_name || !total_qty || !unit || !responsible) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      await onUpdateItem(id, {
        item_name,
        total_qty: parseInt(total_qty),
        unit,
        responsible
      });
      setShowEditModal(false);
      alert('แก้ไขสำเร็จ!');
    } catch (error) {
      console.error('Error updating item:', error);
      alert('เกิดข้อผิดพลาดในการแก้ไขรายการ');
    }
  };

  // Handle delete item
  const handleDeleteItem = async (id, name) => {
    if (window.confirm(`คุณต้องการลบรายการ "${name}" หรือไม่?`)) {
      try {
        await onDeleteItem(id);
        alert('ลบสำเร็จ!');
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('เกิดข้อผิดพลาดในการลบรายการ');
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="header-title">
          <h4>รายการอุปกรณ์</h4>
          <p>จัดการข้อมูลรายการอุปกรณ์ในคลัง</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <i className="bi bi-plus-lg me-2"></i>
          <span className="fw-medium">เพิ่มรายการใหม่</span>
        </button>
      </div>
      <div className="card">
        <div className="card-body p-0">
          <div className="table-container">
            <table className="table table-striped mb-0" id="inventoryTable">
              <thead>
                <tr className="text-center">
                  <th style={{ width: '50px', minWidth: '50px' }}>#</th>
                  <th>ชื่อรายการอุปกรณ์</th>
                  <th style={{ width: '100px', minWidth: '90px' }}>จำนวนรวม</th>
                  <th style={{ width: '100px', minWidth: '90px' }}>หน่วย</th>
                  <th style={{ width: '180px', minWidth: '160px' }}>ผู้ดูแลรับผิดชอบ</th>
                  <th style={{ width: '140px', minWidth: '120px' }}>วันที่ลงระบบ</th>
                  <th style={{ width: '120px', minWidth: '110px' }}>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      ยังไม่มีข้อมูลวัสดุในระบบ
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr key={item.id} className="text-center">
                      <td className="text-muted fw-bold">{String(index + 1).padStart(2, '0')}</td>
                      <td className="text-start fw-medium">{item.item_name}</td>
                      <td className="fw-bold text-primary">{item.total_qty}</td>
                      <td><span className="text-muted small">{item.unit || '-'}</span></td>
                      <td>
                        <span className="badge badge-secondary">
                          <i className="bi bi-person me-1"></i>{item.responsible || '-'}
                        </span>
                      </td>
                      <td className="text-muted small">{item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}</td>
                      <td>
                        <div className="d-flex justify-content-center gap-1">
                          <button
                            className="btn-action btn-edit"
                            onClick={() => {
                              setEditItem({
                                id: item.id,
                                item_name: item.item_name,
                                total_qty: item.total_qty,
                                unit: item.unit,
                                responsible: item.responsible
                              });
                              setShowEditModal(true);
                            }}
                            title="แก้ไข"
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button
                            className="btn-action btn-delete"
                            onClick={() => handleDeleteItem(item.id, item.item_name)}
                            title="ลบ"
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                          <a
                            href={`/details/${item.id}`}
                            className="btn-action"
                            title="ดูรายละเอียด"
                          >
                            <i className="bi bi-eye"></i>
                          </a>
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

      {/* Add Item Modal */}
      <div
        className={`modal fade ${showAddModal ? 'show' : ''}`}
        tabIndex="-1"
        aria-hidden={!showAddModal}
        style={{ display: showAddModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <form onSubmit={handleAddSubmit} className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-0 p-4 pb-0">
              <h5 className="modal-title fw-bold">เพิ่มรายการอุปกรณ์</h5>
              <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
            </div>
            <div className="modal-body p-4">
              <input type="hidden" name="action" value="add_new_item" />
              <div className="mb-3">
                <label className="form-label small fw-bold">ชื่ออุปกรณ์</label>
                <input
                  type="text"
                  name="item_name"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  placeholder="ระบุชื่ออุปกรณ์..."
                  value={addForm.item_name}
                  onChange={handleAddChange}
                  required
                />
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label small fw-bold">จำนวนเริ่มต้น</label>
                  <input
                    type="number"
                    name="total_qty"
                    className="form-control border-0 bg-light p-3 rounded-3"
                    value={addForm.total_qty}
                    onChange={handleAddChange}
                    min="0"
                    required
                  />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label small fw-bold">หน่วยเรียก</label>
                  <input
                    type="text"
                    name="unit"
                    className="form-control border-0 bg-light p-3 rounded-3"
                    placeholder="เครื่อง/ชิ้น"
                    value={addForm.unit}
                    onChange={handleAddChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-0">
                <label className="form-label small fw-bold">ผู้รับผิดชอบ</label>
                <input
                  type="text"
                  name="responsible"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  value={addForm.responsible}
                  onChange={handleAddChange}
                />
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

      {/* Edit Item Modal */}
      <div
        className={`modal fade ${showEditModal ? 'show' : ''}`}
        tabIndex="-1"
        aria-hidden={!showEditModal}
        style={{ display: showEditModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <form onSubmit={handleEditSubmit} className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-0 p-4 pb-0">
              <h5 className="modal-title fw-bold">แก้ไขรายการอุปกรณ์</h5>
              <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
            </div>
            <div className="modal-body p-4">
              <input type="hidden" name="action" value="edit_item" />
              <input type="hidden" name="item_id" id="edit_id" />
              <div className="mb-3">
                <label className="form-label small fw-bold">ชื่ออุปกรณ์</label>
                <input
                  type="text"
                  name="item_name"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  id="edit_name"
                  value={editItem?.item_name || ''}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label small fw-bold">จำนวนรวม</label>
                  <input
                    type="number"
                    name="total_qty"
                    className="form-control border-0 bg-light p-3 rounded-3"
                    id="edit_qty"
                    value={editItem?.total_qty || ''}
                    onChange={handleEditChange}
                    min="0"
                    required
                  />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label small fw-bold">หน่วยเรียก</label>
                  <input
                    type="text"
                    name="unit"
                    className="form-control border-0 bg-light p-3 rounded-3"
                    id="edit_unit"
                    value={editItem?.unit || ''}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-0">
                <label className="form-label small fw-bold">ผู้รับผิดชอบ</label>
                <input
                  type="text"
                  name="responsible"
                  className="form-control border-0 bg-light p-3 rounded-3"
                  id="edit_responsible"
                  value={editItem?.responsible || ''}
                  onChange={handleEditChange}
                  required
                />
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

export default InventoryList;