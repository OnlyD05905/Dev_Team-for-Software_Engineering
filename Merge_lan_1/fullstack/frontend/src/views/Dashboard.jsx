import "./Dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    // Kiểm tra xem user đã đăng nhập chưa
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    
    if (!storedUser) {
      // Nếu chưa đăng nhập, chuyển về trang chủ
      navigate('/');
      return;
    }
    
    setUser(JSON.parse(storedUser));
    setRole(storedRole);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/');
  };

  const handleTutorRegistration = () => {
    navigate('/tutor-registration');
  };

  const handleTutorHistory = () => {
    navigate('/tutor-history');
  };

  const courses = [
    { id: 1, name: "Hệ cơ sở dữ liệu", teacher: "TS Nguyễn Văn A" },
    { id: 2, name: "Mạng máy tính", teacher: "ThS Nguyễn Văn B" },
    { id: 3, name: "Công nghệ phần mềm", teacher: "ThS Phạm Văn C" },
  ];

  if (!user) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">BK-Elearning</div>
        <ul>
          <li>Trang chủ</li>
          <li>Các khóa học của tôi</li>
          <li>Lịch học</li>
          {role === 'student' && (
            <>
              <li onClick={handleTutorRegistration} style={{cursor: 'pointer', color: '#FFFFFF'}}>
                📚 Đăng ký hỗ trợ
              </li>
              <li onClick={handleTutorHistory} style={{cursor: 'pointer', color: '#FFFFFF'}}>
                📋 Lịch sử yêu cầu
              </li>
            </>
          )}
          <li onClick={handleLogout} style={{cursor: 'pointer', color: '#ff6b6b'}}>Đăng xuất</li>
        </ul>
      </nav>

      {/* Nội dung chính */}
      <div className="main-content">
        <div className="profile">
          <img src="/avatar.jpg" alt="avatar" className="avatar" />
          <h2>{user.name}</h2>
          <p style={{fontSize: '14px', color: '#666'}}>{user.email}</p>
          <p style={{fontSize: '12px', color: '#999'}}>Vai trò: {role}</p>
        </div>

        <div className="courses-grid">
          {courses.map((c) => (
            <div key={c.id} className="course-card">
              <div className="course-header"></div>
              <div className="course-info">
                <h3>{c.name}</h3>
                <p>{c.teacher}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
