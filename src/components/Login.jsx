import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Swal from 'sweetalert2';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await login(email, password);
    if (error) {
      await Swal.fire({
        icon: 'error',
        title: 'เข้าสู่ระบบล้มเหลว',
        text: error.message,
        confirmButtonColor: '#d33',
        confirmButtonText: 'ตกลง'
      });
    } else {
      navigate(from, { replace: true });
    }
    setLoading(false);
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center vh-100" style={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div className="card shadow-lg border-0 w-100" style={{
        maxWidth: '440px',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)'
      }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div className="login-icon-wrapper d-inline-flex align-items-center justify-content-center mb-3" style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)'
            }}>
              <i className="bi bi-shield-lock-fill fs-1 text-white"></i>
            </div>
            <h2 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>เข้าสู่ระบบ</h2>
            <p className="text-muted mb-0">ระบบจัดการสต็อกอุปกรณ์ (STS)</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold" style={{ color: '#2c3e50', fontSize: '0.9rem' }}>อีเมล</label>
              <div className="input-group" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <span className="input-group-text" style={{
                  background: '#f8f9fa',
                  border: 'none',
                  borderRight: '1px solid #dee2e6',
                  color: '#6c757d'
                }}>
                  <i className="bi bi-envelope-fill"></i>
                </span>
                <input
                  type="email"
                  id="email"
                  className="form-control border-0 shadow-none"
                  style={{
                    background: '#f8f9fa',
                    boxShadow: 'none',
                    padding: '12px 16px'
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={loading}
                  placeholder="example@domain.com"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold" style={{ color: '#2c3e50', fontSize: '0.9rem' }}>รหัสผ่าน</label>
              <div className="input-group" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <span className="input-group-text" style={{
                  background: '#f8f9fa',
                  border: 'none',
                  borderRight: '1px solid #dee2e6',
                  color: '#6c757d'
                }}>
                  <i className="bi bi-lock-fill"></i>
                </span>
                <input
                  type="password"
                  id="password"
                  className="form-control border-0 shadow-none"
                  style={{
                    background: '#f8f9fa',
                    boxShadow: 'none',
                    padding: '12px 16px'
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={loading}
                  placeholder="กรอกรหัสผ่าน"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn fw-bold py-2 w-100"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                padding: '14px 0',
                boxShadow: '0 4px 15px rgba(78, 115, 223, 0.4)',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? (
                <span className="d-flex align-items-center justify-content-center gap-2">
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  กำลังเข้าสู่ระบบ...
                </span>
              ) : (
                'เข้าสู่ระบบ'
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-muted small mb-0">
              <i className="bi bi-info-circle-fill me-1"></i>
              ใช้บัญชีที่ลงทะเบียนใน Supabase Auth
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}