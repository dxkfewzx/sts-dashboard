import React from 'react';
import Modal from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { getWithdrawalActionText } from '../../utils/status';

/**
 * History Modal - Read-only display of withdrawal/return history
 */
const HistoryModal = ({
  isOpen,
  onClose,
  sn,
  historyLogs,
}) => {
  if (!isOpen || !sn) return null;

  const columns = [
    { key: 'index', label: '#', sortable: false, className: 'text-muted fw-bold', width: '40px' },
    { key: 'serial_number', label: 'หมายเลขเครื่อง', sortable: false, className: 'fw-medium', width: '130px' },
    { key: 'action', label: 'การกระทำ', sortable: false, className: 'text-center', width: '90px',
      render: (_, row) => (
        <Badge variant={row.action === 'withdraw' ? 'warning' : 'success'} size="sm">
          {getWithdrawalActionText(row.action)}
        </Badge>
      )
    },
    { key: 'job_number', label: 'เลข Job', sortable: false, width: '100px' },
    { key: 'person', label: 'ผู้เบิก / ผู้คืน', sortable: false, width: '100px',
      render: (_, row) => row.action === 'withdraw' ? row.withdrawer_name : row.receiver_name
    },
    { key: 'dept_used', label: 'แผนก', sortable: false, width: '100px' },
    { key: 'location', label: 'อาคาร/ชั้น', sortable: false, width: '100px',
      render: (_, row) => `${row.building || '-'} ${row.floor ? ` (ชั้น ${row.floor})` : ''}`
    },
    { key: 'condition', label: 'สภาพ', sortable: false, width: '80px' },
    { key: 'note', label: 'หมายเหตุ', sortable: false, width: '150px' },
    { key: 'performed_by', label: 'ผู้บันทึก', sortable: false, width: '90px' },
    { key: 'performed_at', label: 'วันที่/เวลา', sortable: false, className: 'text-muted small', width: '140px',
      render: (val) => val ? new Date(val).toLocaleString() : '-'
    },
  ];

  const tableData = historyLogs.map((log, index) => ({
    ...log,
    index: index + 1,
    serial_number: sn.serial_number,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`ประวัติการเบิก-คืน: ${sn.serial_number}`}
      size="lg"
      footer={
        <Button variant="primary" onClick={onClose}>
          ปิด
        </Button>
      }
    >
      <Table
        columns={columns}
        data={tableData}
        rowKey="id"
        emptyState="ยังไม่มีประวัติการเบิก-คืน"
        striped
        hoverable
        responsive
      />
    </Modal>
  );
};

HistoryModal.displayName = 'HistoryModal';

export default HistoryModal;