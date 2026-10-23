import React from 'react';
import { getWithdrawalActionBadgeClass, getWithdrawalActionText } from '../../utils/status';

const HistoryModal = ({
  show,
  onHide,
  sn,
  historyLogs,
  isSubmitting = false,
}) => {
  if (!show || !sn) return null;

  return (
    <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }} aria-hidden="false">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header border-0 p-4 pb-0">
            <h5 className="modal-title fw-bold">ประวัติการเบิก-คืน: {sn.serial_number}</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body p-4">
            <div className="table-responsive">
              <table className="table table-hover mb-0" style={{ fontSize: '0.85rem' }}>
                <thead className="table-light" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <tr>
                    <th style={{ width: '40px', minWidth: '40px', padding: '0.6rem 0.5rem', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', border: 'none' }}>#</th>
                    <th style={{ width: '130px', minWidth: '110px', padding: '0.6rem 0.5rem', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', border: 'none' }}>หมายเลขเครื่อง</th>
                    <th style={{ width: '90px', minWidth: '80px', padding: '0.6rem 0.5rem', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', border: 'none' }}>การกระทำ</th>
                    <th style={{ width: '100px', minWidth: '90px', padding: '0.6rem 0.5rem', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', border: 'none' }}>เลข Job</th>
                    <th style={{ width: '100px', minWidth: '90px', padding: '0.6rem 0.5rem', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', border: 'none' }}>ผู้เบิก / ผู้คืน</th>
                    <th style={{ width: '100px', minWidth: '90px', padding: '0.6rem 0.5rem', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', border: 'none' }}>แผนก</th>
                    <th style={{ width: '100px', minWidth: '90px', padding: '0.6rem 0.5rem', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', border: 'none' }}>อาคาร/ชั้น</th>
                    <th style={{ width: '80px', minWidth: '70px', padding: '0.6rem 0.5rem', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', border: 'none' }}>สภาพ</th>
                    <th style={{ width: '150px', minWidth: '120px', padding: '0.6rem 0.5rem', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', border: 'none' }}>หมายเหตุ</th>
                    <th style={{ width: '90px', minWidth: '80px', padding: '0.6rem 0.5rem', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', border: 'none' }}>ผู้บันทึก</th>
                    <th style={{ width: '140px', minWidth: '130px', padding: '0.6rem 0.5rem', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', border: 'none' }}>วันที่/เวลา</th>
                  </tr>
                </thead>
                <tbody>
                  {historyLogs.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="text-center text-muted py-4">
                        ยังไม่มีประวัติการเบิก-คืน
                      </td>
                    </tr>
                  ) : (
                    historyLogs.map((log, index) => (
                      <tr key={log.id}>
                        <td className="text-muted fw-bold">{index + 1}</td>
                        <td className="fw-medium">{sn.serial_number || '-'}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={log.action === 'withdraw' ? 'badge-warning' : 'badge-success'}>
                            {log.action === 'withdraw' ? 'เบิก' : 'คืน'}
                          </span>
                        </td>
                        <td>{log.job_number || '-'}</td>
                        <td>{log.action === 'withdraw' ? log.withdrawer_name : log.receiver_name}</td>
                        <td>{log.dept_used || '-'}</td>
                        <td>{log.building || '-'} {log.floor ? ' (ชั้น ' + log.floor + ')' : ''}</td>
                        <td>{log.condition || '-'}</td>
                        <td>{log.note || '-'}</td>
                        <td>{log.performed_by || '-'}</td>
                        <td className="text-muted small">
                          {log.performed_at ? new Date(log.performed_at).toLocaleString() : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="modal-footer border-0 p-4 pt-0">
            <button
              type="button"
              className="btn btn-primary px-4 py-2 rounded-3 fw-bold shadow-sm border-0"
              style={{ background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)' }}
              onClick={onHide}
              disabled={isSubmitting}
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;