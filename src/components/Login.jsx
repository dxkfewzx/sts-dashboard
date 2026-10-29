import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { swalError } from '../utils/swal';
import './Login.css';

/**
 * Login Component
 *
 * @param {Object} props
 * @param {string|React.ReactNode} [props.logo] - Company logo: image URL string or React component
 * @param {string} [props.logoAlt] - Alt text for logo image (default: "Company Logo")
 * @param {string} [props.title] - Page title (default: "เข้าสู่ระบบ")
 * @param {string} [props.subtitle] - Page subtitle (default: "ระบบจัดการสต็อกอุปกรณ์ (STS)")
 * @returns {JSX.Element}
 */
export default function Login({ logo, logoAlt = 'Company Logo', title = 'เข้าสู่ระบบ', subtitle = 'ระบบจัดการสต็อกอุปกรณ์ (STS)' }) {
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
      await swalError({
        title: 'เข้าสู่ระบบล้มเหลว',
        text: error.message,
      });
    } else {
      navigate(from, { replace: true });
    }
    setLoading(false);
  };

  // Render logo
  const renderLogo = () => {
    if (logo) {
      if (typeof logo === 'string') {
        return <img src={logo} alt={logoAlt} className="login-logo-img" aria-hidden="true" />;
      }
      return <span className="login-logo-custom" aria-hidden="true">{logo}</span>;
    }
    // Default fallback icon
    return <i className="bi bi-shield-lock-fill fs-1 text-white" aria-hidden="true"></i>;
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center vh-100">
      <div className="card login-card shadow-lg border-0">
        <div className="card-body login-card-body p-5">
          <div className="text-center mb-4">
            <div className="login-icon-wrapper d-inline-flex align-items-center justify-content-center mb-3" aria-hidden="true">
              {renderLogo()}
            </div>
            <h2 className="login-title fw-bold mb-1">{title}</h2>
            <p className="login-subtitle text-muted mb-0">{subtitle}</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">อีเมล</label>
              <div className="input-group">
                <span className="input-group-text" aria-hidden="true">
                  <i className="bi bi-envelope-fill"></i>
                </span>
                <input
                  type="email"
                  id="email"
                  className="form-control border-0 shadow-none"
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
              <label htmlFor="password" className="form-label fw-semibold">รหัสผ่าน</label>
              <div className="input-group">
                <span className="input-group-text" aria-hidden="true">
                  <i className="bi bi-lock-fill"></i>
                </span>
                <input
                  type="password"
                  id="password"
                  className="form-control border-0 shadow-none"
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
              className="btn login-btn fw-bold py-2 w-100"
              disabled={loading}
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
            <p className="login-footer-text small mb-0">
              <i className="bi bi-info-circle-fill me-1"></i>
              ใช้บัญชีที่ลงทะเบียนใน Supabase Auth
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
