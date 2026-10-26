import React, { useState, useMemo } from 'react';
import { useItems, useSerialNumbers } from '../hooks/useSupabase';
import { operationToast } from '../utils/toast';
import { useSidebar } from '../context/SidebarContext';
import {
  PageHeader,
  Table,
  Card,
  Button,
  Modal,
  Input,
  Badge,
  IconButton,
  Skeleton,
} from '../components/ui';
import './InventoryList.css';

const InventoryList = () => {
  const { isMobile, isSidebarOpen, toggleSidebar } = useSidebar();

  // Fallback check for mobile - use both context and direct window check
  // This ensures the button shows even if context hasn't updated yet
  const isMobileFallback = typeof window !== 'undefined' && window.innerWidth <= 1024;
  const shouldShowMobileMenu = isMobile || isMobileFallback;

  const MobileMenuToggle = () => {
    if (!shouldShowMobileMenu) return null;
    return (
      <Button
        variant="outline"
        size="icon"
        leftIcon={<i className={isSidebarOpen ? 'bi bi-x-lg' : 'bi bi-list'} />}
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
        aria-expanded={isSidebarOpen}
        className="mobile-menu-toggle"
      />
    );
  };

  const { items, addItem, updateItem, deleteItem } = useItems();
  const { serialNumbers } = useSerialNumbers();

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
      operationToast.validationError();
      return;
    }

    try {
      await addItem({
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
      operationToast.created('รายการ');
    } catch (error) {
      console.error('Error adding item:', error);
      operationToast.createError('รายการ', error.message);
    }
  };

  // Handle edit item submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editItem) return;

    const { id, item_name, total_qty, unit, responsible } = editItem;

    if (!item_name || !total_qty || !unit || !responsible) {
      operationToast.validationError();
      return;
    }

    try {
      await updateItem(id, {
        item_name,
        total_qty: parseInt(total_qty),
        unit,
        responsible
      });
      setShowEditModal(false);
      operationToast.updated('รายการ');
    } catch (error) {
      console.error('Error updating item:', error);
      operationToast.updateError('รายการ', error.message);
    }
  };

  // Handle delete item
  const handleDeleteItem = async (id, name) => {
    const confirmed = await operationToast.confirm({
      title: 'ยืนยันการลบ?',
      text: `คุณต้องการลบรายการ "${name}" หรือไม่?`,
      icon: 'warning',
    });

    if (confirmed) {
      try {
        await deleteItem(id);
        operationToast.deleted('รายการ');
      } catch (error) {
        console.error('Error deleting item:', error);
        operationToast.deleteError('รายการ', error.message);
      }
    }
  };

  // Table columns
  const columns = [
    { key: 'index', header: '#', width: '50px', minWidth: '50px', render: (_, index) => String(index + 1).padStart(2, '0'), className: 'text-muted fw-bold text-center col-priority-low', hideInCard: true },
    {
      key: 'item_name',
      header: 'ชื่อรายการอุปกรณ์',
      sortable: true,
      sortKey: 'item_name',
      sortDirection: sortConfig.key === 'item_name' ? sortConfig.direction : null,
      onSort: handleSort,
      render: (item) => <span className="item-name-cell text-truncate fw-medium" title={item.item_name}>{item.item_name}</span>,
      className: 'text-start fw-medium col-priority-high',
      cardLabel: 'ชื่อรายการ'
    },
    { key: 'total_qty', header: 'จำนวนรวม', width: '100px', minWidth: '90px', sortable: true, sortKey: 'total_qty', sortDirection: sortConfig.key === 'total_qty' ? sortConfig.direction : null, onSort: handleSort, render: (item) => <span className="fw-bold text-primary">{item.total_qty}</span>, className: 'text-center col-priority-high', cardLabel: 'จำนวนรวม' },
    { key: 'unit', header: 'หน่วย', width: '100px', minWidth: '90px', sortable: true, sortKey: 'unit', sortDirection: sortConfig.key === 'unit' ? sortConfig.direction : null, onSort: handleSort, render: (item) => <Badge variant="secondary">{item.unit || '-'}</Badge>, className: 'text-center col-priority-medium', cardLabel: 'หน่วย' },
    { key: 'responsible', header: 'ผู้ดูแลรับผิดชอบ', width: '180px', minWidth: '160px', sortable: true, sortKey: 'responsible', sortDirection: sortConfig.key === 'responsible' ? sortConfig.direction : null, onSort: handleSort, render: (item) => <Badge variant="secondary"><i className="bi bi-person me-1"></i>{item.responsible || '-'}</Badge>, className: 'text-center col-priority-medium', cardLabel: 'ผู้ดูแล' },
    { key: 'created_at', header: 'วันที่ลงระบบ', width: '140px', minWidth: '120px', sortable: true, sortKey: 'created_at', sortDirection: sortConfig.key === 'created_at' ? sortConfig.direction : null, onSort: handleSort, render: (item) => <span className="text-muted small">{item.created_at ? new Date(item.created_at).toLocaleDateString('th-TH') : '-'}</span>, className: 'text-center col-priority-low', cardLabel: 'วันที่ลง' },
    {
      key: 'actions',
      header: 'การจัดการ',
      width: '120px',
      minWidth: '110px',
      className: 'text-center col-priority-high',
      render: (item) => (
        <div className="d-flex justify-content-center gap-1">
          <IconButton
            variant="ghost"
            size="sm"
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
            ariaLabel={`แก้ไข ${item.item_name}`}
            title="แก้ไข"
          >
            <i className="bi bi-pencil-fill" />
          </IconButton>
          <IconButton
            variant="danger"
            size="sm"
            onClick={() => handleDeleteItem(item.id, item.item_name)}
            ariaLabel={`ลบ ${item.item_name}`}
            title="ลบ"
          >
            <i className="bi bi-trash3-fill" />
          </IconButton>
          <a href={`/details/${item.id}`} className="btn-action touch-target" title="ดูรายละเอียด" aria-label={`ดูรายละเอียด ${item.item_name}`}>
            <i className="bi bi-eye" />
          </a>
        </div>
      )
    },
  ];

  // Render skeleton row
  const renderSkeletonRow = () => (
    <tr className="text-center skeleton-row">
      <td className="text-muted fw-bold"><Skeleton variant="text" width="30px" height="16px" className="skeleton-cell-text" /></td>
      <td className="text-start fw-medium"><Skeleton variant="text" width="80%" height="16px" /></td>
      <td className="fw-bold text-primary"><Skeleton variant="text" width="40px" height="16px" className="skeleton-cell-text" /></td>
      <td><Skeleton variant="text" width="60px" height="16px" className="skeleton-cell-text" /></td>
      <td><Skeleton variant="text" width="100px" height="16px" className="skeleton-cell-text" /></td>
      <td className="text-muted small"><Skeleton variant="text" width="90px" height="16px" className="skeleton-cell-text" /></td>
      <td>
        <div className="d-flex justify-content-center gap-1">
          <Skeleton variant="button" className="skeleton-cell-button" />
          <Skeleton variant="button" className="skeleton-cell-button" />
          <Skeleton variant="button" className="skeleton-cell-button" />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="inventory-list-page">
      {/* Page Header */}
      <PageHeader
        title="รายการอุปกรณ์"
        subtitle="จัดการข้อมูลรายการอุปกรณ์ในคลัง"
        actions={
          <div className="d-flex gap-2 align-items-center">
            <MobileMenuToggle />
            <Button
              variant="primary"
              leftIcon={<i className="bi bi-plus-lg me-2" />}
              onClick={() => setShowAddModal(true)}
            >
              เพิ่มรายการใหม่
            </Button>
          </div>
        }
      />

      {/* Search and Filter Bar */}
      <Card variant="outlined" className="inventory-search-bar mb-3">
        <Card.Body className="py-3">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-6 col-lg-4">
              <Input
                name="search"
                placeholder="ค้นหาชื่อรายการ, ผู้ดูแล, หน่วย..."
                value={searchTerm}
                onChange={handleSearch}
                leftIcon={<i className="bi bi-search" />}
                aria-label="ค้นหารายการอุปกรณ์"
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <span className="inventory-results-count">
                พบ {filteredAndSortedItems.length} จาก {items.length} รายการ
              </span>
            </div>
            <div className="col-12 col-md-4 d-flex justify-content-md-end">
              <Button
                variant="outline-secondary"
                size="sm"
                leftIcon={<i className="bi bi-arrow-clockwise me-1" />}
                onClick={() => {
                  setSearchTerm('');
                  setSortConfig({ key: 'created_at', direction: 'asc' });
                }}
                disabled={!searchTerm && sortConfig.key === 'created_at' && sortConfig.direction === 'asc'}
              >
                รีเซ็ต
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Items Table */}
      <Card variant="outlined" className="inventory-table-card">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <Card.Title className="inventory-table-title">รายการอุปกรณ์ทั้งหมด</Card.Title>
            <span className="badge bg-dark">{items.length} รายการ</span>
          </div>
        </Card.Header>
        <Card.Body padding="none">
          <Table
            columns={columns}
            data={filteredAndSortedItems}
            emptyState={
              <div className="inventory-empty-state">
                <i className="bi bi-box-seam inventory-empty-state-icon text-muted mb-3" />
                <h5 className="inventory-empty-state-title text-muted mb-2">
                  {searchTerm ? 'ไม่พบรายการที่ค้นหา' : 'ยังไม่มีข้อมูลวัสดุในระบบ'}
                </h5>
                <p className="inventory-empty-state-text text-muted small mb-3">
                  {searchTerm
                    ? 'ลองเปลี่ยนคำค้นหาหรือกดปุ่มรีเซ็ต'
                    : 'เริ่มต้นโดยเพิ่มรายการอุปกรณ์แรกของคุณ'}
                </p>
                {!searchTerm && (
                  <Button variant="primary" leftIcon={<i className="bi bi-plus-lg me-2" />} onClick={() => setShowAddModal(true)}>
                    เพิ่มรายการแรก
                  </Button>
                )}
              </div>
            }
            loading={items.length === 0 && serialNumbers.length === 0}
            loadingRows={5}
            renderLoadingRow={renderSkeletonRow}
            striped
            hoverable
            responsive
            cardLayout
            onRowMouseEnter={(item) => setActiveRowId(item.id)}
            onRowMouseLeave={() => setActiveRowId(null)}
            getRowStyle={(item) => ({
              backgroundColor: activeRowId === item.id ? 'var(--bg-secondary)' : 'transparent',
              transition: 'background-color 0.15s ease'
            })}
          />
        </Card.Body>
      </Card>

      {/* Add Item Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="เพิ่มรายการอุปกรณ์"
        size="md"
        footer={
          <div className="d-flex gap-2 justify-content-end w-100">
            <Button variant="light" onClick={() => setShowAddModal(false)}>
              ยกเลิก
            </Button>
            <Button variant="primary" type="submit" form="add-item-form">
              บันทึกข้อมูล
            </Button>
          </div>
        }
      >
        <form id="add-item-form" onSubmit={handleAddSubmit}>
          <Input
            name="item_name"
            label="ชื่ออุปกรณ์"
            placeholder="ระบุชื่ออุปกรณ์..."
            value={addForm.item_name}
            onChange={handleAddChange}
            required
            autoFocus
          />
          <div className="row g-3">
            <div className="col-6">
              <Input
                name="total_qty"
                label="จำนวนเริ่มต้น"
                type="number"
                value={addForm.total_qty}
                onChange={handleAddChange}
                min="0"
                required
              />
            </div>
            <div className="col-6">
              <Input
                name="unit"
                label="หน่วยเรียก"
                placeholder="เครื่อง/ชิ้น"
                value={addForm.unit}
                onChange={handleAddChange}
                required
              />
            </div>
          </div>
          <Input
            name="responsible"
            label="ผู้รับผิดชอบ"
            value={addForm.responsible}
            onChange={handleAddChange}
          />
        </form>
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditItem(null);
        }}
        title="แก้ไขรายการอุปกรณ์"
        size="md"
        footer={
          <div className="d-flex gap-2 justify-content-end w-100">
            <Button variant="light" onClick={() => setShowEditModal(false)}>
              ยกเลิก
            </Button>
            <Button variant="primary" type="submit" form="edit-item-form">
              บันทึกการแก้ไข
            </Button>
          </div>
        }
      >
        <form id="edit-item-form" onSubmit={handleEditSubmit}>
          <Input
            name="item_name"
            label="ชื่ออุปกรณ์"
            value={editItem?.item_name || ''}
            onChange={handleEditChange}
            required
          />
          <div className="row g-3">
            <div className="col-6">
              <Input
                name="total_qty"
                label="จำนวนรวม"
                type="number"
                value={editItem?.total_qty || ''}
                onChange={handleEditChange}
                min="0"
                required
              />
            </div>
            <div className="col-6">
              <Input
                name="unit"
                label="หน่วยเรียก"
                value={editItem?.unit || ''}
                onChange={handleEditChange}
                required
              />
            </div>
          </div>
          <Input
            name="responsible"
            label="ผู้รับผิดชอบ"
            value={editItem?.responsible || ''}
            onChange={handleEditChange}
            required
          />
        </form>
      </Modal>
    </div>
  );
};

export default InventoryList;
