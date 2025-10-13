import "./Dashboard.css";

export default function Dashboard() {
  const courses = [
    { id: 1, name: "Hệ cơ sở dữ liệu", teacher: "TS Nguyễn Văn A" },
    { id: 2, name: "Mạng máy tính", teacher: "ThS Nguyễn Văn B" },
    { id: 3, name: "Công nghệ phần mềm", teacher: "ThS Phạm Văn C" },
  ];

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">BK-Elearning</div>
        <ul>
          <li>Trang chủ</li>
          <li>Các khóa học của tôi</li>
          <li>Lịch học</li>
          <li>Đăng ký</li>
        </ul>
      </nav>

      {/* Nội dung chính */}
      <div className="main-content">
        <div className="profile">
          <img src="/avatar.jpg" alt="avatar" className="avatar" />
          <h2>Biện Anh Khôi</h2>
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
