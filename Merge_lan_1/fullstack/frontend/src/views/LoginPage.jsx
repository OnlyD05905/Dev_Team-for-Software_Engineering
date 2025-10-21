import "./LoginPage.css";
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Dashboard from "./Dashboard";

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy role (student, teacher, admin) từ URL
  const params = new URLSearchParams(location.search);
  const role = params.get("role") || "student";

  const roleText = {
    teacher: "DÀNH CHO GIẢNG VIÊN",
    student: "DÀNH CHO SINH VIÊN",
    admin: "DÀNH CHO QUẢN TRỊ VIÊN",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/users", {
        email: email,
        password: password,
      });

      if (res.data.success) {
        // Lưu thông tin user vào localStorage
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('role', role);
        alert(`Đăng nhập thành công! Xin chào ${res.data.user.name}`);
        navigate("/dashboard");
      } else {
        alert("Sai tài khoản hoặc mật khẩu!");
      }
    } catch (err) {
      alert("Lỗi kết nối server!");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Dashboard />}

      <div className="login-container">
        <div className="login-left"></div>

        <div className="login-right">
          <section className="login-box">
            <img src="/bachkhoa_logo.png" alt="BK Logo" className="login-logo" />
            <h1 className="login-title">Xác minh tài khoản HCMUT</h1>
            <p className="login-role">{roleText[role]}</p>

            <form onSubmit={handleSubmit}>
              <label>Tài khoản</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Username..."
              />

              <label>Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password..."
              />

              <div className="options">
                <label><input type="checkbox" /> Nhớ đăng nhập</label>
                <a href="#" className="forgot-link">Quên mật khẩu?</a>
              </div>

              <button type="submit" className="submit-btn">
                Đăng nhập
              </button>

              <div style={{textAlign: 'center', marginTop: '10px'}}>
                <a href={`/register?role=${role}`} style={{color: '#0066cc', textDecoration: 'none'}}>
                  Chưa có tài khoản? Đăng ký ngay
                </a>
              </div>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
