import "./LoginPage.css";
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy role (student, teacher, admin) từ URL
  const params = new URLSearchParams(location.search);
  const role = params.get("role") || "student";

  const roleText = {
    teacher: "ĐĂNG KÝ GIẢNG VIÊN",
    student: "ĐĂNG KÝ SINH VIÊN",
    admin: "ĐĂNG KÝ QUẢN TRỊ VIÊN",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu khớp
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/se_logreg", {
        name: name,
        email: email,
        password: password,
      });

      if (res.data.success) {
        alert(`Đăng ký thành công! Vui lòng đăng nhập.`);
        navigate(`/login?role=${role}`);
      } else {
        alert("Đăng ký thất bại!");
      }
    } catch (err) {
      if (err.response && err.response.status === 500) {
        alert("Email đã tồn tại hoặc lỗi server!");
      } else {
        alert("Lỗi kết nối server!");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left"></div>

      <div className="login-right">
        <section className="login-box">
          <img src="/bachkhoa_logo.png" alt="BK Logo" className="login-logo" />
          <h1 className="login-title">Đăng ký tài khoản HCMUT</h1>
          <p className="login-role">{roleText[role]}</p>

          <form onSubmit={handleSubmit}>
            <label>Họ và tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Nhập họ tên..."
            />

            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email..."
            />

            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Mật khẩu..."
            />

            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Nhập lại mật khẩu..."
            />

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
            </button>

            <div style={{textAlign: 'center', marginTop: '10px'}}>
              <a href={`/login?role=${role}`} style={{color: '#0066cc', textDecoration: 'none'}}>
                Đã có tài khoản? Đăng nhập
              </a>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default RegisterPage;
