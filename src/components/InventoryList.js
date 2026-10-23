import React, { useState, useMemo, useEffect } from 'react';

const InventoryList = ({
  items,
  serialNumbers,
  withdrawalLogs,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onAddSerialNumber,
  onUpdateSerialNumber,
  onDeleteSerialNumber,
  onWithdraw,
  onReturn,
  loading = false
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'asc' });
  const [activeRowId, setActiveRowId] = useState(null);

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

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(item =>
        item.item_name.toLowerCase().includes(term) ||
        item.responsible?.toLowerCase().includes(term) ||
        item.unit?.toLowerCase().includes(term)
      );
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (aVal === null || aVal === undefined) aVal = '';
      if (bVal === null || bVal === undefined) bVal = '';

      // Handle date sorting
      if (sortConfig.key === 'created_at') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      // Handle numeric sorting
      if (sortConfig.key === 'total_qty') {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [items, searchTerm, sortConfig]);

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

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return '⇅';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // Sortable headers config
  const sortableHeaders = [
    { key: 'item_name', label: 'ชื่อรายการอุปกรณ์' },
    { key: 'total_qty', label: 'จำนวนรวม', numeric: true },
    { key: 'unit', label: 'หน่วย' },
    { key: 'responsible', label: 'ผู้ดูแลรับผิดชอบ' },
    { key: 'created_at', label: 'วันที่ลงระบบ' },
  ];

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <div className="header-title">
            <h4>รายการอุปกรณ์</h4>
            <p>จัดการข้อมูลรายการอุปกรณ์ในคลัง</p>
          </div>
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
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="text-center skeleton-row">
                      <td className="text-muted fw-bold">
                        <div className="skeleton-loader" style={{ width: '30px', height: '16px', margin: '0 auto' }}></div>
                      </td>
                      <td className="text-start fw-medium">
                        <div className="skeleton-loader" style={{ width: '80%', height: '16px' }}></div>
                      </td>
                      <td className="fw-bold text-primary">
                        <div className="skeleton-loader" style={{ width: '40px', height: '16px', margin: '0 auto' }}></div>
                      </td>
                      <td>
                        <div className="skeleton-loader" style={{ width: '60px', height: '16px', margin: '0 auto' }}></div>
                      </td>
                      <td>
                        <div className="skeleton-loader" style={{ width: '100px', height: '16px', margin: '0 auto' }}></div>
                      </td>
                      <td className="text-muted small">
                        <div className="skeleton-loader" style={{ width: '90px', height: '16px', margin: '0 auto' }}></div>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-1">
                          <div className="skeleton-loader" style={{ width: '36px', height: '36px', borderRadius: '8px' }}></div>
                          <div className="skeleton-loader" style={{ width: '36px', height: '36px', borderRadius: '8px' }}></div>
                          <div className="skeleton-loader" style={{ width: '36px', height: '36px', borderRadius: '8px' }}></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Search and Filter Bar */}
      <div className="card mb-3">
        <div className="card-body py-3">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="position-relative">
                <i className="bi bi-search position-absolute start-0 top-50 translate-middle-y ms-3 text-muted"></i>
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="ค้นหาชื่อรายการ, ผู้ดูแล, หน่วย..."
                  value={searchTerm}
                  onChange={handleSearch}
                  aria-label="ค้นหารายการอุปกรณ์"
                />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="d-flex gap-2">
                <span className="text-muted small align-self-center">
                  พบ {filteredAndSortedItems.length} จาก {items.length} รายการ
                </span>
              </div>
            </div>
            <div className="col-12 col-md-4 d-flex justify-content-md-end">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  setSearchTerm('');
                  setSortConfig({ key: 'created_at', direction: 'asc' });
                }}
                disabled={!searchTerm && sortConfig.key === 'created_at' && sortConfig.direction === 'asc'}
              >
                <i className="bi bi-arrow-clockwise me-1"></i> รีเซ็ต
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <div className="table-container">
            <table className="table table-striped mb-0" id="inventoryTable">
              <thead>
                <tr className="text-center">
                  <th style={{ width: '50px', minWidth: '50px' }}>#</th>
                  {sortableHeaders.map(({ key, label, numeric }) => (
                    <th
                      key={key}
                      style={{
                        cursor: 'pointer',
                        userSelect: 'none',
                        whiteSpace: 'nowrap'
                      }}
                      onClick={() => handleSort(key)}
                      title={`เรียงลำดับตาม${label}`}
                    >
                      <div className="d-flex align-items-center justify-content-center gap-1">
                        <span>{label}</span>
                        <span className="sort-indicator text-muted" style={{ fontSize: '0.7rem' }}>
                          {getSortIndicator(key)}
                        </span>
                      </div>
                    </th>
                  ))}
                  <th style={{ width: '120px', minWidth: '110px' }}>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-5">
                      <div className="empty-state">
                        <i className="bi bi-box-seam display-1 text-muted mb-3"></i>
                        <h5 className="text-muted mb-2">
                          {searchTerm ? 'ไม่พบรายการที่ค้นหา' : 'ยังไม่มีข้อมูลวัสดุในระบบ'}
                        </h5>
                        <p className="text-muted small mb-3">
                          {searchTerm
                            ? 'ลองเปลี่ยนคำค้นหาหรือกดปุ่มรีเซ็ต'
                            : 'เริ่มต้นโดยเพิ่มรายการอุปกรณ์แรกของคุณ'}
                        </p>
                        {!searchTerm && (
                          <button
                            className="btn btn-primary"
                            onClick={() => setShowAddModal(true)}
                          >
                            <i className="bi bi-plus-lg me-2"></i> เพิ่มรายการแรก
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className="text-center"
                      onMouseEnter={() => setActiveRowId(item.id)}
                      onMouseLeave={() => setActiveRowId(null)}
                      style={{
                        backgroundColor: activeRowId === item.id ? 'var(--bg-secondary)' : 'transparent',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <td className="text-muted fw-bold">{String(index + 1).padStart(2, '0')}</td>
                      <td className="text-start fw-medium" title={item.item_name}>
                        <span className="text-truncate d-inline-block" style={{ maxWidth: '300px' }}>
                          {item.item_name}
                        </span>
                      </td>
                      <td className="fw-bold text-primary">{item.total_qty}</td>
                      <td>
                        <span className="badge badge-secondary">
                          {item.unit || '-'}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-secondary">
                          <i className="bi bi-person me-1"></i>{item.responsible || '-'}
                        </span>
                      </td>
                      <td className="text-muted small">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('th-TH') : '-'}
                      </td>
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
                            aria-label={`แก้ไข ${item.item_name}`}
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button
                            className="btn-action btn-delete"
                            onClick={() => handleDeleteItem(item.id, item.item_name)}
                            title="ลบ"
                            aria-label={`ลบ ${item.item_name}`}
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                          <a
                            href={`/details/${item.id}`}
                            className="btn-action"
                            title="ดูรายละเอียด"
                            aria-label={`ดูรายละเอียด ${item.item_name}`}
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
                  autoFocus
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